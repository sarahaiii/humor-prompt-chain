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
            <main className="min-h-screen px-6 py-10 text-white">
                <div className="mx-auto max-w-3xl">
                    <h1 className="text-4xl font-bold">Edit Flavor</h1>
                    <p className="mt-4 text-red-300">
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
        <main className="min-h-screen px-6 py-10 text-white">
            <div className="mx-auto max-w-3xl">
                <h1 className="text-4xl font-bold">Edit Humor Flavor</h1>
                <p className="mt-3 text-slate-300">
                    Update this humor flavor.
                </p>

                <form
                    action={updateFlavor}
                    className="mt-8 space-y-5 rounded-2xl border border-indigo-400/20 bg-white p-6 text-gray-900"
                >
                    <div>
                        <label className="mb-2 block text-sm font-medium">Slug</label>
                        <input
                            name="slug"
                            defaultValue={flavor.slug ?? ""}
                            className="w-full rounded-xl border px-4 py-3"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium">Description</label>
                        <textarea
                            name="description"
                            rows={5}
                            defaultValue={flavor.description ?? ""}
                            className="w-full rounded-xl border px-4 py-3"
                        />
                    </div>

                    <button className="rounded-full bg-indigo-600 px-5 py-3 font-semibold text-white">
                        Save Changes
                    </button>
                </form>
            </div>
        </main>
    );
}