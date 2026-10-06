"use client";
import { focusNextOnEnter } from "@/lib/form";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Banknote, Briefcase, Layers, Loader2, Mail, ShieldCheck, UserCheck, Users } from "lucide-react";
import { AuthShell } from "@/components/auth/auth-shell";
import { GoogleSignInButton } from "@/components/auth/google-sign-in";
import { PasswordInput } from "@/components/auth/password-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLogin } from "@/hooks/auth.hook";
import { loginSchema, type LoginFormValues } from "@/validation/auth.validation";

const DEMO_ACCOUNTS = [
  { role: "ADMIN", label: "Admin", subtitle: "Full governance", icon: ShieldCheck, email: process.env.NEXT_PUBLIC_DEMO_ADMIN_EMAIL || "admin@emnex.com", password: process.env.NEXT_PUBLIC_DEMO_ADMIN_PASSWORD || "EmnexAdmin123!" },
  { role: "HR_MANAGER", label: "HR", subtitle: "Workforce", icon: Briefcase, email: process.env.NEXT_PUBLIC_DEMO_MANAGER_EMAIL || "manager@emnex.com", password: process.env.NEXT_PUBLIC_DEMO_MANAGER_PASSWORD || "EmnexManager123!" },
  { role: "FINANCE_MANAGER", label: "Finance", subtitle: "Payroll", icon: Banknote, email: process.env.NEXT_PUBLIC_DEMO_FINANCE_EMAIL || "finance@emnex.com", password: process.env.NEXT_PUBLIC_DEMO_FINANCE_PASSWORD || "EmnexFinance123!" },
  { role: "EMPLOYEE", label: "Employee", subtitle: "My work", icon: UserCheck, email: process.env.NEXT_PUBLIC_DEMO_EMPLOYEE_EMAIL || "employee@emnex.com", password: process.env.NEXT_PUBLIC_DEMO_EMPLOYEE_PASSWORD || "EmnexEmployee123!" },
];

const FEATURES = [
  { icon: Users, title: "Workforce management", desc: "Employee directory, departments and role-based access." },
  { icon: Layers, title: "Projects & task dispatch", desc: "Assign work, track progress and review logged hours." },
  { icon: Banknote, title: "Automated payroll", desc: "Generate pay from approved hours and settle via Stripe." },
];

const inputClass =
  "h-11 rounded-lg border-[#CBD5E1] bg-white pl-10 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus-visible:border-[#2563EB] focus-visible:ring-2 focus-visible:ring-[#2563EB]/30 dark:border-[#1E293B] dark:bg-[#0B1120] dark:text-white";

export function LoginForm() {
  const login = useLogin();
  const [activeRole, setActiveRole] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  function handleDemoSelect(account: (typeof DEMO_ACCOUNTS)[number]) {
    setActiveRole(account.role);
    setValue("email", account.email, { shouldValidate: true });
    setValue("password", account.password, { shouldValidate: true });
    login.mutate({ email: account.email, password: account.password });
  }

  return (
    <AuthShell
      eyebrow="Unified operations"
      headline={
        <>
          Everything your team runs on,
          <span className="text-[#60A5FA]"> in one secure place.</span>
        </>
      }
      subtext="Coordinate field teams, track task milestones and process payroll — with complete role-based security and auditability."
      features={FEATURES}
      alt={{ prompt: "New to EmNex?", label: "Create an account", href: "/register" }}
    >
      <div>
        <h1 className="text-[1.65rem] font-bold tracking-tight text-[#0F172A] dark:text-white">Welcome back</h1>
        <p className="mt-1.5 text-sm text-[#64748B] dark:text-[#94A3B8]">
          Pick a one-click demo role, or sign in with your credentials.
        </p>
      </div>

      {/* One-click demo logins */}
      <div className="mt-6">
        <span className="text-[11px] font-semibold tracking-wider text-[#94A3B8] uppercase">One-click demo</span>
        <div className="mt-2 grid grid-cols-2 gap-2.5">
          {DEMO_ACCOUNTS.map((account) => {
            const Icon = account.icon;
            const isLoading = activeRole === account.role && login.isPending;
            return (
              <button
                key={account.role}
                type="button"
                disabled={login.isPending}
                onClick={() => handleDemoSelect(account)}
                className={`group flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-60 ${
                  isLoading
                    ? "border-[#2563EB] bg-[#EFF6FF] dark:bg-[#1E293B]"
                    : "border-[#E2E8F0] bg-white hover:border-[#93C5FD] hover:shadow-[0_8px_20px_-10px_rgba(37,99,235,0.5)] dark:border-[#1E293B] dark:bg-[#0F172A] dark:hover:bg-[#1E293B]"
                }`}
              >
                <span className="flex size-8 items-center justify-center rounded-lg bg-[#EFF6FF] text-[#2563EB] transition-colors group-hover:bg-[#2563EB] group-hover:text-white dark:bg-[#1E293B] dark:text-[#60A5FA]">
                  {isLoading ? <Loader2 className="size-4 animate-spin" /> : <Icon className="size-4" />}
                </span>
                <span className="text-xs font-semibold text-[#0F172A] dark:text-white">{account.label}</span>
                <span className="text-[10px] text-[#64748B] dark:text-[#94A3B8]">{account.subtitle}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4">
        <GoogleSignInButton />
      </div>

      <div className="relative my-6 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#E2E8F0] dark:border-[#1E293B]" />
        </div>
        <span className="relative bg-white px-3 text-xs text-[#94A3B8] dark:bg-[#0F172A]">or continue with email</span>
      </div>

      <form onKeyDown={focusNextOnEnter} onSubmit={handleSubmit((values) => login.mutate(values))} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs font-semibold text-[#0F172A] dark:text-white">Work email</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[#94A3B8]" />
            <Input id="email" type="email" placeholder="name@company.com" {...register("email")} className={inputClass} />
          </div>
          {errors.email ? <p className="text-xs font-medium text-[#DC2626]">{errors.email.message}</p> : null}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-xs font-semibold text-[#0F172A] dark:text-white">Password</Label>
            <Link href="/contact" className="text-xs font-medium text-[#2563EB] hover:underline dark:text-[#60A5FA]">Forgot?</Link>
          </div>
          <PasswordInput id="password" withIcon placeholder="••••••••••••" {...register("password")} />
          {errors.password ? <p className="text-xs font-medium text-[#DC2626]">{errors.password.message}</p> : null}
        </div>

        <Button
          type="submit"
          disabled={login.isPending}
          className="mt-1 h-11 w-full rounded-lg bg-[#2563EB] text-sm font-semibold text-white shadow-[0_10px_24px_-10px_rgba(37,99,235,0.7)] transition-all hover:-translate-y-0.5 hover:bg-[#1D4ED8]"
        >
          {login.isPending ? (
            <><Loader2 className="mr-2 size-4 animate-spin" aria-hidden="true" />Signing in...</>
          ) : (
            <span className="inline-flex items-center gap-1.5">Sign in<ArrowRight className="size-4" /></span>
          )}
        </Button>
      </form>
    </AuthShell>
  );
}
