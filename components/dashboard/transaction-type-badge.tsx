import { cn } from "@/lib/utils";

const typeConfig: Record<string, { label: string; className: string; sign: string }> = {
  topup: {
    label: "Top Up",
    className: "bg-emerald-50 text-emerald-700",
    sign: "+",
  },
  order: {
    label: "Pesanan",
    className: "bg-brand-50 text-brand-700",
    sign: "-",
  },
  refund: {
    label: "Refund",
    className: "bg-amber-50 text-amber-700",
    sign: "+",
  },
  adjustment: {
    label: "Adjustment",
    className: "bg-slate-100 text-slate-700",
    sign: "+/-",
  },
};

export function TransactionTypeBadge({ type }: { type: string }) {
  const config = typeConfig[type] || typeConfig.adjustment;

  return (
    <span className={cn("inline-flex rounded-full px-3 py-1 text-xs font-semibold", config.className)}>
      {config.label}
    </span>
  );
}

export function getTransactionSign(type: string) {
  return (typeConfig[type] || typeConfig.adjustment).sign;
}
