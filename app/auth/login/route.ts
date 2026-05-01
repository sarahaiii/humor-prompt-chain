import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
    const supabase = await createClient();
    const origin = new URL(request.url).origin;

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo: `${origin}/auth/callback`,
        },
    });

    if (error || !data?.url) {
        return NextResponse.json(
            { error: error?.message ?? "Failed to start Google login" },
            { status: 500 }
        );
    }

    return NextResponse.redirect(data.url);
}
