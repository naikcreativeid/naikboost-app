import { SaveSettingsForm } from "@/components/admin/action-forms";
import { createClient } from "@/lib/supabase/server";

type AppSettingRow = {
  id: number;
  default_markup_percentage: number;
  maintenance_mode: boolean;
  bank_accounts: string | null;
  whatsapp_gateway_settings: string | null;
};

export default async function AdminSettingsPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from("app_settings")
    .select("id, default_markup_percentage, maintenance_mode, bank_accounts, whatsapp_gateway_settings")
    .eq("id", 1)
    .maybeSingle();

  const settings = data as AppSettingRow | null;

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">
          Pengaturan Sistem
        </p>
        <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
          Atur sistem NaikBoost
        </h2>
      </div>

      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <SaveSettingsForm
          initialMarkup={settings?.default_markup_percentage || 50}
          initialMaintenance={settings?.maintenance_mode || false}
          initialBanks={settings?.bank_accounts || '{"BCA":{"accountNumber":"1234567890","accountName":"NaikBoost Indonesia"}}'}
          initialWhatsapp={settings?.whatsapp_gateway_settings || '{"provider":"fonnte","token":""}'}
        />
      </div>
    </div>
  );
}
