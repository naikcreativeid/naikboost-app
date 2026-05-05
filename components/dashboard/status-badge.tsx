import { cn } from "@/lib/utils";

const statusMap: Record<string, string> = {
  pending: "bg-slate-100 text-slate-600",
  processing: "bg-brand-50 text-brand-700",
  success: "bg-emerald-50 text-emerald-700",
  partial: "bg-amber-50 text-amber-700",
  error: "bg-red-50 text-red-700",
  refunded: "bg-orange-50 text-orange-700",
};

const statusLabel: Record<string, string> = {
  pending: "Pending",
  processing: "Processing",
  success: "Success",
  partial: "Partial",
  error: "Error",
  refunded: "Refunded",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-xs font-semibold",
        statusMap[status] || "bg-slate-100 text-slate-600",
      )}
    >
      {statusLabel[status] || status}
    </span>
  );
}
