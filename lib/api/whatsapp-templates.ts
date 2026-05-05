const fallbackAppUrl = "https://naikboost.app";

function formatRupiah(amount: number | string) {
  return new Intl.NumberFormat("id-ID").format(Number(amount || 0));
}

function appUrl(path: string) {
  const base = (process.env.NEXT_PUBLIC_APP_URL || fallbackAppUrl).replace(/\/$/, "");
  return `${base}${path}`;
}

export const whatsappTemplates = {
  topupReceived(customerName: string, amount: number) {
    return [
      `Halo ${customerName}! Top up sebesar Rp ${formatRupiah(amount)} kamu sudah kami terima.`,
      "Tim kami akan verifikasi maksimal 1x24 jam.",
      `Cek status: ${appUrl("/dashboard/topup/history")}`,
      "- NaikBoost",
    ].join("\n");
  },

  topupApproved(customerName: string, amount: number, newBalance: number) {
    return [
      `Halo ${customerName}! Top up Rp ${formatRupiah(amount)} sudah disetujui.`,
      `Saldo kamu sekarang: Rp ${formatRupiah(newBalance)}`,
      `Yuk pesan layanan: ${appUrl("/dashboard/order")}`,
      "- NaikBoost",
    ].join("\n");
  },

  topupRejected(customerName: string, amount: number, reason: string) {
    return [
      `Halo ${customerName}, mohon maaf top up Rp ${formatRupiah(amount)} kami tolak.`,
      `Alasan: ${reason}`,
      "Hubungi CS kami untuk klarifikasi.",
      "- NaikBoost",
    ].join("\n");
  },

  orderCreated(customerName: string, serviceName: string, target: string, quantity: number) {
    return [
      `Halo ${customerName}! Pesanan kamu sudah masuk:`,
      `Paket/Layanan: ${serviceName}`,
      `Target: ${target}`,
      `Jumlah: ${new Intl.NumberFormat("id-ID").format(quantity)}`,
      "Sedang diproses, biasanya selesai 6-24 jam.",
      "- NaikBoost",
    ].join("\n");
  },

  orderCompleted(customerName: string, serviceName: string, target: string) {
    return [
      `Halo ${customerName}! Pesanan kamu sudah selesai!`,
      `Paket/Layanan: ${serviceName}`,
      `Target: ${target}`,
      `Cek akun kamu sekarang. Mau order lagi? ${appUrl("")}`,
      "- NaikBoost",
    ].join("\n");
  },

  guestOrderReceived(customerName: string, packageName: string, orderId: string) {
    return [
      `Halo ${customerName}! Pesanan kamu sudah diterima.`,
      `Paket: ${packageName}`,
      `Order ID: ${orderId}`,
      `Tracking: ${appUrl(`/track/${orderId}`)}`,
      "Tim kami akan verifikasi pembayaran dalam 1x24 jam.",
      "- NaikBoost",
    ].join("\n");
  },

  adminNotifNewTopup(customerName: string, amount: number) {
    return [
      "Top Up Baru",
      `Customer: ${customerName}`,
      `Nominal: Rp ${formatRupiah(amount)}`,
      `Approve di: ${appUrl("/admin/topups")}`,
    ].join("\n");
  },

  adminNotifNewGuestOrder(customerName: string, packageName: string) {
    return [
      "Guest Order Baru",
      `Customer: ${customerName}`,
      `Paket: ${packageName}`,
      `Approve di: ${appUrl("/admin/guest-orders")}`,
    ].join("\n");
  },
};
