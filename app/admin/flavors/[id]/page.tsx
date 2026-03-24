import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import TestFlavor from "./TestFlavor";

type Flavor = {
    id: number;
    slug: string | null;
    description: string | null;
};

type Step = {
    id: number;
    humor_flavor_id: number;
    order_by: number | null;
    llm_system_prompt: string | null;
    llm_user_prompt: string | null;
    description: string | null;
};

export default async function Page({
                                       params,
                                   }: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const flavorId = Number(id);

    const supabase = await createClient();

    const { data: flavor } = await supabase
        .from("humor_flavors")
        .select("*")
        .eq("id", flavorId)
        .single();

    const { data: steps } = await supabase
        .from("humor_flavor_steps")
        .select("*")
        .eq("humor_flavor_id", flavorId)
        .order("order_by");

    return (
        <main className="min-h-screen px-8 py-10">
            <div className="mx-auto max-w-6xl space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <Link
                            href="/admin/flavors"
                            className="text-sm text-slate-400 hover:underline"
                        >
                            ← back
                        </Link>

                        <h1 className="mt-2 text-3xl font-semibold text-white">
                            {flavor?.slug ?? "Flavor"}
                        </h1>

                        <p className="mt-1 text-sm text-slate-300">
                            {flavor?.description}
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <Link
                            href={`/admin/flavors/${flavorId}/edit`}
                            className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-900"
                        >
                            edit flavor
                        </Link>

                        <Link
                            href={`/admin/flavors/${flavorId}/steps/new`}
                            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white"
                        >
                            + add step
                        </Link>

                        <form action={`/admin/flavors/delete/${flavorId}`}>
                            <button className="rounded-lg border border-red-300 px-4 py-2 text-sm text-red-300 hover:bg-red-500/10">
                                delete
                            </button>
                        </form>
                    </div>
                </div>

                <div className="space-y-4">
                    {(steps as Step[] | null)?.map((step) => (
                        <div
                            key={step.id}
                            className="rounded-xl border border-slate-700 bg-slate-900 p-5"
                        >
                            <div className="flex items-start justify-between gap-6">
                                <div className="flex-1">
                                    <p className="text-xs text-slate-400">
                                        step {step.order_by ?? "-"}
                                    </p>

                                    {step.description && (
                                        <p className="mt-2 text-sm font-medium text-indigo-300">
                                            {step.description}
                                        </p>
                                    )}

                                    <div className="mt-3">
                                        <p className="text-xs uppercase tracking-wide text-slate-400">
                                            System Prompt
                                        </p>
                                        <p className="mt-1 whitespace-pre-wrap text-sm text-white">
                                            {step.llm_system_prompt ?? "-"}
                                        </p>
                                    </div>

                                    <div className="mt-4">
                                        <p className="text-xs uppercase tracking-wide text-slate-400">
                                            User Prompt
                                        </p>
                                        <p className="mt-1 whitespace-pre-wrap text-sm text-white">
                                            {step.llm_user_prompt ?? "-"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4 text-sm">
                                    <form
                                        action={`/admin/flavors/${flavorId}/steps/reorder/${step.id}?direction=up`}
                                    >
                                        <button className="text-indigo-400 hover:underline">
                                            ↑
                                        </button>
                                    </form>

                                    <form
                                        action={`/admin/flavors/${flavorId}/steps/reorder/${step.id}?direction=down`}
                                    >
                                        <button className="text-indigo-400 hover:underline">
                                            ↓
                                        </button>
                                    </form>

                                    <Link
                                        href={`/admin/flavors/${flavorId}/steps/${step.id}/edit`}
                                        className="text-blue-400 hover:underline"
                                    >
                                        edit
                                    </Link>

                                    <form
                                        action={`/admin/flavors/${flavorId}/steps/delete/${step.id}`}
                                    >
                                        <button className="text-red-400 hover:underline">
                                            delete
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    ))}

                    {!steps?.length && (
                        <p className="text-sm text-slate-400">no steps yet</p>
                    )}
                </div>

                <TestFlavor flavorId={flavorId} />
            </div>
        </main>
    );
}