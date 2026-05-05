"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { sendWhatsApp } from "@/lib/api/fonnte";
import { whatsappTemplates } from "@/lib/api/whatsapp-templates";
import { trackServerEvent } from "@/lib/analytics/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const topupSchema = z.object({
  amount: z.number().int().min(10000, "Minimal top up Rp 10.000."),
  bank: z.enum(["BCA", "BRI", "Mandiri"]),
  sender_name: z.string().min(2, "Nama pengirim wajib diisi."),
  transfer_date: z.string().min(1, "Tanggal transfer wajib diisi."),
});

function sanitizeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
}

export async function submitTopupAction(formData: FormData) {
  const supabase = createClient();
  const admin = createAdminClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Kamu perlu login dulu sebelum kirim konfirmasi top up.");
  }

  const parsed = topupSchema.safeParse({
    amount: Number(formData.get("amount")),
    bank: formData.get("bank"),
    sender_name: formData.get("sender_name"),
    transfer_date: formData.get("transfer_date"),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message || "Data top up belum lengkap.");
  }

  const proofFile = formData.get("proof_file");

  if (!(proofFile instanceof File) || proofFile.size === 0) {
    throw new Error("Bukti transfer wajib diupload.");
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(proofFile.type)) {
    throw new Error("Format bukti transfer harus JPG, PNG, atau WEBP.");
  }

  if (proofFile.size > 2 * 1024 * 1024) {
    throw new Error("Ukuran bukti transfer maksimal 2MB.");
  }

  const { data: profile } = await admin
    .from("profiles")
    .select("full_name, whatsapp")
    .eq("id", user.id)
    .maybeSingle();

  const topupId = randomUUID();
  const fileName = sanitizeFileName(proofFile.name || "bukti-transfer.webp");
  const storagePath = `${user.id}/${topupId}/${Date.now()}-${fileName}`;
  const fileBuffer = Buffer.from(await proofFile.arrayBuffer());

  const { error: uploadError } = await admin.storage
    .from("payment-proofs")
    .upload(storagePath, fileBuffer, {
      contentType: proofFile.type,
      upsert: false,
    });

  if (uploadError) {
    console.error("[submitTopupAction] upload failed", uploadError);
    throw new Error("Upload bukti transfer gagal. Coba lagi ya.");
  }

  const { error: insertError } = await admin.from("topups").insert({
    id: topupId,
    user_id: user.id,
    amount: parsed.data.amount,
    bank_destination: parsed.data.bank,
    sender_name: parsed.data.sender_name,
    transfer_date: parsed.data.transfer_date,
    proof_image_url: storagePath,
    status: "pending",
  });

  if (insertError) {
    console.error("[submitTopupAction] insert failed", insertError);
    await admin.storage.from("payment-proofs").remove([storagePath]);
    throw new Error("Konfirmasi top up belum berhasil disimpan.");
  }

  const adminWhatsapp = process.env.ADMIN_WHATSAPP_NUMBER;
  const customerName = profile?.full_name || parsed.data.sender_name;
  const customerWhatsapp = profile?.whatsapp || "";

  const notifications = [];

  if (customerWhatsapp) {
    notifications.push(
      sendWhatsApp({
        target: customerWhatsapp,
        message: whatsappTemplates.topupReceived(customerName, parsed.data.amount),
      }),
    );
  }

  if (adminWhatsapp) {
    notifications.push(
      sendWhatsApp({
        target: adminWhatsapp,
        message: whatsappTemplates.adminNotifNewTopup(customerName, parsed.data.amount),
      }),
    );
  }

  void Promise.allSettled(notifications).then((results) => {
    console.log("[submitTopupAction] WhatsApp settled", results);
  });
  void trackServerEvent("topup_submitted", {
    amount: parsed.data.amount,
    bank: parsed.data.bank,
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/topup");
  revalidatePath("/dashboard/topup/history");
  revalidatePath("/dashboard/transactions");

  return { topupId };
}
