"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Flavor = {
    id: number;
    slug: string | null;
    description: string | null;
};

type Props = {
    flavors: Flavor[];
    title: string;
    userEmail: string;
};

export default function FlavorSidebar({ flavors, title, userEmail }: Props) {
    const pathname = usePathname();

    return (
        <aside className="flex h-screen w-60 shrink-0 flex-col border-r border-[rgba(120,175,255,0.3)] bg-white/70 backdrop-blur-sm sticky top-0">
            {/* header */}
            <div className="border-b border-[rgba(120,175,255,0.25)] px-4 py-4">
                <Link href="/admin/flavors" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#60a5fa]/15">
                        <svg className="h-3.5 w-3.5 text-[#3b82f6]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                    </div>
                    <span className="text-sm font-semibold text-[#0c1a2e]">Prompt Chain</span>
                </Link>
            </div>

            {/* new flavor */}
            <div className="px-3 pt-3 pb-1">
                <Link
                    href="/admin/flavors/new"
                    className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#60a5fa] py-2 text-sm font-semibold text-white transition hover:bg-[#3b82f6]"
                >
                    <span className="text-base leading-none">+</span>
                    <span>New Flavor</span>
                </Link>
            </div>

            {/* flavor list */}
            <div className="flex-1 overflow-y-auto px-2 py-2">
                {/* all flavors shortcut */}
                <Link
                    href="/admin/flavors"
                    className={`mb-2 flex items-center gap-2 rounded-lg border-l-2 px-3 py-2 transition-colors ${
                        pathname === "/admin/flavors"
                            ? "border-[#60a5fa] bg-[#60a5fa]/10 font-semibold text-[#0c1a2e]"
                            : "border-transparent text-[#6a9cbf] hover:bg-blue-50/70 hover:text-[#1a3a5c]"
                    } text-sm`}
                >
                    <svg className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                    All Flavors
                </Link>

                <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-widest text-[#6a9cbf]">
                    {title}
                </p>

                <div className="space-y-px">
                    {flavors.map((f) => {
                        const isActive = pathname === `/admin/flavors/${f.id}` ||
                            pathname.startsWith(`/admin/flavors/${f.id}/`);

                        return (
                            <Link
                                key={f.id}
                                href={`/admin/flavors/${f.id}`}
                                className={`flex flex-col rounded-lg border-l-2 px-3 py-2.5 transition-colors ${
                                    isActive
                                        ? "border-[#60a5fa] bg-[#60a5fa]/10"
                                        : "border-transparent hover:bg-blue-50/70"
                                }`}
                            >
                                <span className={`truncate text-sm leading-snug ${
                                    isActive ? "font-semibold text-[#0c1a2e]" : "font-medium text-[#1a3a5c]"
                                }`}>
                                    {f.slug ?? `Flavor ${f.id}`}
                                </span>
                                {f.description && (
                                    <span className="mt-0.5 truncate text-xs text-[#6a9cbf]">
                                        {f.description}
                                    </span>
                                )}
                            </Link>
                        );
                    })}

                    {flavors.length === 0 && (
                        <p className="px-3 py-3 text-xs text-[#6a9cbf]">No flavors yet.</p>
                    )}
                </div>
            </div>

            {/* footer */}
            <div className="border-t border-[rgba(120,175,255,0.25)] px-4 py-3">
                <p className="truncate text-xs text-[#6a9cbf]">{userEmail}</p>
                <form action="/auth/signout" method="POST" className="mt-1.5">
                    <button
                        type="submit"
                        className="text-xs text-[#6a9cbf] transition hover:text-[#0c1a2e]"
                    >
                        Sign out
                    </button>
                </form>
            </div>
        </aside>
    );
}
