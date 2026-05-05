"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import {
  adjustCustomerBalanceAction,
  approveTopupAction,
  processGuestOrderAction,
  rejectGuestOrderAction,
  rejectTopupAction,
  replyTicketAction,
  saveAppSettingsAction,
  syncProcessingOrdersAction,
  syncServicesAction,
  updateServiceAction,
} from "@/app/(admin)/admin/actions";
import { ConfirmButton } from "@/components/admin/confirm-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function ApproveTopupButton({
  topupId,
  amountLabel,
}: {
  topupId: string;
  amountLabel: string;
}) {
  return (
    <ConfirmButton
      label="Approve"
      confirmMessage={`Yakin approve top up ${amountLabel}?`}
      pendingLabel="Approving..."
      className="rounded-full bg-emerald-600 text-white hover:bg-emerald-700"
      action={() => approveTopupAction({ topupId })}
    />
  );
}

export function RejectTopupForm({ topupId }: { topupId: string }) {
  const [reason, setReason] = useState("");
  const [isPending, startTransition] = useTransition();

  return (
    <div className="space-y-3">
      <Textarea
        value={reason}
        onChange={(event) => setReason(event.target.value)}
        placeholder="Tulis alasan reject top up..."
      />
      <Button
        type="button"
        variant="destructive"
        className="rounded-full"
        disabled={isPending}
        onClick={() => {
          if (!reason.trim()) {
            toast.error("Alasan reject wajib diisi.");
            return;
          }

          if (!window.confirm("Yakin reject top up ini?")) return;

          startTransition(async () => {
            try {
              await rejectTopupAction({ topupId, reason });
              toast.success("Top up berhasil direject.");
            } catch (error) {
              toast.error("Reject top up gagal", {
                description:
                  error instanceof Error ? error.message : "Coba lagi beberapa saat lagi.",
              });
            }
          });
        }}
      >
        {isPending ? "Rejecting..." : "Reject"}
      </Button>
    </div>
  );
}

export function ProcessGuestOrderButton({ guestOrderId }: { guestOrderId: string }) {
  return (
    <ConfirmButton
      label="Approve & Process"
      confirmMessage="Yakin approve dan kirim guest order ini ke provider?"
      pendingLabel="Processing..."
      className="rounded-full bg-brand text-white hover:bg-brand-600"
      action={() => processGuestOrderAction({ guestOrderId })}
    />
  );
}

export function RejectGuestOrderForm({ guestOrderId }: { guestOrderId: string }) {
  const [reason, setReason] = useState("");
  const [isPending, startTransition] = useTransition();

  return (
    <div className="space-y-3">
      <Textarea
        value={reason}
        onChange={(event) => setReason(event.target.value)}
        placeholder="Alasan reject guest order..."
      />
      <Button
        type="button"
        variant="destructive"
        className="rounded-full"
        disabled={isPending}
        onClick={() => {
          if (!reason.trim()) {
            toast.error("Alasan reject wajib diisi.");
            return;
          }

          if (!window.confirm("Yakin reject guest order ini?")) return;

          startTransition(async () => {
            try {
              await rejectGuestOrderAction({ guestOrderId, reason });
              toast.success("Guest order berhasil direject.");
            } catch (error) {
              toast.error("Reject guest order gagal", {
                description:
                  error instanceof Error ? error.message : "Coba lagi beberapa saat lagi.",
              });
            }
          });
        }}
      >
        {isPending ? "Rejecting..." : "Reject"}
      </Button>
    </div>
  );
}

export function SyncOrdersButton() {
  return (
    <ConfirmButton
      label="Sync All Processing Orders"
      confirmMessage="Jalankan sync status untuk semua order processing sekarang?"
      pendingLabel="Syncing..."
      className="rounded-full bg-slate-950 text-white hover:bg-slate-800"
      action={syncProcessingOrdersAction}
    />
  );
}

export function SyncServicesButton() {
  return (
    <ConfirmButton
      label="Sync dari IrvanKede"
      confirmMessage="Yakin sync semua layanan dari IrvanKede sekarang?"
      pendingLabel="Syncing..."
      className="rounded-full bg-brand text-white hover:bg-brand-600"
      action={syncServicesAction}
    />
  );
}

export function ServiceInlineEdit({
  serviceId,
  priceSell,
  isActive,
  isFeatured,
}: {
  serviceId: string;
  priceSell: number;
  isActive: boolean;
  isFeatured: boolean;
}) {
  const [price, setPrice] = useState(String(priceSell));
  const [active, setActive] = useState(isActive);
  const [featured, setFeatured] = useState(isFeatured);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Input
        value={price}
        onChange={(event) => setPrice(event.target.value)}
        className="h-10 w-32"
      />
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={active}
          onChange={(event) => setActive(event.target.checked)}
        />
        Aktif
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={featured}
          onChange={(event) => setFeatured(event.target.checked)}
        />
        Featured
      </label>
      <Button
        type="button"
        className="rounded-full"
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            try {
              await updateServiceAction({
                serviceId,
                priceSell: Number(price),
                isActive: active,
                isFeatured: featured,
              });
              toast.success("Service berhasil diupdate.");
            } catch (error) {
              toast.error("Update service gagal", {
                description:
                  error instanceof Error ? error.message : "Coba lagi beberapa saat lagi.",
              });
            }
          })
        }
      >
        {isPending ? "Menyimpan..." : "Simpan"}
      </Button>
    </div>
  );
}

export function ReplyTicketForm({ ticketId }: { ticketId: string }) {
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  return (
    <div className="space-y-3">
      <Textarea
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        placeholder="Tulis jawaban untuk customer..."
      />
      <Button
        type="button"
        className="rounded-full bg-brand text-white hover:bg-brand-600"
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            try {
              await replyTicketAction({ ticketId, response: message });
              toast.success("Jawaban tiket berhasil dikirim.");
              setMessage("");
            } catch (error) {
              toast.error("Balasan tiket gagal", {
                description:
                  error instanceof Error ? error.message : "Coba lagi beberapa saat lagi.",
              });
            }
          })
        }
      >
        {isPending ? "Mengirim..." : "Kirim Jawaban"}
      </Button>
    </div>
  );
}

export function AdjustBalanceForm({ userId }: { userId: string }) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [isPending, startTransition] = useTransition();

  return (
    <div className="space-y-3">
      <Input
        value={amount}
        onChange={(event) => setAmount(event.target.value)}
        placeholder="Contoh: 50000 atau -10000"
      />
      <Textarea
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        placeholder="Catatan adjustment saldo..."
      />
      <Button
        type="button"
        className="rounded-full"
        disabled={isPending}
        onClick={() => {
          if (!window.confirm("Yakin simpan adjustment saldo ini?")) return;

          startTransition(async () => {
            try {
              await adjustCustomerBalanceAction({
                userId,
                amount: Number(amount),
                description,
              });
              toast.success("Saldo customer berhasil diadjust.");
              setAmount("");
              setDescription("");
            } catch (error) {
              toast.error("Adjust saldo gagal", {
                description:
                  error instanceof Error ? error.message : "Coba lagi beberapa saat lagi.",
              });
            }
          });
        }}
      >
        {isPending ? "Menyimpan..." : "Simpan Adjustment"}
      </Button>
    </div>
  );
}

export function SaveSettingsForm({
  initialMarkup,
  initialMaintenance,
  initialBanks,
  initialWhatsapp,
}: {
  initialMarkup: number;
  initialMaintenance: boolean;
  initialBanks: string;
  initialWhatsapp: string;
}) {
  const [markup, setMarkup] = useState(String(initialMarkup));
  const [maintenance, setMaintenance] = useState(initialMaintenance);
  const [banks, setBanks] = useState(initialBanks);
  const [whatsapp, setWhatsapp] = useState(initialWhatsapp);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="space-y-5">
      <Input
        value={markup}
        onChange={(event) => setMarkup(event.target.value)}
        placeholder="Markup percentage default"
      />
      <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
        <input
          type="checkbox"
          checked={maintenance}
          onChange={(event) => setMaintenance(event.target.checked)}
        />
        Maintenance mode aktif
      </label>
      <Textarea
        value={banks}
        onChange={(event) => setBanks(event.target.value)}
        placeholder='{"BCA":{"accountNumber":"123","accountName":"NaikBoost"}}'
        className="min-h-40"
      />
      <Textarea
        value={whatsapp}
        onChange={(event) => setWhatsapp(event.target.value)}
        placeholder='{"provider":"fonnte","token":"..."}'
        className="min-h-32"
      />
      <Button
        type="button"
        className="rounded-full bg-brand text-white hover:bg-brand-600"
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            try {
              await saveAppSettingsAction({
                defaultMarkupPercentage: Number(markup),
                maintenanceMode: maintenance,
                banksJson: banks,
                whatsappGateway: whatsapp,
              });
              toast.success("Pengaturan sistem berhasil disimpan.");
            } catch (error) {
              toast.error("Simpan pengaturan gagal", {
                description:
                  error instanceof Error ? error.message : "Coba lagi beberapa saat lagi.",
              });
            }
          })
        }
      >
        {isPending ? "Menyimpan..." : "Simpan Pengaturan"}
      </Button>
    </div>
  );
}
