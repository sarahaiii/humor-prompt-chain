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
            <main className="min-h-screen px-6 py-10 text-white">
                <div className="mx-auto max-w-6xl">
                    <h1 className="text-4xl font-bold">Humor Flavors</h1>
                    <p className="mt-4 text-red-300">Error loading flavors: {error.message}</p>
                </div>
            </main>
        );
    }

    const rows = data as HumorFlavorRow[] | null;

    return (
        <main className="min-h-screen px-6 py-10 text-white">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <p className="text-sm uppercase tracking-[0.3em] text-indigo-200">
                            Humor Prompt Chain
                        </p>
                        <h1 className="mt-3 text-5xl font-bold">Humor Flavors</h1>
                        <p className="mt-3 text-slate-300">
                            Create, edit, delete, and test humor flavors.
                        </p>
                    </div>

                    <Link
                        href="/admin/flavors/new"
                        className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
                    >
                        + New Flavor
                    </Link>
                </div>

                <div className="overflow-hidden rounded-2xl border border-indigo-400/20 bg-white shadow-sm text-gray-900">
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-gray-100 text-gray-700">
                            <tr>
                                <th className="px-6 py-4 text-left">ID</th>
                                <th className="px-6 py-4 text-left">Slug</th>
                                <th className="px-6 py-4 text-left">Description</th>
                                <th className="px-6 py-4 text-left">Created</th>
                                <th className="px-6 py-4 text-left">Actions</th>
                            </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-200">
                            {rows?.map((row) => (
                                <tr key={row.id} className="hover:bg-gray-50">
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
                                                className="text-indigo-600 hover:underline"
                                            >
                                                Open
                                            </Link>

                                            <Link
                                                href={`/admin/flavors/${row.id}/edit`}
                                                className="text-blue-600 hover:underline"
                                            >
                                                Edit
                                            </Link>

                                            <form action={`/admin/flavors/delete/${row.id}`}>
                                                <button className="text-red-600 hover:underline">
                                                    Delete
                                                </button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {!rows?.length && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
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