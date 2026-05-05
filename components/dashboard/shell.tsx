"use client";

import type { ReactNode } from "react";
import { useState } from "react";

import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import { Dialog, DialogContent } from "@/components/ui/dialog";

type DashboardShellProps = {
  children: ReactNode;
  fullName: string;
  email: string;
};

export function DashboardShell({
  children,
  fullName,
  email,
}: DashboardShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen">
        <div className="hidden w-60 shrink-0 lg:block">
          <div className="sticky top-0 h-screen">
            <Sidebar />
          </div>
        </div>

        <Dialog open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <DialogContent className="left-0 top-0 h-screen max-w-[240px] translate-x-0 translate-y-0 rounded-none border-0 p-0 shadow-2xl data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left">
            <Sidebar onNavigate={() => setIsSidebarOpen(false)} />
          </DialogContent>
        </Dialog>

        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar
            fullName={fullName}
            email={email}
            onOpenSidebar={() => setIsSidebarOpen(true)}
          />
          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
