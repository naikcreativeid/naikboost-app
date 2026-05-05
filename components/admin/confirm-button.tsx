"use client";

import type { ReactNode } from "react";
import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

type ConfirmButtonProps = {
  label: string;
  confirmMessage: string;
  pendingLabel?: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  className?: string;
  successMessage?: string;
  action: () => Promise<{ message?: string } | void>;
  children?: ReactNode;
};

export function ConfirmButton({
  label,
  confirmMessage,
  pendingLabel,
  variant = "default",
  className,
  successMessage,
  action,
  children,
}: ConfirmButtonProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant={variant}
      className={className}
      disabled={isPending}
      onClick={() => {
        if (!window.confirm(confirmMessage)) return;

        startTransition(async () => {
          try {
            const result = await action();
            toast.success(successMessage || result?.message || "Aksi berhasil disimpan.");
          } catch (error) {
            toast.error("Aksi belum berhasil", {
              description:
                error instanceof Error ? error.message : "Coba lagi beberapa saat lagi.",
            });
          }
        });
      }}
    >
      {isPending ? pendingLabel || "Memproses..." : children || label}
    </Button>
  );
}
