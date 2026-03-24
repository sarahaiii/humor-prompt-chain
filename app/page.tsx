import Link from "next/link";

export default function HomePage() {
  return (
      <main className="min-h-screen px-6 py-12 text-white">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm uppercase tracking-[0.3em] text-indigo-200">
            Humor Prompt Chain
          </p>

          <h1 className="mt-4 text-5xl font-bold text-white">
            Build and test humor flavors
          </h1>

          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-200">
            Create humor flavors, manage ordered prompt steps, and generate captions using the API.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="glass-card">
              <h2 className="text-2xl font-semibold text-white">Get Started</h2>
              <p className="mt-3 text-slate-300">
                Sign in to access the protected prompt chain tool.
              </p>

              <div className="mt-6 flex gap-4">
                <Link
                    href="/login"
                    className="rounded-full bg-white px-6 py-3 font-semibold text-slate-900 transition hover:bg-slate-200"
                >
                  Sign in
                </Link>

                <Link
                    href="/admin"
                    className="rounded-full border border-indigo-400/30 bg-indigo-500/20 px-6 py-3 font-semibold text-white transition hover:bg-indigo-500/30"
                >
                  Open tool
                </Link>
              </div>
            </div>

            <div className="glass-card">
              <h2 className="text-2xl font-semibold text-white">What this app does</h2>
              <ul className="mt-4 space-y-3 text-slate-300">
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