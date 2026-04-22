import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

type Flavor = {
    id: number;
    slug?: string | null;
    description?: string | null;
};

export default async function EditFlavorPage({
                                                 params,
                                             }: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("humor_flavors")
        .select("*")
        .eq("id", Number(id))
        .single();

    if (error || !data) {
        return (
            <main className="min-h-screen px-6 py-10 text-[#1a3a5c]">
                <div className="mx-auto max-w-3xl">
                    <h1 className="text-4xl font-bold text-[#0c1a2e]">Edit Flavor</h1>
                    <p className="mt-4 text-red-500">
                        Error loading flavor: {error?.message ?? "Not found"}
                    </p>
                </div>
            </main>
        );
    }

    const flavor = data as Flavor;

    async function updateFlavor(formData: FormData) {
        "use server";

        const supabase = await createClient();

        const slug = formData.get("slug")?.toString() ?? "";
        const description = formData.get("description")?.toString() ?? "";

        await supabase
            .from("humor_flavors")
            .update({
                slug,
                description,
            })
            .eq("id", Number(id));

        redirect(`/admin/flavors/${id}`);
    }

    return (
        <main className="min-h-screen px-6 py-10 text-[#1a3a5c]">
            <div className="mx-auto max-w-3xl">
                <h1 className="text-4xl font-bold text-[#0c1a2e]">Edit Humor Flavor</h1>
                <p className="mt-3 text-[#6a9cbf]">
                    Update this humor flavor.
                </p>

                <form
                    action={updateFlavor}
                    className="mt-8 space-y-5 rounded-2xl border border-[rgba(120,175,255,0.4)] bg-white/75 p-6"
                >
                    <div>
                        <label className="mb-2 block text-sm font-medium">Slug</label>
                        <input
                            name="slug"
                            defaultValue={flavor.slug ?? ""}
                            className="w-full rounded-xl border border-[rgba(120,175,255,0.4)] px-4 py-3"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium">Description</label>
                        <textarea
                            name="description"
                            rows={5}
                            defaultValue={flavor.description ?? ""}
                            className="w-full rounded-xl border border-[rgba(120,175,255,0.4)] px-4 py-3"
                        />
                    </div>

                    <button className="rounded-full bg-[#60a5fa] px-5 py-3 font-semibold text-white hover:bg-[#3b82f6]">
                        Save Changes
                    </button>
                </form>
            </div>
        </main>
    );
}
