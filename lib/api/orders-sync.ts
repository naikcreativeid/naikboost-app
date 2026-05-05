import { sendWhatsApp } from "@/lib/api/fonnte";
import { checkOrderStatus } from "@/lib/api/irvankede";
import { whatsappTemplates } from "@/lib/api/whatsapp-templates";
import { createAdminClient } from "@/lib/supabase/admin";

function normalizeOrderStatus(status?: string) {
  const value = String(status || "").toLowerCase();
  if (value.includes("success") || value.includes("completed")) return "success";
  if (value.includes("partial")) return "partial";
  if (value.includes("process") || value.includes("progress")) return "processing";
  if (value.includes("pending")) return "pending";
  if (value.includes("refund")) return "refunded";
  return "error";
}

export async function syncProcessingOrders(limit = 25) {
  const admin = createAdminClient();
  const { data: orders, error } = await admin
    .from("orders")
    .select("id, irvankede_order_id, status, target, user_id, service_id")
    .eq("status", "processing")
    .not("irvankede_order_id", "is", null)
    .limit(limit);

  if (error) {
    throw new Error(error.message);
  }

  if (!orders || orders.length === 0) {
    return { updated: 0, completed: 0, failed: 0 };
  }

  let updated = 0;
  let completed = 0;
  let failed = 0;

  for (let index = 0; index < orders.length; index += 5) {
    const chunk = orders.slice(index, index + 5);
    const statusPayload = await checkOrderStatus(
      chunk.map((order) => String(order.irvankede_order_id)),
    );

    const statusArray = Array.isArray(statusPayload) ? statusPayload : [statusPayload];

    for (const remoteStatus of statusArray) {
      const remoteId = String(remoteStatus.order_id || remoteStatus.id || "");
      const localOrder = chunk.find(
        (order) => String(order.irvankede_order_id) === remoteId,
      );

      if (!localOrder) continue;

      const nextStatus = normalizeOrderStatus(remoteStatus.status);
      const { error: updateError } = await admin
        .from("orders")
        .update({
          status: nextStatus,
          start_count: remoteStatus.start_count ? Number(remoteStatus.start_count) : null,
          remains: remoteStatus.remains ? Number(remoteStatus.remains) : null,
          charge: remoteStatus.charge ? Math.round(Number(remoteStatus.charge)) : null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", localOrder.id);

      if (!updateError) {
        updated += 1;

        if (nextStatus === "success" && localOrder.status !== "success") {
          const [{ data: profile }, { data: service }] = await Promise.all([
            admin
              .from("profiles")
              .select("full_name, whatsapp")
              .eq("id", localOrder.user_id)
              .maybeSingle(),
            admin
              .from("services")
              .select("name")
              .eq("id", localOrder.service_id)
              .maybeSingle(),
          ]);

          if (profile?.whatsapp && service?.name) {
            void Promise.allSettled([
              sendWhatsApp({
                target: profile.whatsapp,
                message: whatsappTemplates.orderCompleted(
                  profile.full_name || "Kak",
                  service.name,
                  localOrder.target,
                ),
              }),
            ]).then((results) => {
              console.log("[syncProcessingOrders] WhatsApp settled", results);
            });
          }

          completed += 1;
        }

        if (nextStatus === "error" && localOrder.status !== "error") {
          const [{ data: profile }, { data: service }] = await Promise.all([
            admin
              .from("profiles")
              .select("full_name, whatsapp")
              .eq("id", localOrder.user_id)
              .maybeSingle(),
            admin
              .from("services")
              .select("name")
              .eq("id", localOrder.service_id)
              .maybeSingle(),
          ]);

          if (profile?.whatsapp && service?.name) {
            void Promise.allSettled([
              sendWhatsApp({
                target: profile.whatsapp,
                message: whatsappTemplates.orderFailed(
                  profile.full_name || "Kak",
                  service.name,
                  localOrder.target,
                ),
              }),
            ]).then((results) => {
              console.log("[syncProcessingOrders] WhatsApp settled", results);
            });
          }

          failed += 1;
        }
      }
    }
  }

  return { updated, completed, failed };
}
