import { NextResponse } from "next/server";

import { syncServicesFromIrvanKede } from "@/lib/api/services-sync";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
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

  try {
    const result = await syncServicesFromIrvanKede();
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("[sync-services] failed", error);
    return NextResponse.json(
      { error: "Sinkronisasi layanan gagal." },
      { status: 500 },
    );
  }
}
