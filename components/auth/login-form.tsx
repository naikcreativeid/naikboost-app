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
import { createClient } from "@/lib/supabase/client";

const loginSchema = z.object({
  email: z.string().email("Masukkan email yang valid."),
  password: z.string().min(1, "Password wajib diisi."),
});

type LoginValues = z.infer<typeof loginSchema>;

type LoginFormProps = {
  nextPath?: string;
};

export function LoginForm({ nextPath }: LoginFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginValues) {
    setIsSubmitting(true);
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword(values);

    if (error) {
      setIsSubmitting(false);
      toast.error("Login belum berhasil", {
        description: "Email atau password kamu belum cocok. Coba cek lagi ya.",
      });
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    let destination = nextPath || "/dashboard";

    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      if (profile?.role === "admin") {
        destination = "/admin";
      }
    }

    setIsSubmitting(false);
    toast.success("Login berhasil", {
      description: "Selamat datang kembali di NaikBoost.",
    });
    trackClientEvent("login", { destination });
    router.push(destination);
    router.refresh();
  }

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between gap-4">
                  <FormLabel>Password</FormLabel>
                  <Link
                    href="/forgot-password"
                    className="text-sm font-medium text-brand hover:underline"
                  >
                    Lupa password?
                  </Link>
                </div>
                <FormControl>
                  <Input type="password" placeholder="Masukkan password" {...field} />
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
                Sedang masuk...
              </>
            ) : (
              "Masuk"
            )}
          </Button>
        </form>
      </Form>

      <p className="mt-6 text-center text-sm text-slate-600">
        Belum punya akun?{" "}
        <Link href="/register" className="font-semibold text-brand hover:underline">
          Daftar
        </Link>
      </p>
    </div>
  );
}
