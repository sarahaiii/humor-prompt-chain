import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import FlavorSidebar from "./FlavorSidebar";

type FlavorRow = { id: number; slug: string | null; description: string | null };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) redirect("/login");

    // User's own flavors (created by them)
    const { data: myFlavors } = await supabase
        .from("humor_flavors")
        .select("id, slug, description")
        .eq("created_by_user_id", user.id)
        .order("modified_datetime_utc", { ascending: false })
        .limit(40);

    let sidebarFlavors: FlavorRow[];
    let sidebarTitle: string;

    if (myFlavors && myFlavors.length > 0) {
        sidebarFlavors = myFlavors as FlavorRow[];
        sidebarTitle = "Your Flavors";
    } else {
        // Fall back to flavors the user has recently edited
        const { data: recentlyEdited } = await supabase
            .from("humor_flavors")
            .select("id, slug, description")
            .eq("modified_by_user_id", user.id)
            .order("modified_datetime_utc", { ascending: false })
            .limit(40);
        sidebarFlavors = (recentlyEdited ?? []) as FlavorRow[];
        sidebarTitle = "Recently Edited";
    }

    return (
        <div className="flex h-screen overflow-hidden">
            <FlavorSidebar
                flavors={sidebarFlavors}
                title={sidebarTitle}
                userEmail={user.email ?? ""}
            />
            <div className="flex-1 overflow-y-auto">
                {children}
            </div>
        </div>
    );
}