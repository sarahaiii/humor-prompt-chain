import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

type HumorFlavorRow = {
    id: number;
    description?: string | null;
    slug?: string | null;
    created_datetime_utc?: string | null;
};

export default async function FlavorsPage() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("humor_flavors")
        .select("*")
        .order("created_datetime_utc", { ascending: false });

    if (error) {
        return (
            <main className="min-h-screen px-6 py-10 text-[#1a3a5c]">
                <div className="mx-auto max-w-6xl">
                    <h1 className="text-4xl font-bold text-[#0c1a2e]">Humor Flavors</h1>
                    <p className="mt-4 text-red-500">Error loading flavors: {error.message}</p>
                </div>
            </main>
        );
    }

    const rows = (data as HumorFlavorRow[] | null) ?? [];

    return (
        <main className="min-h-screen px-6 py-10 text-[#1a3a5c]">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8 flex items-end justify-between gap-4">
                    <div>
                        <p className="text-sm uppercase tracking-[0.3em] text-[#6a9cbf]">
                            Humor Prompt Chain
                        </p>
                        <div className="mt-3 flex items-center gap-3">
                            <h1 className="text-5xl font-bold text-[#0c1a2e]">Humor Flavors</h1>
                            {rows.length > 0 && (
                                <span className="mt-2 rounded-full bg-[#60a5fa]/15 px-3 py-1 text-sm font-semibold text-[#3b82f6]">
                                    {rows.length}
                                </span>
                            )}
                        </div>
                        <p className="mt-3 text-[#6a9cbf]">
                            Create, edit, delete, and test humor flavors.
                        </p>
                    </div>

                    <Link
                        href="/admin/flavors/new"
                        className="shrink-0 rounded-full bg-[#60a5fa] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#3b82f6]"
                    >
                        + New Flavor
                    </Link>
                </div>

                {rows.length > 0 ? (
                    <div className="overflow-hidden rounded-2xl border border-[rgba(120,175,255,0.4)] bg-white/75 shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm text-[#1a3a5c]">
                                <thead className="bg-blue-50 text-[#6a9cbf]">
                                    <tr>
                                        <th className="px-6 py-4 text-left">ID</th>
                                        <th className="px-6 py-4 text-left">Slug</th>
                                        <th className="px-6 py-4 text-left">Description</th>
                                        <th className="px-6 py-4 text-left">Created</th>
                                        <th className="px-6 py-4 text-left">Actions</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-[rgba(120,175,255,0.2)]">
                                    {rows.map((row) => (
                                        <tr key={row.id} className="hover:bg-blue-50/50">
                                            <td className="px-6 py-4 text-[#6a9cbf]">{row.id}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-2 w-2 rounded-full bg-[#60a5fa]" />
                                                    <span className="font-medium">{row.slug ?? "—"}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-[#6a9cbf]">{row.description ?? "—"}</td>
                                            <td className="px-6 py-4 text-xs text-[#6a9cbf]">
                                                {row.created_datetime_utc
                                                    ? new Date(row.created_datetime_utc).toLocaleDateString()
                                                    : "—"}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-4">
                                                    <Link
                                                        href={`/admin/flavors/${row.id}`}
                                                        className="text-[#3b82f6] hover:underline"
                                                    >
                                                        Open
                                                    </Link>
                                                    <Link
                                                        href={`/admin/flavors/${row.id}/edit`}
                                                        className="text-[#3b82f6] hover:underline"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <form action={`/admin/flavors/duplicate/${row.id}`}>
                                                        <button className="text-emerald-600 hover:underline">
                                                            Duplicate
                                                        </button>
                                                    </form>
                                                    <form action={`/admin/flavors/delete/${row.id}`}>
                                                        <button className="text-red-500 hover:underline">
                                                            Delete
                                                        </button>
                                                    </form>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[rgba(120,175,255,0.4)] py-24 text-center">
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#60a5fa]/10">
                            <svg className="h-8 w-8 text-[#60a5fa]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                        </div>
                        <p className="text-lg font-semibold text-[#0c1a2e]">No flavors yet</p>
                        <p className="mt-2 text-sm text-[#6a9cbf]">Create your first humor flavor to get started.</p>
                        <Link
                            href="/admin/flavors/new"
                            className="mt-6 rounded-full bg-[#60a5fa] px-6 py-3 text-sm font-semibold text-white hover:bg-[#3b82f6]"
                        >
                            + New Flavor
                        </Link>
                    </div>
                )}
            </div>
        </main>
    );
}