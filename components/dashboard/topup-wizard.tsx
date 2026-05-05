"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import imageCompression from "browser-image-compression";
import { CheckCircle2, Copy, Loader2, UploadCloud } from "lucide-react";
import { toast } from "sonner";

import { submitTopupAction } from "@/app/(dashboard)/dashboard/topup/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BANK_OPTIONS, type BankOption } from "@/lib/topup/banks";
import { cn } from "@/lib/utils";

const presetAmounts = [50000, 100000, 200000, 500000, 1000000];

function formatRupiah(value: number) {
  return `Rp ${value.toLocaleString("id-ID")}`;
}

async function validateAndCompressImage(file: File) {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    throw new Error("Format gambar harus JPG, PNG, atau WEBP.");
  }

  const image = new Image();
  const objectUrl = URL.createObjectURL(file);
  image.src = objectUrl;

  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error("File gambar tidak bisa dibaca."));
  });

  URL.revokeObjectURL(objectUrl);

  if (image.width < 200 || image.height < 200) {
    throw new Error("Gambar terlalu kecil. Upload bukti yang lebih jelas ya.");
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

export function TopupWizard() {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState<number>(100000);
  const [customAmount, setCustomAmount] = useState("");
  const [selectedBank, setSelectedBank] = useState<BankOption>(BANK_OPTIONS[0]);
  const [senderName, setSenderName] = useState("");
  const [transferDate, setTransferDate] = useState("");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const effectiveAmount = useMemo(() => {
    const manualAmount = Number(customAmount.replace(/[^\d]/g, ""));
    return customAmount ? manualAmount : amount;
  }, [amount, customAmount]);

  function goNext() {
    if (step === 1 && effectiveAmount < 10000) {
      toast.error("Minimal top up Rp 10.000 ya.");
      return;
    }
    if (step === 2 && !selectedBank) {
      toast.error("Pilih bank tujuan dulu ya.");
      return;
    }
    setStep((current) => Math.min(current + 1, 4));
  }

  function goBack() {
    setStep((current) => Math.max(current - 1, 1));
  }

  async function handleFileChange(file: File | null) {
    if (!file) return;

    try {
      const compressed = await validateAndCompressImage(file);
      setProofFile(compressed);
      setProofPreview(URL.createObjectURL(compressed));
      toast.success("Bukti transfer siap diupload", {
        description: "Gambar sudah kami kompres supaya upload lebih ringan.",
      });
    } catch (error) {
      toast.error("Bukti transfer belum valid", {
        description:
          error instanceof Error ? error.message : "Coba pilih gambar lain ya.",
      });
    }
  }

  function handleSubmit() {
    if (!senderName.trim()) {
      toast.error("Nama pengirim wajib diisi.");
      return;
    }

    if (!transferDate) {
      toast.error("Tanggal transfer wajib diisi.");
      return;
    }

    if (!proofFile) {
      toast.error("Upload bukti transfer dulu ya.");
      return;
    }

    const formData = new FormData();
    formData.set("amount", String(effectiveAmount));
    formData.set("bank", selectedBank.code);
    formData.set("sender_name", senderName.trim());
    formData.set("transfer_date", transferDate);
    formData.set("proof_file", proofFile);

    startTransition(async () => {
      try {
        await submitTopupAction(formData);
        toast.success("Konfirmasi top up berhasil dikirim", {
          description: "Tim kami akan cek bukti transfer kamu secepatnya.",
        });
        setStep(4);
      } catch (error) {
        toast.error("Top up belum berhasil dikirim", {
          description:
            error instanceof Error ? error.message : "Coba lagi beberapa saat lagi.",
        });
      }
    });
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full border text-sm",
                  step >= item
                    ? "border-brand bg-brand text-white"
                    : "border-slate-200 bg-white text-slate-500",
                )}
              >
                {item}
              </div>
              {item < 4 ? <div className="h-px w-5 bg-slate-200" /> : null}
            </div>
          ))}
        </div>

        {step === 1 ? (
          <div className="mt-8 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-950">Pilih nominal top up</h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Kamu bisa pilih nominal cepat atau isi nominal manual sesuai kebutuhan.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {presetAmounts.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    setAmount(preset);
                    setCustomAmount("");
                  }}
                  className={cn(
                    "rounded-[1.5rem] border px-5 py-4 text-left transition",
                    !customAmount && amount === preset
                      ? "border-brand bg-brand-50"
                      : "border-slate-200 hover:border-brand-200 hover:bg-slate-50",
                  )}
                >
                  <p className="text-lg font-bold text-slate-950">{formatRupiah(preset)}</p>
                </button>
              ))}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Atau isi nominal manual
              </label>
              <Input
                inputMode="numeric"
                value={customAmount}
                onChange={(event) => setCustomAmount(event.target.value)}
                placeholder="Contoh: 150000"
              />
              <p className="mt-2 text-xs text-slate-500">Minimal top up Rp 10.000.</p>
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="mt-8 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-950">Pilih bank tujuan</h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Transfer ke salah satu rekening berikut, lalu lanjutkan ke upload bukti.
              </p>
            </div>

            <div className="grid gap-3">
              {BANK_OPTIONS.map((bank) => (
                <button
                  key={bank.code}
                  type="button"
                  onClick={() => setSelectedBank(bank)}
                  className={cn(
                    "rounded-[1.5rem] border px-5 py-4 text-left transition",
                    selectedBank.code === bank.code
                      ? "border-brand bg-brand-50"
                      : "border-slate-200 hover:border-brand-200 hover:bg-slate-50",
                  )}
                >
                  <p className="text-lg font-bold text-slate-950">{bank.name}</p>
                  <p className="mt-1 text-sm text-slate-500">{bank.accountNumber}</p>
                </button>
              ))}
            </div>

            <div className="rounded-[1.5rem] bg-slate-950 p-5 text-white">
              <p className="text-sm text-white/70">Rekening tujuan</p>
              <div className="mt-4 space-y-2 text-sm">
                <p>Bank: <span className="font-semibold">{selectedBank.name}</span></p>
                <p>No. Rek: <span className="font-semibold">{selectedBank.accountNumber}</span></p>
                <p>A/N: <span className="font-semibold">{selectedBank.accountName}</span></p>
              </div>
              <Button
                type="button"
                variant="secondary"
                className="mt-5 rounded-full bg-white text-slate-950 hover:bg-slate-100"
                onClick={async () => {
                  await navigator.clipboard.writeText(selectedBank.accountNumber);
                  toast.success("Nomor rekening disalin");
                }}
              >
                <Copy className="h-4 w-4" />
                Salin Nomor Rek
              </Button>
            </div>

            <div className="rounded-[1.5rem] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              Transfer sesuai nominal agar lebih mudah kami cocokkan saat verifikasi.
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="mt-8 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-950">Konfirmasi transfer</h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Isi data pengirim dan upload bukti transfer yang jelas.
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Nama pengirim
                </label>
                <Input
                  value={senderName}
                  onChange={(event) => setSenderName(event.target.value)}
                  placeholder="Nama di rekening pengirim"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Tanggal transfer
                </label>
                <Input
                  type="date"
                  value={transferDate}
                  onChange={(event) => setTransferDate(event.target.value)}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Upload bukti transfer
                </label>
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center">
                  <UploadCloud className="h-8 w-8 text-slate-400" />
                  <p className="mt-3 text-sm font-medium text-slate-700">
                    Klik untuk pilih gambar bukti transfer
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    JPG, PNG, atau WEBP. Maksimal 2MB.
                  </p>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(event) => void handleFileChange(event.target.files?.[0] || null)}
                  />
                </label>
              </div>

              {proofPreview ? (
                <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4">
                  <p className="text-sm font-semibold text-slate-700">Preview bukti transfer</p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={proofPreview}
                    alt="Preview bukti transfer"
                    className="mt-3 max-h-80 w-full rounded-2xl object-contain"
                  />
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        {step === 4 ? (
          <div className="mt-8 flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle2 className="h-20 w-20 text-emerald-500" />
            <h2 className="mt-6 text-3xl font-black text-slate-950">
              Top up sedang diverifikasi
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-7 text-slate-600">
              Tim kami akan approve dalam maksimal 1x24 jam. Saldo kamu akan otomatis
              bertambah setelah top up disetujui.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild className="rounded-full bg-brand text-white hover:bg-brand-600">
                <Link href="/dashboard">Kembali ke Dashboard</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full">
                <Link href="/dashboard/topup/history">Lihat Status Top Up</Link>
              </Button>
            </div>
          </div>
        ) : null}

        {step < 4 ? (
          <div className="mt-8 flex items-center justify-between gap-3">
            <Button type="button" variant="outline" className="rounded-full" onClick={goBack} disabled={step === 1}>
              Kembali
            </Button>
            {step < 3 ? (
              <Button type="button" className="rounded-full bg-brand text-white hover:bg-brand-600" onClick={goNext}>
                Lanjut
              </Button>
            ) : (
              <Button
                type="button"
                className="rounded-full bg-brand text-white hover:bg-brand-600"
                onClick={handleSubmit}
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Mengirim Konfirmasi...
                  </>
                ) : (
                  "Kirim Konfirmasi"
                )}
              </Button>
            )}
          </div>
        ) : null}
      </section>

      <aside className="space-y-5">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">
            Ringkasan Top Up
          </p>
          <div className="mt-5 space-y-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Nominal</span>
              <span className="font-semibold text-slate-950">
                {formatRupiah(Math.max(effectiveAmount || 0, 0))}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Bank tujuan</span>
              <span className="font-semibold text-slate-950">{selectedBank.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Status</span>
              <span className="font-semibold text-slate-950">
                {step === 4 ? "Menunggu verifikasi" : "Belum dikirim"}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-slate-950 p-6 text-white shadow-sm">
          <h3 className="text-lg font-bold">Catatan penting</h3>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-white/75">
            <li>Pastikan bukti transfer jelas dan tidak blur.</li>
            <li>Upload bukti transfer sesaat setelah transfer berhasil.</li>
            <li>Kalau nominal dan bukti cocok, saldo akan ditambah otomatis setelah approval.</li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
