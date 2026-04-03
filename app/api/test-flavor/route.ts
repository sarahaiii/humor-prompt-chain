import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

type StepRow = {
    order_by?: number | null;
    llm_system_prompt?: string | null;
    llm_user_prompt?: string | null;
    llm_model_id?: number | null;
    llm_temperature?: number | null;
};

type CaptionItem = {
    content?: string;
};

type ApiResult =
    | string
    | CaptionItem
    | {
    captions?: Array<string | CaptionItem>;
    outputs?: Array<string | CaptionItem>;
    error?: string;
    message?: string;
}
    | {
    rawText: string;
};

type ImageRow = {
    id: number;
};

function extractCaptions(value: Array<string | CaptionItem>): string[] {
    return value
        .map((row) => {
            if (typeof row === "string") return row;
            if (typeof row?.content === "string") return row.content;
            return null;
        })
        .filter((x): x is string => Boolean(x && x.trim().length > 0));
}

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as {
            flavorId?: number;
            imageId?: number | string;
        };

        const flavorId = Number(body.flavorId);
        const rawImageId = body.imageId;

        if (!flavorId || Number.isNaN(flavorId)) {
            return NextResponse.json({ error: "Missing or invalid flavorId" }, { status: 400 });
        }

        const supabase = await createClient();

        const {
            data: { session },
            error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError || !session?.access_token) {
            return NextResponse.json(
                { error: "Not logged in / missing session" },
                { status: 401 }
            );
        }

        const { data: steps, error: stepsError } = await supabase
            .from("humor_flavor_steps")
            .select("*")
            .eq("humor_flavor_id", flavorId)
            .order("order_by", { ascending: true });

        if (stepsError) {
            return NextResponse.json({ error: stepsError.message }, { status: 500 });
        }

        if (!steps || steps.length === 0) {
            return NextResponse.json(
                { error: "No steps found for this flavor." },
                { status: 400 }
            );
        }

        const rows = steps as StepRow[];

        const chain = rows.map((step) => ({
            model_id: step.llm_model_id,
            system_prompt: step.llm_system_prompt ?? "",
            user_prompt: step.llm_user_prompt ?? "",
            temperature: step.llm_temperature ?? 0.7,
        }));

        let resolvedImageId: number | null = null;

        if (
            rawImageId !== undefined &&
            rawImageId !== null &&
            String(rawImageId).trim() !== ""
        ) {
            const parsed = Number(rawImageId);
            if (!Number.isNaN(parsed) && parsed > 0) {
                resolvedImageId = parsed;
            }
        }

        if (!resolvedImageId) {
            const { data: latestImage, error: latestImageError } = await supabase
                .from("images")
                .select("id")
                .order("id", { ascending: false })
                .limit(1)
                .maybeSingle();

            if (latestImageError) {
                return NextResponse.json(
                    { error: latestImageError.message },
                    { status: 500 }
                );
            }

            if (!latestImage) {
                return NextResponse.json(
                    {
                        error:
                            "No images found. Upload an image in your caption app first, or enter a valid Test Image ID.",
                    },
                    { status: 400 }
                );
            }

            resolvedImageId = (latestImage as ImageRow).id;
        }

        const response = await fetch(
            "https://api.almostcrackd.ai/pipeline/generate-captions",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${session.access_token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    imageId: resolvedImageId,
                    chain,
                }),
            }
        );

        const responseText = await response.text();

        let result: ApiResult;
        try {
            result = JSON.parse(responseText) as ApiResult;
        } catch {
            result = { rawText: responseText };
        }

        if (!response.ok) {
            const errorMessage =
                typeof result === "object" && result !== null && "error" in result
                    ? result.error
                    : typeof result === "object" && result !== null && "message" in result
                        ? result.message
                        : "AlmostCrackd API failed";

            return NextResponse.json(
                {
                    error: errorMessage,
                    details: result,
                    imageIdUsed: resolvedImageId,
                },
                { status: response.status }
            );
        }

        let captions: string[] = [];

        if (Array.isArray(result)) {
            captions = extractCaptions(result);
        } else if (
            typeof result === "object" &&
            result !== null &&
            "captions" in result &&
            Array.isArray(result.captions)
        ) {
            captions = extractCaptions(result.captions);
        } else if (
            typeof result === "object" &&
            result !== null &&
            "outputs" in result &&
            Array.isArray(result.outputs)
        ) {
            captions = extractCaptions(result.outputs);
        }

        return NextResponse.json({
            ok: true,
            captions,
            raw: result,
            imageIdUsed: resolvedImageId,
        });
    } catch (error) {
        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : "Unknown server error",
            },
            { status: 500 }
        );
    }
}