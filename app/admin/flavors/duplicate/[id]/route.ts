import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const supabase = await createClient();

    const flavorId = Number(id);

    // Fetch the original flavor
    const { data: original } = await supabase
        .from("humor_flavors")
        .select("*")
        .eq("id", flavorId)
        .single();

    if (!original) {
        return NextResponse.redirect(new URL("/admin/flavors", request.url));
    }

    // Find a unique slug: "slug-copy", "slug-copy-2", "slug-copy-3", …
    const base = `${original.slug ?? "flavor"}-copy`;
    let newSlug = base;
    let counter = 1;

    while (true) {
        const { data: clash } = await supabase
            .from("humor_flavors")
            .select("id")
            .eq("slug", newSlug)
            .maybeSingle();

        if (!clash) break;
        counter += 1;
        newSlug = `${base}-${counter}`;
    }

    // Create the duplicate flavor
    const now = new Date().toISOString();
    const { data: newFlavor, error: flavorErr } = await supabase
        .from("humor_flavors")
        .insert({
            slug: newSlug,
            description: original.description ?? null,
            created_by_user_id: null,
            modified_by_user_id: null,
            created_datetime_utc: now,
            modified_datetime_utc: now,
        })
        .select()
        .single();

    if (flavorErr || !newFlavor) {
        console.error("Duplicate flavor error:", flavorErr);
        return NextResponse.redirect(new URL("/admin/flavors", request.url));
    }

    // Fetch and clone all steps
    const { data: steps } = await supabase
        .from("humor_flavor_steps")
        .select("*")
        .eq("humor_flavor_id", flavorId)
        .order("order_by");

    if (steps && steps.length > 0) {
        const clonedSteps = steps.map(({ id: _id, humor_flavor_id: _fid, ...rest }) => ({
            ...rest,
            humor_flavor_id: newFlavor.id,
        }));

        const { error: stepsErr } = await supabase
            .from("humor_flavor_steps")
            .insert(clonedSteps);

        if (stepsErr) {
            console.error("Duplicate steps error:", stepsErr);
        }
    }

    return NextResponse.redirect(new URL(`/admin/flavors/${newFlavor.id}`, request.url));
}
