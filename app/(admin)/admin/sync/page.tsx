import { SyncServicesButton } from "@/components/admin/action-forms";

export default function AdminSyncPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">
          Sync Services
        </p>
        <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
          Tarik ulang layanan dari IrvanKede
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
          Jalankan sync ini saat ada service baru atau perubahan harga dari provider.
        </p>
        <div className="mt-6">
          <SyncServicesButton />
        </div>
      </div>
    </div>
  );
}
