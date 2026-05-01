import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
    const supabase = await createClient();
    const url = new URL(request.url);
    const code = url.searchParams.get("code");

    if (!code) {
        return NextResponse.json(
            { step: "missing code" },
            { status: 400 }
        );
    }

    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
        return NextResponse.json(
            { step: "exchangeCodeForSession", error: exchangeError.message },
            { status: 500 }
        );
    }

    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        return NextResponse.json(
            { step: "getUser", error: userError?.message ?? "No user after login" },
            { status: 500 }
        );
    }

    const { error: profileError } = await supabase.from("profiles").upsert(
        {
            id: user.id,
            email: user.email,
            created_by_user_id: user.id,
            modified_by_user_id: user.id,
        },
        { onConflict: "id" }
    );

    if (profileError) {
        return NextResponse.json(
            { step: "profiles upsert", error: profileError.message },
            { status: 500 }
        );
    }

    return NextResponse.redirect(new URL("/admin", request.url));
}