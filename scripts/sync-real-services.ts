import { createClient } from "@supabase/supabase-js";

import { getServices, type IrvanKedeService } from "../lib/api/irvankede";

function requireEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Environment variable ${name} belum diisi.`);
  }

  return value;
}

function parseNumber(value: string | number | boolean | undefined, fallback = 0) {
  if (typeof value === "number") return value;
  if (typeof value === "boolean") return value ? 1 : 0;
  if (typeof value === "string" && value.trim() !== "") {
    const normalized = Number(value.replace(/[^\d.-]/g, ""));
    return Number.isNaN(normalized) ? fallback : normalized;
  }
  return fallback;
}

function detectPlatform(service: IrvanKedeService) {
  const source = `${service.category} ${service.name}`.toLowerCase();
  if (source.includes("instagram")) return "instagram";
  if (source.includes("tiktok")) return "tiktok";
  if (source.includes("youtube")) return "youtube";
  if (source.includes("facebook")) return "facebook";
  return "instagram";
}

function mapServicePayload(service: IrvanKedeService) {
  const priceBuy = Math.round(parseNumber(service.price ?? service.rate, 0));
  const priceSell = Math.round(priceBuy * 1.5);
  const minQty = Math.max(parseNumber(service.min, 1), 1);
  const maxQty = Math.max(parseNumber(service.max, minQty), minQty);
  const refillDays = Math.max(
    parseNumber(service.refill_days, parseNumber(service.refill, 0)),
    0,
  );

  return {
    irvankede_service_id: parseNumber(service.id, 0),
    name: service.name,
    category: service.category || "Lainnya",
    platform: detectPlatform(service),
    type: service.type || "Default",
    price_buy: priceBuy,
    price_sell: priceSell,
    min_qty: minQty,
    max_qty: maxQty,
    refill_days: refillDays,
    description: service.description || service.note || null,
    is_active: true,
    is_featured: false,
  };
}

async function main() {
  const supabaseUrl = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRoleKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  console.log("[sync-real-services] Fetching services from IrvanKede...");
  const services = await getServices();
  const activeServices = services.filter((service) => parseNumber(service.status, 1) === 1);
  const payload = activeServices.map(mapServicePayload);

  console.log("[sync-real-services] Upserting active services...", {
    totalFetched: services.length,
    totalActive: activeServices.length,
  });

  const { data, error } = await supabase
    .from("services")
    .upsert(payload, { onConflict: "irvankede_service_id" })
    .select("id, irvankede_service_id, name");

  if (error) {
    throw new Error(`Sync services gagal: ${error.message}`);
  }

  console.log("[sync-real-services] Done.", {
    totalFetched: services.length,
    totalActive: activeServices.length,
    synced: data?.length || 0,
  });
}

main().catch((error) => {
  console.error("[sync-real-services] failed", error);
  process.exitCode = 1;
});
