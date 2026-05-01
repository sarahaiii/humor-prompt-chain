"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function createFlavor(
    _prevState: { error: string } | null,
    formData: FormData
): Promise<{ error: string } | null> {
    const slug = formData.get("slug")?.toString().trim() ?? "";
    const description = formData.get("description")?.toString().trim() ?? "";

    if (!slug) {
        return { error: "Slug is required." };
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const now = new Date().toISOString();

    const { error } = await supabase.from("humor_flavors").insert({
        slug,
        description,
        created_datetime_utc: now,
        modified_datetime_utc: now,
        created_by_user_id: user?.id,
        modified_by_user_id: user?.id,
    });

    if (error) {
        return { error: error.message };
    }

    redirect("/admin/flavors");
}
