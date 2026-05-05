"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import imageCompression from "browser-image-compression";
import { Copy, Loader2, UploadCloud } from "lucide-react";
import { toast } from "sonner";

import { submitGuestOrderAction } from "@/app/order/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BANK_OPTIONS, type BankOption } from "@/lib/topup/banks";

type PackageSummary = {
  id: string;
  name: string;
  quantity: number;
  price: number;
  description: string | null;
  delivery_time: string | null;
  bonus_description: string | null;
  is_featured: boolean;
  service: {
    name: string;
    refill_days: number;
  } | null;
};

type GuestCheckoutFormProps = {
  packageData: PackageSummary;
};

function formatRupiah(value: number) {
  return `Rp ${value.toLocaleString("id-ID")}`;
}

async function validateAndCompressImage(file: File) {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    throw new Error("Format gambar harus JPG, PNG, atau WEBP.");
  }

  const compressed = await imageCompression(file, {
    maxSizeMB: 1.8,
    maxWidthOrHeight: 1800,
    useWebWorker: true,
    initialQuality: 0.82,
  });

  if (compressed.size > 2 * 1024 * 1024) {
    throw new Error("Ukuran gambar masih terlalu besar setelah kompres.");
  }

  return compressed;
}

export function GuestCheckoutForm({ packageData }: GuestCheckoutFormProps) {
  const [bank, setBank] = useState<BankOption>(BANK_OPTIONS[0]);
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [target, setTarget] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const refillLabel = useMemo(() => {
    if (!packageData.service?.refill_days) return "Tidak ada garansi refill";
    return `Garansi refill ${packageData.service.refill_days} hari`;
  }, [packageData.service?.refill_days]);

  async function handleFileChange(file: File | null) {
    if (!file) return;

    try {
      const compressed = await validateAndCompressImage(file);
      setProofFile(compressed);
      setProofPreview(URL.createObjectURL(compressed));
      toast.success("Bukti transfer siap dipakai");
    } catch (error) {
      toast.error("Upload gambar belum berhasil", {
        description:
          error instanceof Error ? error.message : "Coba pilih gambar lain ya.",
      });
    }
  }

  function clearLocalState() {
    setCustomerName("");
    setEmail("");
    setWhatsapp("");
    setTarget("");
    setAgreed(false);
    setProofFile(null);
    setProofPreview(null);
  }

  function handleSubmit() {
    if (!proofFile) {
      toast.error("Upload bukti transfer dulu ya.");
      return;
    }

    const formData = new FormData();
    formData.set("package_id", packageData.id);
    formData.set("customer_name", customerName);
    formData.set("customer_email", email);
    formData.set("customer_whatsapp", whatsapp);
    formData.set("target", target);
    formData.set("bank", bank.code);
    formData.set("agreed", String(agreed));
    formData.set("proof_file", proofFile);

    startTransition(async () => {
      try {
        await submitGuestOrderAction(formData);
        clearLocalState();
      } catch (error) {
        toast.error("Pesanan belum berhasil dikirim", {
          description:
            error instanceof Error ? error.message : "Coba lagi beberapa saat lagi.",
        });
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">
          Order Summary
        </p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
          {packageData.name}
        </h1>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-[1.5rem] bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Jumlah</p>
            <p className="mt-2 text-lg font-bold text-slate-950">
              {packageData.quantity.toLocaleString("id-ID")}
            </p>
          </div>
          <div className="rounded-[1.5rem] bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Estimasi pengiriman</p>
            <p className="mt-2 text-lg font-bold text-slate-950">
              {packageData.delivery_time || "6-24 jam"}
            </p>
          </div>
          <div className="rounded-[1.5rem] bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Garansi</p>
            <p className="mt-2 text-lg font-bold text-slate-950">{refillLabel}</p>
          </div>
          <div className="rounded-[1.5rem] bg-slate-950 p-4 text-white">
            <p className="text-sm text-white/70">Total harga</p>
            <p className="mt-2 text-2xl font-black">{formatRupiah(packageData.price)}</p>
          </div>
        </div>
        {packageData.bonus_description ? (
          <div className="mt-4 rounded-[1.5rem] bg-brand-50 px-4 py-3 text-sm text-brand-900">
            Bonus: {packageData.bonus_description}
          </div>
        ) : null}
      </div>

      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-950">Data customer</h2>
        <div className="mt-5 grid gap-4">
          <Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Nama lengkap" />
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email aktif" />
          <Input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="WhatsApp aktif" />
          <Input
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="Username atau link Instagram target"
          />
          <label className="flex items-start gap-3 rounded-[1.25rem] bg-slate-50 px-4 py-3 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1"
            />
            Saya setuju syarat & ketentuan dan memastikan target yang saya kirim sudah benar.
          </label>
        </div>
      </div>

      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-950">Transfer manual</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {BANK_OPTIONS.map((item) => (
            <button
              key={item.code}
              type="button"
              onClick={() => setBank(item)}
              className={`rounded-[1.5rem] border px-4 py-4 text-left transition ${
                bank.code === item.code
                  ? "border-brand bg-brand-50"
                  : "border-slate-200 hover:border-brand-200 hover:bg-slate-50"
              }`}
            >
              <p className="text-lg font-bold text-slate-950">{item.name}</p>
              <p className="mt-1 text-sm text-slate-500">{item.accountNumber}</p>
            </button>
          ))}
        </div>

        <div className="mt-5 rounded-[1.5rem] bg-slate-950 p-5 text-white">
          <p className="text-sm text-white/70">Rekening tujuan</p>
          <div className="mt-3 space-y-2 text-sm">
            <p>Bank: <span className="font-semibold">{bank.name}</span></p>
            <p>No. Rek: <span className="font-semibold">{bank.accountNumber}</span></p>
            <p>A/N: <span className="font-semibold">{bank.accountName}</span></p>
          </div>
          <Button
            type="button"
            variant="secondary"
            className="mt-4 rounded-full bg-white text-slate-950 hover:bg-slate-100"
            onClick={async () => {
              await navigator.clipboard.writeText(bank.accountNumber);
              toast.success("Nomor rekening disalin");
            }}
          >
            <Copy className="h-4 w-4" />
            Copy nomor rekening
          </Button>
        </div>

        <div className="mt-4 rounded-[1.5rem] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Transfer sesuai nominal {formatRupiah(packageData.price)} agar mudah dideteksi.
        </div>
      </div>

      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-950">Upload bukti transfer</h2>
        <label className="mt-5 flex cursor-pointer flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center">
          <UploadCloud className="h-8 w-8 text-slate-400" />
          <p className="mt-3 text-sm font-medium text-slate-700">
            Klik atau drop gambar bukti transfer di sini
          </p>
          <p className="mt-1 text-xs text-slate-500">Maksimal 2MB, format JPG/PNG/WEBP.</p>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(event) => void handleFileChange(event.target.files?.[0] || null)}
          />
        </label>

        {proofPreview ? (
          <div className="mt-4 rounded-[1.5rem] border border-slate-200 bg-white p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={proofPreview}
              alt="Preview bukti transfer"
              className="max-h-72 w-full rounded-2xl object-contain"
            />
          </div>
        ) : null}
      </div>

      <Button
        type="button"
        onClick={handleSubmit}
        disabled={isPending}
        className="h-14 w-full rounded-full bg-brand text-base font-bold text-white hover:bg-brand-600"
      >
        {isPending ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Mengirim Pesanan...
          </>
        ) : (
          "Kirim Pesanan"
        )}
      </Button>

      <p className="text-center text-sm text-slate-500">
        Butuh bantuan?{" "}
        <Link href="/" className="font-semibold text-brand hover:underline">
          Hubungi tim NaikBoost
        </Link>
      </p>
    </div>
  );
}
