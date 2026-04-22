import Link from "next/link";

export default function HomePage() {
  return (
      <main className="min-h-screen px-6 py-12 text-[#1a3a5c]">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm uppercase tracking-[0.3em] text-[#6a9cbf]">
            Humor Prompt Chain
          </p>

          <h1 className="mt-4 text-5xl font-bold text-[#0c1a2e]">
            Build and test humor flavors
          </h1>

          <p className="mt-4 max-w-3xl text-lg leading-8 text-[#6a9cbf]">
            Create humor flavors, manage ordered prompt steps, and generate captions using the API.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="glass-card">
              <h2 className="text-2xl font-semibold text-[#0c1a2e]">Get Started</h2>
              <p className="mt-3 text-[#6a9cbf]">
                Sign in to access the protected prompt chain tool.
              </p>

              <div className="mt-6 flex gap-4">
                <Link
                    href="/login"
                    className="rounded-full bg-[#60a5fa] px-6 py-3 font-semibold text-white transition hover:bg-[#3b82f6]"
                >
                  Sign in
                </Link>

                <Link
                    href="/admin"
                    className="rounded-full border border-[rgba(120,175,255,0.4)] bg-blue-50 px-6 py-3 font-semibold text-[#3b82f6] transition hover:bg-blue-100"
                >
                  Open tool
                </Link>
              </div>
            </div>

            <div className="glass-card">
              <h2 className="text-2xl font-semibold text-[#0c1a2e]">What this app does</h2>
              <ul className="mt-4 space-y-3 text-[#6a9cbf]">
                <li>Create and manage humor flavors</li>
                <li>Edit and reorder flavor steps</li>
                <li>Test flavor chains against the REST API</li>
                <li>Review generated caption outputs</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
  );
}
