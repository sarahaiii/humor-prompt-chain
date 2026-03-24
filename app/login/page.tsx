"use client";

import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
    const signIn = async () => {
        const supabase = createClient();

        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });
    };

    return (
        <main className="flex min-h-screen items-center justify-center px-6 py-12 text-white">
            <div className="glass-card w-full max-w-md">
                <p className="text-sm uppercase tracking-[0.3em] text-indigo-200">
                    Humor Prompt Chain
                </p>

                <h1 className="mt-4 text-4xl font-bold text-white">Sign in</h1>

                <p className="mt-3 text-slate-300">
                    Access is limited to superadmins and matrix admins.
                </p>

                <button
                    onClick={signIn}
                    className="mt-8 w-full rounded-full bg-white px-6 py-3 font-semibold text-slate-900 transition hover:bg-slate-200"
                >
                    Sign in with Google
                </button>
            </div>
        </main>
    );
}