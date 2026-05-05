import { NextRequest, NextResponse } from "next/server";

import { syncProcessingOrders } from "@/lib/api/orders-sync";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isAuthorized(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const authorization = request.headers.get("authorization");

  if (!secret) {
    return { ok: false, reason: "CRON_SECRET belum diisi." };
  }

  if (authorization !== `Bearer ${secret}`) {
    return { ok: false, reason: "Unauthorized cron request." };
  }

  return { ok: true as const };
}

export async function GET(request: NextRequest) {
  const auth = isAuthorized(request);

  if (!auth.ok) {
    return NextResponse.json({ success: false, error: auth.reason }, { status: 401 });
  }

  try {
    const result = await syncProcessingOrders(100);

    return NextResponse.json({
      success: true,
      updated: result.updated,
      completed: result.completed ?? 0,
      failed: result.failed ?? 0,
      checkedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[cron/sync-orders] failed", error);
    return NextResponse.json(
      { success: false, error: "Cron sync orders gagal dijalankan." },
      { status: 500 },
    );
  }
}
