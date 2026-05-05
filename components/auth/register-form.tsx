"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
import { trackClientEvent } from "@/lib/analytics/client";
import { isValidWhatsapp, normalizeWhatsapp } from "@/lib/auth/utils";
import { createClient } from "@/lib/supabase/client";

const registerSchema = z
  .object({
    full_name: z.string().min(2, "Nama lengkap minimal 2 karakter."),
    email: z.string().email("Masukkan email yang valid."),
    whatsapp: z
      .string()
      .min(10, "Nomor WhatsApp belum lengkap.")
      .refine((value) => isValidWhatsapp(value), {
        message: "Gunakan format 08xxxxxxxxxx atau +62xxxxxxxxxx.",
      }),
    password: z
      .string()
      .min(8, "Password minimal 8 karakter.")
      .regex(/\d/, "Password harus mengandung minimal 1 angka."),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Konfirmasi password belum sama.",
    path: ["confirm_password"],
  });

type RegisterValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      full_name: "",
      email: "",
      whatsapp: "",
      password: "",
      confirm_password: "",
    },
  });

  async function onSubmit(values: RegisterValues) {
    setIsSubmitting(true);
    const supabase = createClient();

    const normalizedWhatsapp = normalizeWhatsapp(values.whatsapp);
    const emailRedirectTo =
      typeof window !== "undefined"
        ? `${window.location.origin}/dashboard`
        : undefined;

    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        emailRedirectTo,
        data: {
          full_name: values.full_name,
          whatsapp: normalizedWhatsapp,
        },
      },
    });

    setIsSubmitting(false);

    if (error) {
      toast.error("Daftar belum berhasil", {
        description:
          error.message === "User already registered"
            ? "Email ini sudah terdaftar. Coba login saja ya."
            : "Silakan cek lagi data kamu lalu coba sekali lagi.",
      });
      return;
    }

    toast.success("Akun berhasil dibuat", {
      description: "Sekarang kamu bisa lanjut login ke dashboard.",
    });
    trackClientEvent("signup", { method: "email" });
    router.push("/verify-email");
    router.refresh();
  }

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama lengkap</FormLabel>
                <FormControl>
                  <Input placeholder="Contoh: Faisa Ramadhan" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="nama@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="whatsapp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nomor WhatsApp</FormLabel>
                <FormControl>
                  <Input placeholder="08xxxxxxxxxx atau +62xxxxxxxxxx" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
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
                <FormLabel>Konfirmasi password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Ulangi password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="h-11 w-full rounded-full bg-brand text-white hover:bg-brand-600"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Membuat akun...
              </>
            ) : (
              "Daftar Sekarang"
            )}
          </Button>
        </form>
      </Form>

      <p className="mt-6 text-center text-sm text-slate-600">
        Sudah punya akun?{" "}
        <Link href="/login" className="font-semibold text-brand hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}
