import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

type ExistingStep = {
    id: number;
    order_by?: number | null;
};

export default async function NewFlavorStepPage({
                                                    params,
                                                }: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const flavorId = Number(id);

    const supabase = await createClient();

    const { data: existingSteps } = await supabase
        .from("humor_flavor_steps")
        .select("id, order_by")
        .eq("humor_flavor_id", flavorId)
        .order("order_by");

    const rows = (existingSteps ?? []) as ExistingStep[];
    const nextOrder =
        rows.length > 0
            ? Math.max(...rows.map((s) => s.order_by ?? 0)) + 1
            : 1;

    async function createStep(formData: FormData) {
        "use server";

        const supabase = await createClient();

        const orderBy = Number(formData.get("order_by")?.toString() ?? `${nextOrder}`);
        const description = formData.get("description")?.toString() ?? "";
        const llmSystemPrompt = formData.get("llm_system_prompt")?.toString() ?? "";
        const llmUserPrompt = formData.get("llm_user_prompt")?.toString() ?? "";

        const { error } = await supabase.from("humor_flavor_steps").insert({
            humor_flavor_id: flavorId,
            order_by: orderBy,
            description,
            llm_system_prompt: llmSystemPrompt,
            llm_user_prompt: llmUserPrompt,
            llm_input_type_id: 1,
            llm_output_type_id: 1,
            llm_model_id: 14,
            humor_flavor_step_type_id: 1,
            llm_temperature: null,
        });

        if (error) {
            throw new Error(error.message);
        }

        redirect(`/admin/flavors/${flavorId}`);
    }

    return (
        <main className="min-h-screen px-6 py-10 text-white">
            <div className="mx-auto max-w-3xl">
                <h1 className="text-4xl font-bold">Add Flavor Step</h1>
                <p className="mt-3 text-slate-300">
                    Add a new ordered step to this humor flavor.
                </p>

                <form
                    action={createStep}
                    className="mt-8 space-y-5 rounded-2xl border border-indigo-400/20 bg-white p-6 text-gray-900"
                >
                    <div>
                        <label className="mb-2 block text-sm font-medium">Order</label>
                        <input
                            name="order_by"
                            type="number"
                            defaultValue={nextOrder}
                            className="w-full rounded-xl border px-4 py-3"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium">Description</label>
                        <input
                            name="description"
                            className="w-full rounded-xl border px-4 py-3"
                            placeholder="Short label for this step"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium">System Prompt</label>
                        <textarea
                            name="llm_system_prompt"
                            rows={6}
                            className="w-full rounded-xl border px-4 py-3"
                            placeholder="You are a funny caption assistant..."
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium">User Prompt</label>
                        <textarea
                            name="llm_user_prompt"
                            rows={6}
                            className="w-full rounded-xl border px-4 py-3"
                            placeholder="Describe the image and generate captions..."
                        />
                    </div>

                    <button className="rounded-full bg-indigo-600 px-5 py-3 font-semibold text-white">
                        Create Step
                    </button>
                </form>
            </div>
        </main>
    );
}