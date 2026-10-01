"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ShieldCheck,
  Briefcase,
  UserCheck,
  Loader2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Layers,
  Banknote,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLogin } from "@/hooks/auth.hook";
import { loginSchema, type LoginFormValues } from "@/validation/auth.validation";

const DEMO_ACCOUNTS = [
  {
    role: "ADMIN",
    title: "System Admin",
    subtitle: "Full governance & payroll",
    icon: ShieldCheck,
    email: process.env.NEXT_PUBLIC_DEMO_ADMIN_EMAIL || "admin@emnex.com",
    password: process.env.NEXT_PUBLIC_DEMO_ADMIN_PASSWORD || "EmnexAdmin123!",
    badge: "Admin",
  },
  {
    role: "HR_MANAGER",
    title: "HR Manager",
    subtitle: "Tasks & workforce review",
    icon: Briefcase,
    email: process.env.NEXT_PUBLIC_DEMO_MANAGER_EMAIL || "manager@emnex.com",
    password: process.env.NEXT_PUBLIC_DEMO_MANAGER_PASSWORD || "EmnexManager123!",
    badge: "HR",
  },
  {
    role: "FINANCE_MANAGER",
    title: "Finance Manager",
    subtitle: "Payroll & payments",
    icon: Banknote,
    email: process.env.NEXT_PUBLIC_DEMO_FINANCE_EMAIL || "finance@emnex.com",
    password: process.env.NEXT_PUBLIC_DEMO_FINANCE_PASSWORD || "EmnexFinance123!",
    badge: "Finance",
  },
  {
    role: "EMPLOYEE",
    title: "Field Employee",
    subtitle: "My tasks & payslips",
    icon: UserCheck,
    email: process.env.NEXT_PUBLIC_DEMO_EMPLOYEE_EMAIL || "employee@emnex.com",
    password: process.env.NEXT_PUBLIC_DEMO_EMPLOYEE_PASSWORD || "EmnexEmployee123!",
    badge: "Employee",
  },
];

const PLATFORM_PILLARS = [
  {
    icon: Users,
    title: "Workforce Management",
    desc: "Hierarchical employee directory & department oversight",
  },
  {
    icon: Layers,
    title: "Project & Task Dispatch",
    desc: "Milestone delegations and field proof reviews",
  },
  {
    icon: Banknote,
    title: "Automated Payroll Engine",
    desc: "One-click payroll generation with Stripe settlement",
  },
];

export function LoginForm() {
  const login = useLogin();
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="flex min-h-screen w-full">
      {/* Left Column: Brand & Architecture Panel (Balanced & Corporate) */}
      <div className="relative hidden w-1/2 flex-col justify-between border-r border-[#1E293B] bg-[#0F172A] p-12 text-white lg:flex xl:p-16">
        {/* Subtle grid pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(#FFFFFF 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        />

        {/* Top Header */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="EmNex Logo"
              width={34}
              height={34}
              priority
              className="size-8.5 object-contain"
            />
            <span className="text-2xl font-bold tracking-tight text-white">
              Em<span className="text-[#2563EB]">Nex</span>
            </span>
          </Link>
          <p className="mt-2 text-xs font-medium text-slate-400">
            Workforce & Field Operations SaaS
          </p>
        </div>

        {/* Center: Clean Overview & Feature Card */}
        <div className="relative z-10 max-w-lg space-y-6">
          <div>
            <span className="text-xs font-semibold tracking-wider text-[#2563EB] uppercase">
              Unified Operations
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-white xl:text-4xl">
              Engineered for seamless workforce governance.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              Coordinate field teams, track task milestones, and process payroll with complete
              role-based security and auditability.
            </p>
          </div>

          {/* Clean Functional Feature Card (no exaggerated marketing claims) */}
          <div className="space-y-3 rounded-xl border border-white/10 bg-white/5 p-5">
            {PLATFORM_PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div key={pillar.title} className="flex items-start gap-3">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-[#2563EB]/15 text-[#60A5FA]">
                    <Icon className="size-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">{pillar.title}</p>
                    <p className="text-[11px] text-slate-400">{pillar.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Trust Row */}
        <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-6 text-xs text-slate-400">
          <span>Enterprise Grade RBAC</span>
          <span>•</span>
          <span>256-Bit SSL Encrypted</span>
          <span>•</span>
          <span>Audit Logged</span>
        </div>
      </div>

      {/* Right Column: Sign In Console */}
      <div className="flex w-full flex-col justify-between bg-white px-6 py-10 sm:px-12 lg:w-1/2 lg:px-16 dark:bg-[#0F172A]">
        {/* Top bar with mobile logo & register link */}
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 lg:hidden">
            <Image
              src="/logo.png"
              alt="EmNex Logo"
              width={28}
              height={28}
              className="size-7 object-contain"
            />
            <span className="text-xl font-bold tracking-tight text-[#0F172A] dark:text-white">
              Em<span className="text-[#2563EB]">Nex</span>
            </span>
          </Link>
          <div className="hidden lg:block" />

          <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-[#2563EB] hover:underline dark:text-[#60A5FA]"
            >
              Sign up
            </Link>
          </p>
        </div>

        {/* Centered Form Body */}
        <div className="mx-auto w-full max-w-105 py-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#0F172A] dark:text-white">
              Sign in to your account
            </h1>
            <p className="mt-1 text-sm text-[#64748B] dark:text-[#94A3B8]">
              Select a 1-click role demo or use your credentials
            </p>
          </div>

          {/* 1-Click Role Logins */}
          <div className="mt-6 space-y-2">
            <span className="text-[11px] font-semibold tracking-wider text-[#64748B] uppercase dark:text-[#94A3B8]">
              1-Click Demo Logins
            </span>
            <div className="grid grid-cols-4 gap-2">
              {DEMO_ACCOUNTS.map((account) => {
                const Icon = account.icon;
                const isSelected = activeRole === account.role && login.isPending;
                return (
                  <button
                    key={account.role}
                    type="button"
                    disabled={login.isPending}
                    onClick={() => handleDemoSelect(account)}
                    className={`group flex flex-col items-center gap-1.5 rounded-lg border p-3 text-center transition-all ${
                      isSelected
                        ? "border-[#2563EB] bg-[#EFF6FF] text-[#2563EB] dark:bg-[#1E293B]"
                        : "border-[#E2E8F0] bg-white hover:border-[#2563EB] hover:bg-[#F8FAFC] dark:border-[#1E293B] dark:bg-[#0F172A] dark:hover:bg-[#1E293B]"
                    }`}
                  >
                    <div className="flex size-7 items-center justify-center rounded-md bg-[#EFF6FF] text-[#2563EB] transition-colors group-hover:bg-[#2563EB] group-hover:text-white dark:bg-[#1E293B] dark:text-[#60A5FA]">
                      <Icon className="size-4" />
                    </div>
                    <span className="text-xs font-semibold text-[#0F172A] dark:text-white">
                      {account.badge}
                    </span>
                    <span className="text-[10px] text-[#64748B] dark:text-[#94A3B8]">
                      {account.subtitle}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Divider */}
          <div className="relative my-6 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E2E8F0] dark:border-[#1E293B]" />
            </div>
            <span className="relative bg-white px-2.5 text-xs text-[#64748B] dark:bg-[#0F172A] dark:text-[#94A3B8]">
              or continue with email
            </span>
          </div>

          {/* Credentials Form */}
          <form onSubmit={handleSubmit((values) => login.mutate(values))} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold text-[#0F172A] dark:text-white">
                Work Email
              </Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#94A3B8]" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  {...register("email")}
                  className="h-10 border-[#CBD5E1] bg-white pl-9 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus-visible:border-[#2563EB] focus-visible:ring-1 focus-visible:ring-[#2563EB] dark:border-[#1E293B] dark:bg-[#0B1120] dark:text-white"
                />
              </div>
              {errors.email ? (
                <p className="text-xs font-medium text-[#DC2626]">{errors.email.message}</p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-semibold text-[#0F172A] dark:text-white">
                  Password
                </Label>
                <Link
                  href="/contact"
                  className="text-xs font-medium text-[#2563EB] hover:underline dark:text-[#60A5FA]"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#94A3B8]" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  {...register("password")}
                  className="h-10 border-[#CBD5E1] bg-white pr-10 pl-9 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus-visible:border-[#2563EB] focus-visible:ring-1 focus-visible:ring-[#2563EB] dark:border-[#1E293B] dark:bg-[#0B1120] dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {errors.password ? (
                <p className="text-xs font-medium text-[#DC2626]">{errors.password.message}</p>
              ) : null}
            </div>

            <Button
              type="submit"
              className="mt-2 h-10.5 w-full rounded-md bg-[#2563EB] text-sm font-semibold text-white shadow-none transition-colors hover:bg-[#1D4ED8]"
              disabled={login.isPending}
            >
              {login.isPending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" aria-hidden="true" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span className="inline-flex items-center gap-1.5">
                  <span>Sign in</span>
                  <ArrowRight className="size-4" />
                </span>
              )}
            </Button>
          </form>
        </div>

        {/* Footer info */}
        <div className="flex flex-col items-center justify-between gap-2 border-t border-[#E2E8F0] pt-6 text-xs text-[#64748B] sm:flex-row dark:border-[#1E293B] dark:text-[#94A3B8]">
          <p>© {new Date().getFullYear()} EmNex Technologies Inc.</p>
          <div className="flex items-center gap-4">
            <Link href="/about" className="hover:underline">
              About
            </Link>
            <Link href="/contact" className="hover:underline">
              Support
            </Link>
            <Link href="/pricing#faq" className="hover:underline">
              FAQ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
