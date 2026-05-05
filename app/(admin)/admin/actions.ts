"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { sendWhatsApp } from "@/lib/api/fonnte";
import { createOrder as createIrvanKedeOrder, getBalance } from "@/lib/api/irvankede";
import { syncProcessingOrders } from "@/lib/api/orders-sync";
import { syncServicesFromIrvanKede } from "@/lib/api/services-sync";
import { whatsappTemplates } from "@/lib/api/whatsapp-templates";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

async function requireAdmin() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Kamu harus login sebagai admin.");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    throw new Error("Akses admin dibutuhkan.");
  }

  return { userId: user.id };
}

async function createAdminLog(params: {
  adminId: string;
  action: string;
  targetType: string;
  targetId?: string | null;
  description: string;
}) {
  const admin = createAdminClient();

  await admin.from("admin_logs").insert({
    id: randomUUID(),
    admin_id: params.adminId,
    action: params.action,
    target_type: params.targetType,
    target_id: params.targetId,
    description: params.description,
  });
}

export async function approveTopupAction(input: {
  topupId: string;
  adminNotes?: string;
}) {
  const { userId } = await requireAdmin();
  const admin = createAdminClient();
  const { data: topupBefore } = await admin
    .from("topups")
    .select("id, amount, user_id")
    .eq("id", input.topupId)
    .single();

  const { error } = await admin
    .from("topups")
    .update({
      admin_notes: input.adminNotes || null,
    })
    .eq("id", input.topupId);

  if (error) {
    throw new Error("Catatan admin belum bisa disimpan.");
  }

  const supabase = createClient();
  const { error: rpcError } = await supabase.rpc("process_topup_approval", {
    p_topup_id: input.topupId,
    p_admin_id: userId,
  });

  if (rpcError) {
    throw new Error("Approve top up gagal dijalankan.");
  }

  const { data: approvedTopup } = await admin
    .from("topups")
    .select("id, amount, user_id")
    .eq("id", input.topupId)
    .single();
  const { data: profile } = await admin
    .from("profiles")
    .select("full_name, whatsapp, balance")
    .eq("id", topupBefore?.user_id || approvedTopup?.user_id || "")
    .maybeSingle();

  if (profile?.whatsapp && approvedTopup?.amount) {
    void Promise.allSettled([
      sendWhatsApp({
        target: profile.whatsapp,
        message: whatsappTemplates.topupApproved(
          profile.full_name || "Kak",
          approvedTopup.amount,
          profile.balance || 0,
        ),
      }),
    ]).then((results) => {
      console.log("[approveTopupAction] WhatsApp settled", results);
    });
  }

  await createAdminLog({
    adminId: userId,
    action: "approve_topup",
    targetType: "topup",
    targetId: input.topupId,
    description: "Admin menyetujui top up customer.",
  });

  revalidatePath("/admin");
  revalidatePath("/admin/topups");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/topup/history");
  revalidatePath("/dashboard/transactions");

  return { message: "Top up berhasil di-approve dan saldo customer sudah bertambah." };
}

export async function rejectTopupAction(input: { topupId: string; reason: string }) {
  const { userId } = await requireAdmin();
  const admin = createAdminClient();
  const reasonSchema = z.string().min(5, "Alasan reject wajib diisi.");
  const reason = reasonSchema.parse(input.reason);
  const { data: topup } = await admin
    .from("topups")
    .select("id, amount, user_id")
    .eq("id", input.topupId)
    .single();

  const { error } = await admin
    .from("topups")
    .update({
      status: "rejected",
      approved_by: userId,
      approved_at: new Date().toISOString(),
      admin_notes: reason,
    })
    .eq("id", input.topupId);

  if (error) {
    throw new Error("Top up belum berhasil direject.");
  }

  const { data: profile } = await admin
    .from("profiles")
    .select("full_name, whatsapp")
    .eq("id", topup?.user_id || "")
    .maybeSingle();

  if (profile?.whatsapp && topup?.amount) {
    void Promise.allSettled([
      sendWhatsApp({
        target: profile.whatsapp,
        message: whatsappTemplates.topupRejected(
          profile.full_name || "Kak",
          topup.amount,
          reason,
        ),
      }),
    ]).then((results) => {
      console.log("[rejectTopupAction] WhatsApp settled", results);
    });
  }

  await createAdminLog({
    adminId: userId,
    action: "reject_topup",
    targetType: "topup",
    targetId: input.topupId,
    description: `Admin menolak top up. Alasan: ${reason}`,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/topups");
  revalidatePath("/dashboard/topup/history");

  return { message: "Top up berhasil direject." };
}

export async function processGuestOrderAction(input: { guestOrderId: string }) {
  const { userId } = await requireAdmin();
  const admin = createAdminClient();

  const { data: guestOrder, error } = await admin
    .from("guest_orders")
    .select("id, target, total_price, package:packages(quantity, service_id, name)")
    .eq("id", input.guestOrderId)
    .single();

  if (error || !guestOrder) {
    throw new Error("Guest order tidak ditemukan.");
  }

  const pkgRaw = (guestOrder as {
    package:
      | { quantity: number; service_id: string; name: string }
      | { quantity: number; service_id: string; name: string }[]
      | null;
  }).package;
  const pkg = Array.isArray(pkgRaw) ? pkgRaw[0] : pkgRaw;

  if (!pkg?.service_id) {
    throw new Error("Package guest order belum terhubung ke service.");
  }

  const { data: service } = await admin
    .from("services")
    .select("irvankede_service_id")
    .eq("id", pkg.service_id)
    .single();

  if (!service?.irvankede_service_id) {
    throw new Error("Service provider belum tersedia.");
  }

  await admin
    .from("guest_orders")
    .update({
      status: "processing",
      approved_by: userId,
      approved_at: new Date().toISOString(),
    })
    .eq("id", input.guestOrderId);

  try {
    const remote = await createIrvanKedeOrder({
      service_id: Number(service.irvankede_service_id),
      target: guestOrder.target,
      quantity: pkg.quantity,
    });

    await admin
      .from("guest_orders")
      .update({
        status: "success",
        irvankede_order_id: String(remote.order_id || remote.id || ""),
      })
      .eq("id", input.guestOrderId);

    await createAdminLog({
      adminId: userId,
      action: "process_guest_order",
      targetType: "guest_order",
      targetId: input.guestOrderId,
      description: "Admin mengirim guest order ke IrvanKede.",
    });

    revalidatePath("/admin");
    revalidatePath("/admin/guest-orders");

    return { message: "Guest order berhasil diproses ke provider." };
  } catch (providerError) {
    console.error("[processGuestOrderAction] failed", providerError);

    await admin
      .from("guest_orders")
      .update({
        status: "error",
        admin_notes: "Gagal kirim ke provider. Cek log server.",
      })
      .eq("id", input.guestOrderId);

    throw new Error("Guest order gagal dikirim ke provider.");
  }
}

export async function rejectGuestOrderAction(input: {
  guestOrderId: string;
  reason: string;
}) {
  const { userId } = await requireAdmin();
  const reason = z.string().min(5, "Alasan reject wajib diisi.").parse(input.reason);
  const admin = createAdminClient();

  const { error } = await admin
    .from("guest_orders")
    .update({
      status: "error",
      approved_by: userId,
      approved_at: new Date().toISOString(),
      admin_notes: reason,
    })
    .eq("id", input.guestOrderId);

  if (error) {
    throw new Error("Guest order belum berhasil direject.");
  }

  await createAdminLog({
    adminId: userId,
    action: "reject_guest_order",
    targetType: "guest_order",
    targetId: input.guestOrderId,
    description: `Admin menolak guest order. Alasan: ${reason}`,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/guest-orders");

  return { message: "Guest order berhasil direject." };
}

export async function syncProcessingOrdersAction() {
  const { userId } = await requireAdmin();
  const payload = await syncProcessingOrders();

  await createAdminLog({
    adminId: userId,
    action: "sync_orders",
    targetType: "order",
    description: `Admin menjalankan sync status order. Updated: ${payload.updated || 0}`,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/orders");

  return { message: `${payload.updated || 0} order berhasil disinkronkan.` };
}

export async function syncServicesAction() {
  const { userId } = await requireAdmin();
  const payload = await syncServicesFromIrvanKede();

  await createAdminLog({
    adminId: userId,
    action: "sync_services",
    targetType: "service",
    description: `Admin sync layanan. Updated: ${payload.synced || 0}`,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/services");
  revalidatePath("/dashboard/order");

  return { message: `${payload.synced || 0} services berhasil di-update.` };
}

export async function updateServiceAction(input: {
  serviceId: string;
  priceSell?: number;
  isActive?: boolean;
  isFeatured?: boolean;
}) {
  const { userId } = await requireAdmin();
  const admin = createAdminClient();
  const patch: Record<string, unknown> = {};

  if (typeof input.priceSell === "number") patch.price_sell = input.priceSell;
  if (typeof input.isActive === "boolean") patch.is_active = input.isActive;
  if (typeof input.isFeatured === "boolean") patch.is_featured = input.isFeatured;

  const { error } = await admin.from("services").update(patch).eq("id", input.serviceId);

  if (error) {
    throw new Error("Update service gagal disimpan.");
  }

  await createAdminLog({
    adminId: userId,
    action: "update_service",
    targetType: "service",
    targetId: input.serviceId,
    description: "Admin mengubah pengaturan service.",
  });

  revalidatePath("/admin/services");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/order");

  return { message: "Service berhasil diupdate." };
}

export async function replyTicketAction(input: { ticketId: string; response: string }) {
  const { userId } = await requireAdmin();
  const responseText = z.string().min(5, "Jawaban minimal 5 karakter.").parse(input.response);
  const admin = createAdminClient();

  const { error } = await admin
    .from("support_tickets")
    .update({
      admin_response: responseText,
      responded_by: userId,
      responded_at: new Date().toISOString(),
      status: "answered",
    })
    .eq("id", input.ticketId);

  if (error) {
    throw new Error("Jawaban tiket belum berhasil dikirim.");
  }

  await createAdminLog({
    adminId: userId,
    action: "reply_ticket",
    targetType: "ticket",
    targetId: input.ticketId,
    description: "Admin membalas tiket support customer.",
  });

  revalidatePath("/admin");
  revalidatePath("/admin/tickets");

  return { message: "Jawaban tiket berhasil dikirim." };
}

export async function adjustCustomerBalanceAction(input: {
  userId: string;
  amount: number;
  description: string;
}) {
  const { userId: adminId } = await requireAdmin();
  const admin = createAdminClient();

  const amount = z.number().int().refine((value) => value !== 0, {
    message: "Nominal adjustment tidak boleh nol.",
  }).parse(input.amount);
  const description = z
    .string()
    .min(5, "Catatan adjustment minimal 5 karakter.")
    .parse(input.description);

  const { data: profile } = await admin
    .from("profiles")
    .select("balance")
    .eq("id", input.userId)
    .single();

  if (!profile) {
    throw new Error("Customer tidak ditemukan.");
  }

  const balanceBefore = profile.balance;
  const balanceAfter = balanceBefore + amount;

  if (balanceAfter < 0) {
    throw new Error("Saldo customer tidak boleh minus.");
  }

  await admin.from("profiles").update({ balance: balanceAfter }).eq("id", input.userId);
  await admin.from("transactions").insert({
    user_id: input.userId,
    type: "adjustment",
    amount,
    balance_before: balanceBefore,
    balance_after: balanceAfter,
    reference_type: "manual",
    description,
  });

  await createAdminLog({
    adminId,
    action: "adjust_balance",
    targetType: "profile",
    targetId: input.userId,
    description: `Admin adjustment saldo customer sebesar ${amount}.`,
  });

  revalidatePath("/admin/customers");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/transactions");

  return { message: "Saldo customer berhasil disesuaikan." };
}

export async function saveAppSettingsAction(input: {
  defaultMarkupPercentage: number;
  maintenanceMode: boolean;
  banksJson: string;
  whatsappGateway: string;
}) {
  const { userId } = await requireAdmin();
  const admin = createAdminClient();

  const { error } = await admin.from("app_settings").upsert({
    id: 1,
    default_markup_percentage: input.defaultMarkupPercentage,
    maintenance_mode: input.maintenanceMode,
    bank_accounts: input.banksJson,
    whatsapp_gateway_settings: input.whatsappGateway,
    updated_by: userId,
  });

  if (error) {
    throw new Error("Pengaturan sistem belum berhasil disimpan.");
  }

  await createAdminLog({
    adminId: userId,
    action: "save_settings",
    targetType: "app_settings",
    targetId: "1",
    description: "Admin memperbarui pengaturan sistem.",
  });

  revalidatePath("/admin/settings");

  return { message: "Pengaturan sistem berhasil disimpan." };
}

export async function fetchIrvanKedeBalanceAdmin() {
  await requireAdmin();
  const balance = await getBalance();
  return String(balance.balance || "0");
}
