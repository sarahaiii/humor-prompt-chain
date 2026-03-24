"use client";

import { useState } from "react";

type Props = {
    flavorId: number;
};

export default function TestFlavor({ flavorId }: Props) {

    const [captions, setCaptions] = useState<string[]>([]);
    const [prompt, setPrompt] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");

    async function runTest() {

        setLoading(true);
        setError("");
        setCaptions([]);

        try {

            const res = await fetch("/api/test-flavor", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    flavorId
                })
            });

            if (!res.ok) {
                throw new Error("API error");
            }

            const data = await res.json();

            setCaptions(data.captions || []);
            setPrompt(data.prompt || "");

        } catch (err) {

            setError("Failed to generate captions");

        }

        setLoading(false);
    }

    return (

        <div className="mt-12 rounded-xl border border-slate-200 bg-white p-6 text-slate-900 shadow-sm">

            <div className="flex items-center justify-between">

                <div>

                    <h2 className="text-lg font-semibold">
                        Test Flavor
                    </h2>

                    <p className="text-sm text-slate-500">
                        Run the prompt chain and preview captions
                    </p>

                </div>

                <button
                    onClick={runTest}
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                    {loading ? "Generating..." : "Generate captions"}
                </button>

            </div>


            {error && (

                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {error}
                </div>

            )}


            {prompt && (

                <div className="mt-6">

                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Combined Prompt
                    </p>

                    <pre className="mt-2 rounded-lg bg-slate-100 p-3 text-xs whitespace-pre-wrap">
            {prompt}
          </pre>

                </div>

            )}


            {captions.length > 0 && (

                <div className="mt-6 space-y-3">

                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Generated Captions
                    </p>

                    {captions.map((caption, i) => (

                        <div
                            key={i}
                            className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm"
                        >

                            {caption}

                        </div>

                    ))}

                </div>

            )}

        </div>

    );

}