import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default function NewFlavorPage() {
    async function createFlavor(formData: FormData) {
        "use server";

        const supabase = await createClient();

        const slug = formData.get("slug")?.toString().trim() ?? "";
        const description = formData.get("description")?.toString().trim() ?? "";

        if (!slug) {
            throw new Error("Slug is required.");
        }

        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
            throw new Error("You must be signed in to create a humor flavor.");
        }

        const now = new Date().toISOString();

        const { error } = await supabase.from("humor_flavors").insert({
            slug,
            description,
            created_by_user_id: user.id,
            modified_by_user_id: user.id,
            created_datetime_utc: now,
            modified_datetime_utc: now,
        });

        if (error) {
            console.error("Create flavor error:", error);
            throw new Error(error.message);
        }

        redirect("/admin/flavors");
    }

    return (
        <main className="min-h-screen px-6 py-10 text-[#1a3a5c]">
            <div className="mx-auto max-w-3xl">
                <h1 className="text-4xl font-bold text-[#0c1a2e]">New Humor Flavor</h1>
                <p className="mt-3 text-[#6a9cbf]">
                    Create a new humor flavor.
                </p>

                <form
                    action={createFlavor}
                    className="mt-8 space-y-5 rounded-2xl border border-[rgba(120,175,255,0.4)] bg-white/75 p-6"
                >
                    <div>
                        <label className="mb-2 block text-sm font-medium">Slug</label>
                        <input
                            name="slug"
                            placeholder="main-character-energy"
                            className="w-full rounded-xl border border-[rgba(120,175,255,0.4)] px-4 py-3"
                            required
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium">Description</label>
                        <textarea
                            name="description"
                            rows={5}
                            placeholder="Short explanation of this humor flavor"
                            className="w-full rounded-xl border border-[rgba(120,175,255,0.4)] px-4 py-3"
                        />
                    </div>

                    <button
                        type="submit"
                        className="rounded-full bg-[#60a5fa] px-5 py-3 font-semibold text-white hover:bg-[#3b82f6]"
                    >
                        Create Flavor
                    </button>
                </form>
            </div>
        </main>
    );
}
