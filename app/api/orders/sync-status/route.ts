import { NextRequest, NextResponse } from "next/server";

import { syncProcessingOrders } from "@/lib/api/orders-sync";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const cronHeader = request.headers.get("x-cron-secret");

  if (!cronSecret || cronHeader !== cronSecret) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  try {
    const { updated } = await syncProcessingOrders();

    return NextResponse.json({ success: true, updated });
  } catch (error) {
    console.error("[orders-sync-status] failed", error);
    return NextResponse.json(
      { error: "Sinkronisasi status order gagal." },
      { status: 500 },
    );
  }
}
