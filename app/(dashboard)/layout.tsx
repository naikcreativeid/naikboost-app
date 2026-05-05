import { redirect } from "next/navigation";

import { DashboardShell } from "@/components/dashboard/shell";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email")
    .eq("id", user.id)
    .maybeSingle();

  const fullName = profile?.full_name?.trim() || user.email || "Teman";
  const email = profile?.email || user.email || "";

  return (
    <DashboardShell fullName={fullName} email={email}>
      {children}
    </DashboardShell>
  );
}
