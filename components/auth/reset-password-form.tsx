"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

const resetPasswordSchema = z
  .object({
    new_password: z
      .string()
      .min(8, "Password baru minimal 8 karakter.")
      .regex(/\d/, "Password baru harus mengandung minimal 1 angka."),
    confirm_password: z.string(),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    path: ["confirm_password"],
    message: "Konfirmasi password belum sama.",
  });

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      new_password: "",
      confirm_password: "",
    },
  });

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) {
      setIsReady(true);
      return;
    }

    const params = new URLSearchParams(hash.replace(/^#/, ""));
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");

    async function hydrateSession() {
      if (accessToken && refreshToken) {
        const supabase = createClient();
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (error) {
          toast.error("Link reset tidak valid", {
            description: "Minta link reset baru lalu coba lagi ya.",
          });
        }

        window.history.replaceState({}, document.title, window.location.pathname);
      }

      setIsReady(true);
    }

    void hydrateSession();
  }, []);

  async function onSubmit(values: ResetPasswordValues) {
    setIsSubmitting(true);
    const supabase = createClient();

    const { error } = await supabase.auth.updateUser({
      password: values.new_password,
    });

    setIsSubmitting(false);

    if (error) {
      toast.error("Password baru belum tersimpan", {
        description: "Coba ulangi beberapa saat lagi ya.",
      });
      return;
    }

    toast.success("Password berhasil diperbarui", {
      description: "Sekarang kamu bisa login pakai password baru.",
    });
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="new_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password baru</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Minimal 8 karakter" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirm_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Konfirmasi password baru</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Ulangi password baru" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="h-11 w-full rounded-full bg-brand text-white hover:bg-brand-600"
            disabled={isSubmitting || !isReady}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Menyimpan password...
              </>
            ) : (
              "Simpan Password Baru"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
