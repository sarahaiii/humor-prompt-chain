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

    const rows = data as HumorFlavorRow[] | null;

    return (
        <main className="min-h-screen px-6 py-10 text-[#1a3a5c]">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <p className="text-sm uppercase tracking-[0.3em] text-[#6a9cbf]">
                            Humor Prompt Chain
                        </p>
                        <h1 className="mt-3 text-5xl font-bold text-[#0c1a2e]">Humor Flavors</h1>
                        <p className="mt-3 text-[#6a9cbf]">
                            Create, edit, delete, and test humor flavors.
                        </p>
                    </div>

                    <Link
                        href="/admin/flavors/new"
                        className="rounded-full bg-[#60a5fa] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#3b82f6]"
                    >
                        + New Flavor
                    </Link>
                </div>

                <div className="overflow-hidden rounded-2xl border border-[rgba(120,175,255,0.4)] bg-white/75 shadow-sm text-[#1a3a5c]">
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
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
                            {rows?.map((row) => (
                                <tr key={row.id} className="hover:bg-blue-50/50">
                                    <td className="px-6 py-4">{row.id}</td>
                                    <td className="px-6 py-4 font-medium">{row.slug ?? "-"}</td>
                                    <td className="px-6 py-4">{row.description ?? "-"}</td>
                                    <td className="px-6 py-4 text-xs">
                                        {row.created_datetime_utc ?? "-"}
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
                            {!rows?.length && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-10 text-center text-[#6a9cbf]">
                                        No humor flavors found.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    );
}
