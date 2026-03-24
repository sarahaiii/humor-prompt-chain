import Link from "next/link";

export default function AdminPage() {
    return (
        <main className="min-h-screen px-6 py-10 text-white">
            <div className="mx-auto max-w-7xl">
                <div className="mb-10">
                    <p className="text-sm uppercase tracking-[0.3em] text-indigo-200/70">
                        Humor Prompt Chain
                    </p>
                    <h1 className="mt-3 text-5xl font-bold text-white">
                        Prompt Chain Tool
                    </h1>
                    <p className="mt-3 max-w-2xl text-indigo-100/70">
                        Manage humor flavors, ordered steps, and caption generation workflows.
                    </p>
                </div>

                <section className="mt-10">
                    <h2 className="mb-6 text-2xl font-semibold text-white">
                        Admin Sections
                    </h2>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                        <AdminCard href="/admin/flavors" title="Humor Flavors" />
                    </div>
                </section>
            </div>
        </main>
    );
}

function AdminCard({ href, title }: { href: string; title: string }) {
    return (
        <Link
            href={href}
            className="rounded-2xl border border-indigo-400/20 bg-indigo-500/10 p-6 text-indigo-50 transition hover:bg-indigo-500/20"
        >
            <div className="text-lg font-semibold">{title}</div>
            <p className="mt-2 text-sm text-indigo-200/70">
                Open {title.toLowerCase()}
            </p>
        </Link>
    );
}