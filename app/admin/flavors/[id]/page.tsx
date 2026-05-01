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

    const stepList = (steps as Step[] | null) ?? [];

    return (
        <main className="min-h-screen px-8 py-10 text-[#1a3a5c]">
            <div className="mx-auto max-w-6xl space-y-8">
                {/* header */}
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#60a5fa]/15">
                                <svg className="h-5 w-5 text-[#3b82f6]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                </svg>
                            </div>
                            <h1 className="text-3xl font-bold text-[#0c1a2e]">
                                {flavor?.slug ?? "Flavor"}
                            </h1>
                        </div>
                        {flavor?.description && (
                            <p className="mt-2 ml-[52px] text-sm text-[#6a9cbf]">
                                {flavor.description}
                            </p>
                        )}
                    </div>

                    <div className="flex shrink-0 gap-3">
                        <Link
                            href={`/admin/flavors/${flavorId}/edit`}
                            className="rounded-lg border border-[rgba(120,175,255,0.4)] bg-white/75 px-4 py-2 text-sm font-medium text-[#1a3a5c] hover:bg-blue-50"
                        >
                            edit flavor
                        </Link>

                        <Link
                            href={`/admin/flavors/${flavorId}/steps/new`}
                            className="rounded-lg bg-[#60a5fa] px-4 py-2 text-sm font-medium text-white hover:bg-[#3b82f6]"
                        >
                            + add step
                        </Link>

                        <form action={`/admin/flavors/delete/${flavorId}`}>
                            <button className="rounded-lg border border-red-300 px-4 py-2 text-sm text-red-500 hover:bg-red-50">
                                delete
                            </button>
                        </form>
                    </div>
                </div>

                {/* chain visualization */}
                {stepList.length > 0 ? (
                    <div className="space-y-0">
                        {stepList.map((step, i) => (
                            <div key={step.id} className="flex gap-5">
                                {/* left: circle + connector line */}
                                <div className="flex flex-col items-center">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#60a5fa] text-sm font-bold text-white shadow-sm">
                                        {step.order_by ?? i + 1}
                                    </div>
                                    {i < stepList.length - 1 && (
                                        <div className="mt-1 mb-1 w-px flex-1 bg-gradient-to-b from-[#60a5fa]/40 to-[#60a5fa]/10" style={{ minHeight: "1.5rem" }} />
                                    )}
                                </div>

                                {/* right: content card */}
                                <div className="flex-1 pb-5">
                                    <div className="rounded-xl border border-[rgba(120,175,255,0.4)] bg-white/75 p-5">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1 min-w-0">
                                                {step.description && (
                                                    <p className="mb-3 text-sm font-semibold text-[#3b82f6]">
                                                        {step.description}
                                                    </p>
                                                )}

                                                <div>
                                                    <p className="text-xs uppercase tracking-wide text-[#6a9cbf]">
                                                        System Prompt
                                                    </p>
                                                    <p className="mt-1 whitespace-pre-wrap text-sm text-[#1a3a5c]">
                                                        {step.llm_system_prompt ?? "—"}
                                                    </p>
                                                </div>

                                                <div className="mt-4">
                                                    <p className="text-xs uppercase tracking-wide text-[#6a9cbf]">
                                                        User Prompt
                                                    </p>
                                                    <p className="mt-1 whitespace-pre-wrap text-sm text-[#1a3a5c]">
                                                        {step.llm_user_prompt ?? "—"}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex shrink-0 flex-col items-end gap-3 text-sm">
                                                <div className="flex gap-3">
                                                    <form action={`/admin/flavors/${flavorId}/steps/reorder/${step.id}?direction=up`}>
                                                        <button className="text-[#60a5fa] hover:text-[#3b82f6]">↑</button>
                                                    </form>
                                                    <form action={`/admin/flavors/${flavorId}/steps/reorder/${step.id}?direction=down`}>
                                                        <button className="text-[#60a5fa] hover:text-[#3b82f6]">↓</button>
                                                    </form>
                                                </div>
                                                <Link
                                                    href={`/admin/flavors/${flavorId}/steps/${step.id}/edit`}
                                                    className="text-[#3b82f6] hover:underline"
                                                >
                                                    edit
                                                </Link>
                                                <form action={`/admin/flavors/${flavorId}/steps/delete/${step.id}`}>
                                                    <button className="text-red-500 hover:underline">delete</button>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[rgba(120,175,255,0.4)] py-16 text-center">
                        <svg className="mb-4 h-12 w-12 text-[rgba(120,175,255,0.5)]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        <p className="text-sm text-[#6a9cbf]">No steps yet</p>
                        <Link
                            href={`/admin/flavors/${flavorId}/steps/new`}
                            className="mt-4 rounded-full bg-[#60a5fa] px-5 py-2 text-sm font-semibold text-white hover:bg-[#3b82f6]"
                        >
                            + add first step
                        </Link>
                    </div>
                )}

                <TestFlavor flavorId={flavorId} />
            </div>
        </main>
    );
}