import { createAdminClient } from "@/lib/supabase/admin";
import { getServices, type IrvanKedeService } from "@/lib/api/irvankede";

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
  const markup = Math.round(priceBuy * 1.5);
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
    price_sell: markup,
    min_qty: Math.max(parseNumber(service.min, 1), 1),
    max_qty: Math.max(parseNumber(service.max, 1), 1),
    refill_days: refillDays,
    description: service.description || service.note || null,
    is_active: true,
    is_featured: false,
  };
}

export async function syncServicesFromIrvanKede() {
  const admin = createAdminClient();
  const services = await getServices();
  const activeServices = services.filter(
    (service) => parseNumber(service.status, 1) === 1,
  );

  const payload = activeServices.map(mapServicePayload);

  const { error, data } = await admin
    .from("services")
    .upsert(payload, {
      onConflict: "irvankede_service_id",
    })
    .select("id, irvankede_service_id, name");

  if (error) {
    throw new Error(`Sinkronisasi layanan gagal: ${error.message}`);
  }

  return {
    totalFetched: services.length,
    totalActive: activeServices.length,
    synced: data?.length || 0,
  };
}
