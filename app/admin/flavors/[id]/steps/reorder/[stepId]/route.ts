import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

type StepRow = {
    id: number;
    humor_flavor_id: number;
    step_order: number;
};

export async function GET(
    request: Request,
    {
        params,
    }: {
        params: Promise<{ id: string; stepId: string }>;
    }
) {
    const { id, stepId } = await params;
    const url = new URL(request.url);
    const direction = url.searchParams.get("direction");

    const flavorId = Number(id);
    const stepIdNum = Number(stepId);

    const supabase = await createClient();

    const { data: current } = await supabase
        .from("humor_flavor_steps")
        .select("*")
        .eq("id", stepIdNum)
        .single();

    if (!current) {
        return NextResponse.redirect(new URL(`/admin/flavors/${flavorId}`, request.url));
    }

    const currentStep = current as StepRow;

    let neighborQuery = supabase
        .from("humor_flavor_steps")
        .select("*")
        .eq("humor_flavor_id", flavorId);

    if (direction === "up") {
        neighborQuery = neighborQuery
            .lt("step_order", currentStep.step_order)
            .order("step_order", { ascending: false })
            .limit(1);
    } else {
        neighborQuery = neighborQuery
            .gt("step_order", currentStep.step_order)
            .order("step_order", { ascending: true })
            .limit(1);
    }

    const { data: neighborRows } = await neighborQuery;
    const neighbor = (neighborRows?.[0] as StepRow | undefined) ?? null;

    if (neighbor) {
        await supabase
            .from("humor_flavor_steps")
            .update({ step_order: -1 })
            .eq("id", currentStep.id);

        await supabase
            .from("humor_flavor_steps")
            .update({ step_order: currentStep.step_order })
            .eq("id", neighbor.id);

        await supabase
            .from("humor_flavor_steps")
            .update({ step_order: neighbor.step_order })
            .eq("id", currentStep.id);
    }

    return NextResponse.redirect(new URL(`/admin/flavors/${flavorId}`, request.url));
}