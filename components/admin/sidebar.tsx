"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowRightLeft,
  LayoutDashboard,
  RefreshCw,
  Settings2,
  ShoppingCart,
  Ticket,
  Users,
  Wallet,
  Wrench,
} from "lucide-react";

import { cn } from "@/lib/utils";

type BadgeCounts = {
  topups: number;
  guestOrders: number;
  tickets: number;
};

type AdminSidebarProps = {
  badges: BadgeCounts;
};

const menuItems = [
  { href: "/admin", label: "Dashboard Admin", icon: LayoutDashboard },
  { href: "/admin/topups", label: "Top Up Pending", icon: Wallet, badgeKey: "topups" as const },
  {
    href: "/admin/guest-orders",
    label: "Guest Orders Pending",
    icon: ShoppingCart,
    badgeKey: "guestOrders" as const,
  },
  { href: "/admin/tickets", label: "Tiket Support", icon: Ticket, badgeKey: "tickets" as const },
  { href: "/admin/orders", label: "Semua Pesanan", icon: ArrowRightLeft },
  { href: "/admin/customers", label: "Customer", icon: Users },
  { href: "/admin/services", label: "Pengaturan Layanan", icon: Wrench },
  { href: "/admin/sync", label: "Sync Services dari IrvanKede", icon: RefreshCw },
  { href: "/admin/settings", label: "Pengaturan", icon: Settings2 },
];

export function AdminSidebar({ badges }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full flex-col bg-slate-950 text-white">
      <div className="border-b border-white/10 px-6 py-6">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand text-sm font-black text-white">
            NB
          </div>
          <div>
            <p className="text-base font-bold">NaikBoost Admin</p>
            <p className="text-xs text-white/60">Approval & Monitoring</p>
          </div>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6">
        <p className="px-3 text-xs font-semibold uppercase tracking-[0.24em] text-white/40">
          Menu Admin
        </p>
        <div className="mt-3 space-y-1">
          {menuItems.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === item.href
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            const badgeValue = item.badgeKey ? badges[item.badgeKey] : 0;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition",
                  isActive
                    ? "bg-white text-slate-950 shadow-lg"
                    : "text-white/70 hover:bg-white/5 hover:text-white",
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                <span className="flex-1">{item.label}</span>
                {badgeValue > 0 ? (
                  <span
                    className={cn(
                      "inline-flex min-w-6 items-center justify-center rounded-full px-2 py-0.5 text-xs font-bold",
                      isActive ? "bg-brand text-white" : "bg-brand/20 text-brand-100",
                    )}
                  >
                    {badgeValue}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="border-t border-white/10 px-6 py-5 text-xs leading-6 text-white/50">
        Dibuat sesimpel mungkin supaya approval harian cepat dan jelas.
      </div>
    </aside>
  );
}
