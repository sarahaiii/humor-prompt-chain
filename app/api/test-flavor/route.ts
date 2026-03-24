import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

type StepRow = {
    order_by?: number | null;
    llm_system_prompt?: string | null;
    llm_user_prompt?: string | null;
    llm_model_id?: number | null;
    llm_temperature?: number | null;
};

export async function POST(request: Request) {

    const { flavorId } = await request.json();

    const supabase = await createClient();

    const { data: steps } = await supabase
        .from("humor_flavor_steps")
        .select("*")
        .eq("humor_flavor_id", flavorId)
        .order("order_by");

    if (!steps || steps.length === 0) {
        return NextResponse.json({
            captions: ["No steps found"]
        });
    }

    // build prompt chain payload
    const chain = (steps as StepRow[]).map((step) => ({
        model_id: step.llm_model_id,
        system_prompt: step.llm_system_prompt,
        user_prompt: step.llm_user_prompt,
        temperature: step.llm_temperature ?? 0.7
    }));


    // call AlmostCrackd API
    const response = await fetch(
        "https://api.almostcrackd.ai/pipeline/run",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                chain
            })
        }
    );

    const result = await response.json();

    return NextResponse.json({
        captions: result.outputs ?? result
    });

}