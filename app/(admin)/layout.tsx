import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AdminShell } from "@/components/admin/shell";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
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

  const [{ data: profile }, topupsResult, guestOrdersResult, ticketsResult] = await Promise.all([
    supabase.from("profiles").select("full_name, role").eq("id", user.id).single(),
    supabase
      .from("topups")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase
      .from("guest_orders")
      .select("*", { count: "exact", head: true })
      .in("status", ["waiting_payment", "payment_review"]),
    supabase
      .from("support_tickets")
      .select("*", { count: "exact", head: true })
      .eq("status", "open"),
  ]);

  if (!profile || profile.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <AdminShell
      adminName={profile.full_name || "Admin"}
      badges={{
        topups: topupsResult.count || 0,
        guestOrders: guestOrdersResult.count || 0,
        tickets: ticketsResult.count || 0,
      }}
    >
      {children}
    </AdminShell>
  );
}
