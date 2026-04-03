"use client";

import { useState } from "react";

export default function TestFlavor({ flavorId }: { flavorId: number }) {
    const [captions, setCaptions] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [imageId, setImageId] = useState("");
    const [imageIdUsed, setImageIdUsed] = useState<number | null>(null);

    async function runTest() {
        setLoading(true);
        setError("");
        setCaptions([]);
        setImageIdUsed(null);

        try {
            const res = await fetch("/api/test-flavor", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    flavorId,
                    imageId: imageId.trim() === "" ? null : Number(imageId),
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Failed to generate captions");
                setLoading(false);
                return;
            }

            const nextCaptions = Array.isArray(data.captions)
                ? data.captions.map((c: unknown) =>
                    typeof c === "string" ? c : JSON.stringify(c)
                )
                : [];

            setCaptions(nextCaptions);
            setImageIdUsed(
                typeof data.imageIdUsed === "number" ? data.imageIdUsed : null
            );
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown client error");
        }

        setLoading(false);
    }

    return (
        <div className="mt-10 rounded-xl border border-slate-700 bg-white p-6 text-slate-900">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h2 className="text-lg font-semibold">Test Flavor</h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Run prompt chain and preview captions
                    </p>
                </div>

                <button
                    onClick={runTest}
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                    {loading ? "Generating..." : "Generate captions"}
                </button>
            </div>

            <div className="mt-4">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                    Test Image ID
                </label>
                <input
                    type="number"
                    value={imageId}
                    onChange={(e) => setImageId(e.target.value)}
                    placeholder="Optional: leave blank to use your most recent image"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
                <p className="mt-2 text-xs text-slate-500">
                    Leave blank to automatically test with your most recently uploaded image.
                </p>
            </div>

            {imageIdUsed !== null && (
                <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                    Used image ID: <span className="font-semibold">{imageIdUsed}</span>
                </div>
            )}

            {error && (
                <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    <div className="font-medium">{error}</div>
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