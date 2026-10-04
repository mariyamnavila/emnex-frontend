"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Loader2,
  Mail,
  ArrowRight,
  Building2,
  User,
  AtSign,
} from "lucide-react";
import { PasswordInput, PasswordRules } from "@/components/auth/password-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRegister } from "@/hooks/auth.hook";
import {
  registerSchema,
  type RegisterFormValues,
} from "@/validation/auth.validation";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function RegisterForm() {
  const register = useRegister();
  const [slugEdited, setSlugEdited] = useState(false);

  const {
    register: field,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      organizationName: "",
      organizationSlug: "",
      name: "",
      email: "",
      password: "",
    },
  });

  function handleOrgNameChange(value: string) {
    setValue("organizationName", value);
    if (!slugEdited) {
      setValue("organizationSlug", slugify(value));
    }
  }

  return (
    <div className="flex min-h-screen w-full">
      {/* Left Column: Brand Panel */}
      <div className="relative hidden w-1/2 flex-col justify-between border-r border-[#1E293B] bg-[#0F172A] p-12 text-white lg:flex xl:p-16">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(#FFFFFF 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        />

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

        <div className="relative z-10 max-w-lg space-y-6">
          <div>
            <span className="text-xs font-semibold tracking-wider text-[#2563EB] uppercase">
              Start Your Workspace
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-white xl:text-4xl">
              Set up your organization in minutes.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              Create your workspace, invite your team, and start managing
              employees, projects, and payroll from one place.
            </p>
          </div>

          <div className="space-y-4 rounded-xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-start gap-3">
              <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-[#2563EB]/15 text-[#60A5FA]">
                <Building2 className="size-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">
                  Your own workspace
                </p>
                <p className="text-[11px] text-slate-400">
                  Isolated organization with its own roles and data
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-[#2563EB]/15 text-[#60A5FA]">
                <User className="size-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">
                  Admin from day one
                </p>
                <p className="text-[11px] text-slate-400">
                  Full access to configure roles, departments, and payroll
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-6 text-xs text-slate-400">
          <span>Enterprise Grade RBAC</span>
          <span>•</span>
          <span>256-Bit SSL Encrypted</span>
          <span>•</span>
          <span>Audit Logged</span>
        </div>
      </div>

      {/* Right Column: Register Form */}
      <div className="flex w-full flex-col justify-between bg-white px-6 py-10 sm:px-12 lg:w-1/2 lg:px-16 dark:bg-[#0F172A]">
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
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-[#2563EB] hover:underline dark:text-[#60A5FA]"
            >
              Sign in
            </Link>
          </p>
        </div>

        <div className="mx-auto w-full max-w-105 py-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#0F172A] dark:text-white">
              Create your organization
            </h1>
            <p className="mt-1 text-sm text-[#64748B] dark:text-[#94A3B8]">
              Set up your workspace and admin account
            </p>
          </div>

          <form
            onSubmit={handleSubmit((values) => register.mutate(values))}
            className="mt-6 space-y-4"
          >
            <div className="space-y-1.5">
              <Label
                htmlFor="organizationName"
                className="text-xs font-semibold text-[#0F172A] dark:text-white"
              >
                Organization Name
              </Label>
              <div className="relative">
                <Building2 className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#94A3B8]" />
                <Input
                  id="organizationName"
                  type="text"
                  placeholder="Acme Corporation"
                  {...field("organizationName", {
                    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                      handleOrgNameChange(e.target.value),
                  })}
                  className="h-10 border-[#CBD5E1] bg-white pl-9 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus-visible:border-[#2563EB] focus-visible:ring-1 focus-visible:ring-[#2563EB] dark:border-[#1E293B] dark:bg-[#0B1120] dark:text-white"
                />
              </div>
              {errors.organizationName ? (
                <p className="text-xs font-medium text-[#DC2626]">
                  {errors.organizationName.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="organizationSlug"
                className="text-xs font-semibold text-[#0F172A] dark:text-white"
              >
                Workspace Slug
              </Label>
              <div className="relative">
                <AtSign className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#94A3B8]" />
                <Input
                  id="organizationSlug"
                  type="text"
                  placeholder="acme-corp"
                  {...field("organizationSlug", {
                    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                      setSlugEdited(true);
                      setValue("organizationSlug", e.target.value);
                    },
                  })}
                  className="h-10 border-[#CBD5E1] bg-white pl-9 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus-visible:border-[#2563EB] focus-visible:ring-1 focus-visible:ring-[#2563EB] dark:border-[#1E293B] dark:bg-[#0B1120] dark:text-white"
                />
              </div>
              {errors.organizationSlug ? (
                <p className="text-xs font-medium text-[#DC2626]">
                  {errors.organizationSlug.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="name"
                className="text-xs font-semibold text-[#0F172A] dark:text-white"
              >
                Your Name
              </Label>
              <div className="relative">
                <User className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#94A3B8]" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  {...field("name")}
                  className="h-10 border-[#CBD5E1] bg-white pl-9 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus-visible:border-[#2563EB] focus-visible:ring-1 focus-visible:ring-[#2563EB] dark:border-[#1E293B] dark:bg-[#0B1120] dark:text-white"
                />
              </div>
              {errors.name ? (
                <p className="text-xs font-medium text-[#DC2626]">
                  {errors.name.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="email"
                className="text-xs font-semibold text-[#0F172A] dark:text-white"
              >
                Work Email
              </Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#94A3B8]" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@company.com"
                  {...field("email")}
                  className="h-10 border-[#CBD5E1] bg-white pl-9 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus-visible:border-[#2563EB] focus-visible:ring-1 focus-visible:ring-[#2563EB] dark:border-[#1E293B] dark:bg-[#0B1120] dark:text-white"
                />
              </div>
              {errors.email ? (
                <p className="text-xs font-medium text-[#DC2626]">
                  {errors.email.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="password"
                className="text-xs font-semibold text-[#0F172A] dark:text-white"
              >
                Password
              </Label>
              <PasswordInput id="password" withIcon placeholder="Min. 8 characters" {...field("password")} />
              {errors.password ? (
                <p className="text-xs font-medium text-[#DC2626]">
                  {errors.password.message}
                </p>
              ) : null}
              {watch("password") ? <PasswordRules value={watch("password")} /> : null}
            </div>

            <Button
              type="submit"
              className="mt-2 h-10.5 w-full rounded-md bg-[#2563EB] text-sm font-semibold text-white shadow-none transition-colors hover:bg-[#1D4ED8]"
              disabled={register.isPending}
            >
              {register.isPending ? (
                <>
                  <Loader2
                    className="mr-2 size-4 animate-spin"
                    aria-hidden="true"
                  />
                  <span>Creating workspace...</span>
                </>
              ) : (
                <span className="inline-flex items-center gap-1.5">
                  <span>Create account</span>
                  <ArrowRight className="size-4" />
                </span>
              )}
            </Button>
          </form>
        </div>

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
