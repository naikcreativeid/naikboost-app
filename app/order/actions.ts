"use server";

import { randomBytes, randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { sendWhatsApp } from "@/lib/api/fonnte";
import { whatsappTemplates } from "@/lib/api/whatsapp-templates";
import { createAdminClient } from "@/lib/supabase/admin";
import { createPublicClient } from "@/lib/supabase/public";

const guestOrderSchema = z.object({
  package_id: z.string().uuid("Paket belum valid."),
  customer_name: z.string().min(2, "Nama lengkap wajib diisi."),
  customer_email: z.string().email("Email belum valid."),
  customer_whatsapp: z.string().min(10, "Nomor WhatsApp belum lengkap."),
  target: z
    .string()
    .min(5, "Target wajib diisi.")
    .regex(
      /^(https?:\/\/(www\.)?instagram\.com\/[A-Za-z0-9._/-]+\/?|@?[A-Za-z0-9._]{1,30})$/i,
      "Gunakan link atau username Instagram yang valid.",
    ),
  bank: z.enum(["BCA", "BRI", "Mandiri"]),
  agreed: z.literal("true"),
});

function sanitizeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
}

function normalizeWhatsapp(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.startsWith("62")) return `+${digits}`;
  if (digits.startsWith("0")) return `+62${digits.slice(1)}`;
  return `+${digits}`;
}

async function findOrCreateUser(input: {
  email: string;
  fullName: string;
  whatsapp: string;
}) {
  const admin = createAdminClient();
  const publicClient = createPublicClient();

  const { data: existingProfile } = await admin
    .from("profiles")
    .select("id, email")
    .eq("email", input.email)
    .maybeSingle();

  if (existingProfile?.id) {
    return { userId: existingProfile.id, wasCreated: false };
  }

  const randomPassword = randomBytes(18).toString("base64url");
  const { data: createdUser, error: createError } = await admin.auth.admin.createUser({
    email: input.email,
    password: randomPassword,
    email_confirm: true,
    user_metadata: {
      full_name: input.fullName,
      whatsapp: input.whatsapp,
    },
  });

  if (createError || !createdUser.user) {
    throw new Error("Akun customer belum berhasil dibuat otomatis.");
  }

  await admin
    .from("profiles")
    .update({
      full_name: input.fullName,
      whatsapp: input.whatsapp,
      email: input.email,
    })
    .eq("id", createdUser.user.id);

  const resetRedirectTo = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password`;
  const { error: resetError } = await publicClient.auth.resetPasswordForEmail(input.email, {
    redirectTo: resetRedirectTo,
  });

  if (resetError) {
    console.error("[submitGuestOrderAction] welcome/reset email failed", resetError);
  }

  return { userId: createdUser.user.id, wasCreated: true };
}

export async function submitGuestOrderAction(formData: FormData) {
  const admin = createAdminClient();

  const parsed = guestOrderSchema.safeParse({
    package_id: formData.get("package_id"),
    customer_name: formData.get("customer_name"),
    customer_email: formData.get("customer_email"),
    customer_whatsapp: formData.get("customer_whatsapp"),
    target: formData.get("target"),
    bank: formData.get("bank"),
    agreed: formData.get("agreed"),
  });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message || "Data pesanan belum lengkap.");
  }

  const proofFile = formData.get("proof_file");
  if (!(proofFile instanceof File) || proofFile.size === 0) {
    throw new Error("Bukti transfer wajib diupload.");
  }

  if (proofFile.size > 2 * 1024 * 1024) {
    throw new Error("Ukuran bukti transfer maksimal 2MB.");
  }

  if (!["image/jpeg", "image/png", "image/webp"].includes(proofFile.type)) {
    throw new Error("Bukti transfer harus JPG, PNG, atau WEBP.");
  }

  const { data: packageRow } = await admin
    .from("packages")
    .select("id, name, price, quantity, delivery_time, bonus_description, service_id")
    .eq("id", parsed.data.package_id)
    .eq("is_active", true)
    .single();

  if (!packageRow) {
    throw new Error("Paket tidak ditemukan atau sudah tidak aktif.");
  }

  const normalizedWhatsapp = normalizeWhatsapp(parsed.data.customer_whatsapp);
  const topLevelUser = await findOrCreateUser({
    email: parsed.data.customer_email,
    fullName: parsed.data.customer_name,
    whatsapp: normalizedWhatsapp,
  });

  const guestOrderId = randomUUID();
  const fileName = sanitizeFileName(proofFile.name || "bukti-transfer.webp");
  const storagePath = `${topLevelUser.userId}/${guestOrderId}/${Date.now()}-${fileName}`;
  const fileBuffer = Buffer.from(await proofFile.arrayBuffer());

  const { error: uploadError } = await admin.storage
    .from("guest-payment-proofs")
    .upload(storagePath, fileBuffer, {
      contentType: proofFile.type,
      upsert: false,
    });

  if (uploadError) {
    console.error("[submitGuestOrderAction] guest upload failed", uploadError);
    throw new Error("Upload bukti transfer gagal. Coba lagi ya.");
  }

  const { error: insertError } = await admin.from("guest_orders").insert({
    id: guestOrderId,
    package_id: parsed.data.package_id,
    user_id: topLevelUser.userId,
    target: parsed.data.target.trim(),
    customer_name: parsed.data.customer_name,
    customer_whatsapp: normalizedWhatsapp,
    customer_email: parsed.data.customer_email,
    payment_proof_url: storagePath,
    status: "payment_review",
    total_price: packageRow.price,
    admin_notes: `Bank transfer: ${parsed.data.bank}`,
  });

  if (insertError) {
    console.error("[submitGuestOrderAction] insert guest order failed", insertError);
    await admin.storage.from("guest-payment-proofs").remove([storagePath]);
    throw new Error("Pesanan belum berhasil disimpan.");
  }

  console.log("[GuestOrder] notify-admin", {
    guestOrderId,
    customer: parsed.data.customer_name,
    email: parsed.data.customer_email,
    whatsapp: normalizedWhatsapp,
    amount: packageRow.price,
  });
  console.log("[GuestOrder] notify-customer", {
    guestOrderId,
    whatsapp: normalizedWhatsapp,
    createdAccount: topLevelUser.wasCreated,
  });

  const adminWhatsapp = process.env.ADMIN_WHATSAPP_NUMBER;
  const notifications = [
    sendWhatsApp({
      target: normalizedWhatsapp,
      message: whatsappTemplates.guestOrderReceived(
        parsed.data.customer_name,
        packageRow.name,
        guestOrderId,
      ),
    }),
  ];

  if (adminWhatsapp) {
    notifications.push(
      sendWhatsApp({
        target: adminWhatsapp,
        message: whatsappTemplates.adminNotifNewGuestOrder(
          parsed.data.customer_name,
          packageRow.name,
        ),
      }),
    );
  }

  void Promise.allSettled(notifications).then((results) => {
    console.log("[submitGuestOrderAction] WhatsApp settled", results);
  });

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/guest-orders");

  redirect(`/order/${parsed.data.package_id}/success?order_id=${guestOrderId}`);
}
