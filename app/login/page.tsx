"use client";

import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
    const handleLogin = async () => {
        const supabase = createClient();

        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });
    };

    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6">
            {/* decorative blobs */}
            <div className="pointer-events-none absolute -top-48 -right-48 h-[500px] w-[500px] rounded-full bg-blue-300 opacity-20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-48 -left-48 h-[500px] w-[500px] rounded-full bg-blue-400 opacity-15 blur-3xl" />
            <div className="pointer-events-none absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-200 opacity-10 blur-3xl" />

            <div className="glass-card relative w-full max-w-md">
                {/* chain icon */}
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#60a5fa]/15">
                    <svg
                        className="h-6 w-6 text-[#3b82f6]"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                        />
                    </svg>
                </div>

                <p className="text-sm uppercase tracking-[0.3em] text-[#6a9cbf]">Humor Project</p>
                <h1 className="mt-2 text-4xl font-bold text-[#0c1a2e]">Prompt Chain Tool</h1>
                <p className="mt-3 text-[#6a9cbf]">Internal tool — authorized users only.</p>
                <button
                    onClick={handleLogin}
                    className="mt-8 flex w-full items-center justify-center gap-3 rounded-full bg-[#60a5fa] px-6 py-3 font-semibold text-white transition hover:bg-[#3b82f6]"
                >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#fff" opacity=".9"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#fff" opacity=".9"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#fff" opacity=".9"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#fff" opacity=".9"/>
                    </svg>
                    Sign in with Google
                </button>
            </div>
        </main>
    );
}