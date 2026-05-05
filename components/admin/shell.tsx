import type { ReactNode } from "react";

import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminTopbar } from "@/components/admin/topbar";

type AdminShellProps = {
  children: ReactNode;
  adminName: string;
  badges: {
    topups: number;
    guestOrders: number;
    tickets: number;
  };
};

export function AdminShell({ children, adminName, badges }: AdminShellProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen">
        <div className="hidden w-72 shrink-0 xl:block">
          <div className="sticky top-0 h-screen">
            <AdminSidebar badges={badges} />
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <AdminTopbar name={adminName} />
          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
