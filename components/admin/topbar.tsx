"use client";

import { Bell, ShieldCheck } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type AdminTopbarProps = {
  name: string;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((item) => item[0]?.toUpperCase())
    .join("");
}

export function AdminTopbar({ name }: AdminTopbarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div>
          <p className="text-sm text-slate-500">Panel admin NaikBoost</p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950">
            Halo, <span className="font-serif font-normal italic text-brand">{name}</span>
          </h1>
          <p className="text-sm text-slate-500">
            Approval top up, guest order, support, dan monitoring harian ada di sini.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 sm:flex">
            <ShieldCheck className="h-4 w-4" />
            Admin aktif
          </div>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-600"
          >
            <Bell className="h-5 w-5" />
          </button>
          <Avatar className="h-11 w-11 border border-slate-200">
            <AvatarFallback className="bg-brand text-sm font-bold text-white">
              {getInitials(name || "AD")}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
