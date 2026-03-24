import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default function NewFlavorPage() {
    async function createFlavor(formData: FormData) {
        "use server";

        const supabase = await createClient();

        const slug = formData.get("slug")?.toString() ?? "";
        const description = formData.get("description")?.toString() ?? "";

        await supabase.from("humor_flavors").insert({
            slug,
            description,
        });

        redirect("/admin/flavors");
    }

    return (
        <main className="min-h-screen px-6 py-10 text-white">
            <div className="mx-auto max-w-3xl">
                <h1 className="text-4xl font-bold">New Humor Flavor</h1>
                <p className="mt-3 text-slate-300">
                    Create a new humor flavor.
                </p>

                <form
                    action={createFlavor}
                    className="mt-8 space-y-5 rounded-2xl border border-indigo-400/20 bg-white p-6 text-gray-900"
                >
                    <div>
                        <label className="mb-2 block text-sm font-medium">Slug</label>
                        <input
                            name="slug"
                            placeholder="sarcastic-office"
                            className="w-full rounded-xl border px-4 py-3"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium">Description</label>
                        <textarea
                            name="description"
                            rows={5}
                            placeholder="Short explanation of this humor flavor"
                            className="w-full rounded-xl border px-4 py-3"
                        />
                    </div>

                    <button className="rounded-full bg-indigo-600 px-5 py-3 font-semibold text-white">
                        Create Flavor
                    </button>
                </form>
            </div>
        </main>
    );
}