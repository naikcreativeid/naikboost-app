"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowUpDown,
  CreditCard,
  HelpCircle,
  LayoutGrid,
  Plus,
  Receipt,
  RefreshCw,
  User,
} from "lucide-react";

import { cn } from "@/lib/utils";

const sidebarSections = [
  {
    title: "Menu",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
      { href: "/dashboard/order", label: "Pesan Layanan", icon: Plus },
      { href: "/dashboard/orders", label: "Riwayat Pesanan", icon: Receipt },
      { href: "/dashboard/refill", label: "Refill Garansi", icon: RefreshCw },
    ],
  },
  {
    title: "Saldo",
    items: [
      { href: "/dashboard/topup", label: "Top Up Saldo", icon: CreditCard },
      { href: "/dashboard/transactions", label: "Mutasi Saldo", icon: ArrowUpDown },
    ],
  },
  {
    title: "Akun",
    items: [
      { href: "/dashboard/profile", label: "Profil Saya", icon: User },
      { href: "/dashboard/support", label: "Bantuan", icon: HelpCircle },
    ],
  },
];

type SidebarProps = {
  onNavigate?: () => void;
};

export function Sidebar({ onNavigate }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full flex-col bg-slate-950 text-white">
      <div className="border-b border-white/10 px-6 py-6">
        <Link href="/dashboard" className="flex items-center gap-3" onClick={onNavigate}>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand text-sm font-black text-white">
            NB
          </div>
          <div>
            <p className="text-base font-bold">NaikBoost</p>
            <p className="text-xs text-white/60">Customer Dashboard</p>
          </div>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="space-y-7">
          {sidebarSections.map((section) => (
            <div key={section.title} className="space-y-3">
              <p className="px-3 text-xs font-semibold uppercase tracking-[0.24em] text-white/40">
                {section.title}
              </p>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive =
                    item.href === "/dashboard"
                      ? pathname === item.href
                      : pathname === item.href || pathname.startsWith(`${item.href}/`);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onNavigate}
                      className={cn(
                        "flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition",
                        isActive
                          ? "bg-brand text-white shadow-lg shadow-brand-950/30"
                          : "text-white/70 hover:bg-white/5 hover:text-white",
                      )}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
