"use client";

import { useState } from "react";

export default function TestFlavor({ flavorId }: { flavorId: number }) {
    const [captions, setCaptions] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [errorDetails, setErrorDetails] = useState<string>("");
    const [rawResponse, setRawResponse] = useState<string>("");
    const [imageId, setImageId] = useState("");
    const [imageIdUsed, setImageIdUsed] = useState<number | null>(null);

    async function runTest() {
        setLoading(true);
        setError("");
        setErrorDetails("");
        setRawResponse("");
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
                if (data.details) {
                    setErrorDetails(JSON.stringify(data.details, null, 2));
                }
                setLoading(false);
                return;
            }

            const nextCaptions = Array.isArray(data.captions)
                ? data.captions.map((c: unknown) =>
                    typeof c === "string" ? c : JSON.stringify(c)
                )
                : [];

            setCaptions(nextCaptions);
            setImageIdUsed(typeof data.imageIdUsed === "number" ? data.imageIdUsed : null);
            if (data.raw) setRawResponse(JSON.stringify(data.raw, null, 2));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown client error");
        }

        setLoading(false);
    }

    return (
        <div className="mt-10 rounded-xl border border-[rgba(120,175,255,0.4)] bg-white/75 p-6 text-[#1a3a5c]">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h2 className="text-lg font-semibold text-[#0c1a2e]">Test Flavor</h2>
                    <p className="mt-1 text-sm text-[#6a9cbf]">
                        Run prompt chain and preview captions
                    </p>
                </div>

                <button
                    onClick={runTest}
                    className="rounded-lg bg-[#60a5fa] px-4 py-2 text-sm font-medium text-white hover:bg-[#3b82f6]"
                >
                    {loading ? "Generating..." : "Generate captions"}
                </button>
            </div>

            <div className="mt-4">
                <label className="mb-2 block text-sm font-medium text-[#1a3a5c]">
                    Test Image ID
                </label>
                <input
                    type="number"
                    value={imageId}
                    onChange={(e) => setImageId(e.target.value)}
                    placeholder="Optional: leave blank to use your most recent image"
                    className="w-full rounded-lg border border-[rgba(120,175,255,0.4)] px-3 py-2 text-sm"
                />
                <p className="mt-2 text-xs text-[#6a9cbf]">
                    Leave blank to automatically test with your most recently uploaded image.
                </p>
            </div>

            {imageIdUsed !== null && (
                <div className="mt-4 rounded-lg border border-[rgba(120,175,255,0.4)] bg-blue-50 p-3 text-sm text-[#1a3a5c]">
                    Used image ID: <span className="font-semibold">{imageIdUsed}</span>
                </div>
            )}

            {error && (
                <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    <div className="font-medium">{error}</div>
                    {errorDetails && (
                        <pre className="mt-2 overflow-x-auto whitespace-pre-wrap text-xs opacity-75">
                            {errorDetails}
                        </pre>
                    )}
                </div>
            )}

            {captions.length > 0 && (
                <div className="mt-6 space-y-3">
                    <p className="text-xs font-medium uppercase tracking-wide text-[#6a9cbf]">
                        Generated Captions
                    </p>

                    {captions.map((caption, i) => (
                        <div
                            key={i}
                            className="rounded-lg border border-[rgba(120,175,255,0.4)] bg-blue-50/50 p-3 text-sm"
                        >
                            {caption}
                        </div>
                    ))}

                    {rawResponse && (
                        <details className="mt-4">
                            <summary className="cursor-pointer text-xs text-[#6a9cbf] hover:text-[#1a3a5c]">
                                Raw API response
                            </summary>
                            <pre className="mt-2 overflow-x-auto rounded-lg bg-blue-50 p-3 text-xs text-[#1a3a5c]">
                                {rawResponse}
                            </pre>
                        </details>
                    )}
                </div>
            )}
        </div>
    );
}
