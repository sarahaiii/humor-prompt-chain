import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

type Step = {
    id: number;
    order_by: number | null;
    description: string | null;
    llm_system_prompt: string | null;
    llm_user_prompt: string | null;
};

export default async function EditStepPage({
                                               params,
                                           }: {
    params: Promise<{ id: string; stepId: string }>;
}) {
    const { id, stepId } = await params;

    const flavorId = Number(id);
    const stepIdNum = Number(stepId);

    const supabase = await createClient();

    const { data: step } = await supabase
        .from("humor_flavor_steps")
        .select("*")
        .eq("id", stepIdNum)
        .single();

    if (!step) {
        return (
            <main className="min-h-screen px-6 py-10 text-white">
                Step not found
            </main>
        );
    }

    async function updateStep(formData: FormData) {
        "use server";

        const supabase = await createClient();

        const orderBy = Number(formData.get("order_by")?.toString() ?? "1");
        const description = formData.get("description")?.toString() ?? "";
        const llmSystemPrompt = formData.get("llm_system_prompt")?.toString() ?? "";
        const llmUserPrompt = formData.get("llm_user_prompt")?.toString() ?? "";

        await supabase
            .from("humor_flavor_steps")
            .update({
                order_by: orderBy,
                description,
                llm_system_prompt: llmSystemPrompt,
                llm_user_prompt: llmUserPrompt,
            })
            .eq("id", stepIdNum);

        redirect(`/admin/flavors/${flavorId}`);
    }

    const row = step as Step;

    return (
        <main className="min-h-screen px-6 py-10 text-white">
            <div className="mx-auto max-w-3xl">
                <h1 className="text-4xl font-bold">Edit Step</h1>
                <p className="mt-3 text-slate-300">
                    Update this humor flavor step.
                </p>

                <form
                    action={updateStep}
                    className="mt-8 space-y-5 rounded-2xl border border-indigo-400/20 bg-white p-6 text-gray-900"
                >
                    <div>
                        <label className="mb-2 block text-sm font-medium">Order</label>
                        <input
                            name="order_by"
                            type="number"
                            defaultValue={row.order_by ?? 1}
                            className="w-full rounded-xl border px-4 py-3"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium">Description</label>
                        <input
                            name="description"
                            defaultValue={row.description ?? ""}
                            className="w-full rounded-xl border px-4 py-3"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium">System Prompt</label>
                        <textarea
                            name="llm_system_prompt"
                            rows={6}
                            defaultValue={row.llm_system_prompt ?? ""}
                            className="w-full rounded-xl border px-4 py-3"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium">User Prompt</label>
                        <textarea
                            name="llm_user_prompt"
                            rows={6}
                            defaultValue={row.llm_user_prompt ?? ""}
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