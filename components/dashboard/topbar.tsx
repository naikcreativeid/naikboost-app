"use client";

import Link from "next/link";
import { useState } from "react";
import { Bell, LogOut, Menu, Settings, User } from "lucide-react";

import { signOut } from "@/app/actions/auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type TopbarProps = {
  fullName: string;
  email: string;
  onOpenSidebar: () => void;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function Topbar({ fullName, email, onOpenSidebar }: TopbarProps) {
  const [isNotifOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenSidebar}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-700 lg:hidden"
            aria-label="Buka menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div>
            <p className="text-sm text-slate-500">Selamat datang kembali</p>
            <h1 className="text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
              Halo, <span className="font-serif font-normal italic text-brand">{fullName}</span>
            </h1>
            <p className="text-xs text-slate-500 sm:text-sm">
              Pantau saldo, buat pesanan, dan lihat progres akun kamu di sini.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-brand-200 hover:text-brand-600"
            aria-label="Notifikasi"
          >
            <Bell className="h-5 w-5" />
            {!isNotifOpen ? (
              <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-brand" />
            ) : null}
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger className="rounded-full focus:outline-none focus:ring-2 focus:ring-brand/30">
              <Avatar className="h-11 w-11 border border-slate-200">
                <AvatarFallback className="bg-brand text-sm font-bold text-white">
                  {getInitials(fullName || email || "NB")}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60 rounded-2xl p-2">
              <div className="px-3 py-2">
                <p className="font-semibold text-slate-950">{fullName}</p>
                <p className="text-sm text-slate-500">{email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile">
                  <User className="h-4 w-4" />
                  Profil Saya
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings">
                  <Settings className="h-4 w-4" />
                  Pengaturan
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <form action={signOut}>
                <DropdownMenuItem
                  asChild
                  className="text-red-600 focus:bg-red-50 focus:text-red-700"
                >
                  <button type="submit" className="w-full">
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </DropdownMenuItem>
              </form>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
