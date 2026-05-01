"use client";

import { useActionState } from "react";
import { createFlavor } from "./actions";

export default function NewFlavorPage() {
    const [state, formAction, pending] = useActionState(createFlavor, null);

    return (
        <main className="min-h-screen px-6 py-10 text-[#1a3a5c]">
            <div className="mx-auto max-w-3xl">
                <h1 className="text-4xl font-bold text-[#0c1a2e]">New Humor Flavor</h1>
                <p className="mt-3 text-[#6a9cbf]">Create a new humor flavor.</p>

                <form
                    action={formAction}
                    className="mt-8 space-y-5 rounded-2xl border border-[rgba(120,175,255,0.4)] bg-white/75 p-6"
                >
                    {state?.error && (
                        <p className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                            {state.error}
                        </p>
                    )}

                    <div>
                        <label className="mb-2 block text-sm font-medium">Slug</label>
                        <input
                            name="slug"
                            placeholder="main-character-energy"
                            className="w-full rounded-xl border border-[rgba(120,175,255,0.4)] px-4 py-3"
                            required
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium">Description</label>
                        <textarea
                            name="description"
                            rows={5}
                            placeholder="Short explanation of this humor flavor"
                            className="w-full rounded-xl border border-[rgba(120,175,255,0.4)] px-4 py-3"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={pending}
                        className="rounded-full bg-[#60a5fa] px-5 py-3 font-semibold text-white hover:bg-[#3b82f6] disabled:opacity-50"
                    >
                        {pending ? "Creating…" : "Create Flavor"}
                    </button>
                </form>
            </div>
        </main>
    );
}
