import { ReplyTicketForm } from "@/components/admin/action-forms";
import { createClient } from "@/lib/supabase/server";

type TicketsPageProps = {
  searchParams?: {
    status?: string;
  };
};

type TicketRow = {
  id: string;
  subject: string;
  message: string;
  status: string;
  guest_email: string | null;
  admin_response: string | null;
  created_at: string;
  profiles: { full_name: string | null; email: string } | null;
};

type TicketRawRow = Omit<TicketRow, "profiles"> & {
  profiles:
    | { full_name: string | null; email: string }
    | { full_name: string | null; email: string }[]
    | null;
};

export default async function AdminTicketsPage({ searchParams }: TicketsPageProps) {
  const supabase = createClient();
  const status = searchParams?.status || "open";

  let request = supabase
    .from("support_tickets")
    .select("id, subject, message, status, guest_email, admin_response, created_at, profiles:profiles(full_name, email)")
    .order("created_at", { ascending: true })
    .limit(50);

  if (status !== "all") request = request.eq("status", status);

  const { data } = await request;
  const rows = ((data || []) as TicketRawRow[]).map((row) => ({
    ...row,
    profiles: Array.isArray(row.profiles) ? row.profiles[0] : row.profiles,
  })) as TicketRow[];

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">
          Tiket Support
        </p>
        <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
          Balas tiket customer dengan jelas
        </h2>
      </div>

      <div className="grid gap-5">
        {rows.map((row) => (
          <div key={row.id} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-2">
              <p className="text-sm text-slate-500">
                {row.profiles?.full_name || row.guest_email || "Guest"}
              </p>
              <h3 className="text-xl font-bold text-slate-950">{row.subject}</h3>
              <p className="text-sm leading-7 text-slate-600">{row.message}</p>
            </div>

            {row.admin_response ? (
              <div className="mt-5 rounded-[1.5rem] bg-emerald-50 p-4">
                <p className="text-sm font-semibold text-emerald-700">Jawaban admin</p>
                <p className="mt-2 text-sm leading-7 text-emerald-900">{row.admin_response}</p>
              </div>
            ) : null}

            <div className="mt-5">
              <ReplyTicketForm ticketId={row.id} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
