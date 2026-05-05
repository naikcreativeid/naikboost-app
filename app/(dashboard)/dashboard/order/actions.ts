"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { sendWhatsApp } from "@/lib/api/fonnte";
import { createOrder as createIrvanKedeOrder } from "@/lib/api/irvankede";
import { whatsappTemplates } from "@/lib/api/whatsapp-templates";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const targetPatterns: Record<string, RegExp> = {
  instagram:
    /^(https?:\/\/(www\.)?instagram\.com\/[A-Za-z0-9._/-]+\/?|@?[A-Za-z0-9._]{1,30})$/i,
  tiktok:
    /^(https?:\/\/(www\.)?tiktok\.com\/@[A-Za-z0-9._-]+\/?|@?[A-Za-z0-9._-]{2,50})$/i,
  youtube:
    /^(https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/[A-Za-z0-9._?=&/-]+)$/i,
  facebook:
    /^(https?:\/\/(www\.)?facebook\.com\/[A-Za-z0-9._?=&/-]+)$/i,
};

const createOrderSchema = z.object({
  service_id: z.string().uuid("Layanan belum valid."),
  target: z.string().min(3, "Target wajib diisi."),
  quantity: z.number().int().positive("Jumlah harus lebih dari 0."),
});

function normalizeTarget(target: string) {
  return target.trim();
}

export async function createOrderAction(input: {
  service_id: string;
  target: string;
  quantity: number;
}) {
  const values = createOrderSchema.parse(input);
  const supabase = createClient();
  const admin = createAdminClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Kamu perlu login dulu sebelum membuat pesanan.");
  }

  const [{ data: service, error: serviceError }, { data: profile, error: profileError }] =
    await Promise.all([
      supabase
        .from("services")
        .select("id, name, platform, min_qty, max_qty, price_sell, irvankede_service_id")
        .eq("id", values.service_id)
        .eq("is_active", true)
        .single(),
      supabase
        .from("profiles")
        .select("id, balance, full_name, whatsapp")
        .eq("id", user.id)
        .single(),
    ]);

  if (serviceError || !service) {
    throw new Error("Layanan yang kamu pilih tidak ditemukan.");
  }

  if (profileError || !profile) {
    throw new Error("Profil akun kamu belum siap.");
  }

  const target = normalizeTarget(values.target);
  const targetPattern = targetPatterns[service.platform];

  if (targetPattern && !targetPattern.test(target)) {
    throw new Error("Target belum sesuai format platform yang dipilih.");
  }

  if (values.quantity < service.min_qty || values.quantity > service.max_qty) {
    throw new Error(`Jumlah harus di antara ${service.min_qty} sampai ${service.max_qty}.`);
  }

  const totalPrice = Math.round((service.price_sell * values.quantity) / 1000);

  if (profile.balance < totalPrice) {
    throw new Error("Saldo kamu belum cukup untuk membuat pesanan ini.");
  }

  const { data: createdOrderId, error: orderError } = await supabase.rpc("process_order", {
    p_user_id: user.id,
    p_service_id: service.id,
    p_target: target,
    p_quantity: values.quantity,
  });

  if (orderError || !createdOrderId) {
    throw new Error("Pesanan belum berhasil dibuat. Coba lagi ya.");
  }

  try {
    const remoteOrder = await createIrvanKedeOrder({
      service_id: Number(service.irvankede_service_id),
      target,
      quantity: values.quantity,
    });

    const remoteOrderId = String(remoteOrder.order_id || remoteOrder.id || "");

    const { error: updateError } = await admin
      .from("orders")
      .update({
        irvankede_order_id: remoteOrderId,
        status: "processing",
        charge: remoteOrder.charge ? Math.round(Number(remoteOrder.charge)) : null,
        start_count: remoteOrder.start_count ? Number(remoteOrder.start_count) : null,
        remains: remoteOrder.remains ? Number(remoteOrder.remains) : null,
      })
      .eq("id", createdOrderId);

    if (updateError) {
      throw new Error(updateError.message);
    }

    if (profile.whatsapp) {
      void Promise.allSettled([
        sendWhatsApp({
          target: profile.whatsapp,
          message: whatsappTemplates.orderCreated(
            profile.full_name || "Kak",
            service.name,
            target,
            values.quantity,
          ),
        }),
      ]).then((results) => {
        console.log("[createOrderAction] WhatsApp settled", results);
      });
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/orders");
    revalidatePath(`/dashboard/orders/${createdOrderId}`);

    return { orderId: createdOrderId };
  } catch (error) {
    console.error("[createOrderAction] IrvanKede order failed", error);

    const { data: orderRow } = await admin
      .from("orders")
      .select("user_id, price_total")
      .eq("id", createdOrderId)
      .single();

    const { data: profileRow } = await admin
      .from("profiles")
      .select("balance")
      .eq("id", user.id)
      .single();

    if (orderRow && profileRow) {
      const balanceBefore = profileRow.balance;
      const balanceAfter = balanceBefore + orderRow.price_total;

      await admin.from("profiles").update({ balance: balanceAfter }).eq("id", user.id);
      await admin
        .from("orders")
        .update({
          status: "error",
          notes: "Order gagal dikirim ke IrvanKede. Saldo dikembalikan otomatis.",
        })
        .eq("id", createdOrderId);
      await admin.from("transactions").insert({
        user_id: user.id,
        type: "refund",
        amount: orderRow.price_total,
        balance_before: balanceBefore,
        balance_after: balanceAfter,
        reference_type: "order",
        reference_id: createdOrderId,
        description: "Refund otomatis karena order gagal dikirim ke provider.",
      });
    }

    throw new Error("Provider sedang bermasalah. Saldo kamu sudah kami kembalikan otomatis.");
  }
}
