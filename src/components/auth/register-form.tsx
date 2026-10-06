"use client";
import { focusNextOnEnter } from "@/lib/form";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, AtSign, Building2, Loader2, Mail, Rocket, ShieldCheck, User } from "lucide-react";
import { AuthShell } from "@/components/auth/auth-shell";
import { PasswordInput, PasswordRules } from "@/components/auth/password-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRegister } from "@/hooks/auth.hook";
import { registerSchema, type RegisterFormValues } from "@/validation/auth.validation";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const FEATURES = [
  { icon: Building2, title: "Your own workspace", desc: "An isolated organization with its own roles and data." },
  { icon: User, title: "Admin from day one", desc: "Configure roles, departments, employees and payroll." },
  { icon: ShieldCheck, title: "Secure by default", desc: "Granular, permission-based access across every page." },
];

const inputClass =
  "h-11 rounded-lg border-[#CBD5E1] bg-white pl-10 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus-visible:border-[#2563EB] focus-visible:ring-2 focus-visible:ring-[#2563EB]/30 dark:border-[#1E293B] dark:bg-[#0B1120] dark:text-white";

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
    defaultValues: { organizationName: "", organizationSlug: "", name: "", email: "", password: "" },
  });

  function handleOrgNameChange(value: string) {
    setValue("organizationName", value);
    if (!slugEdited) setValue("organizationSlug", slugify(value));
  }

  return (
    <AuthShell
      eyebrow="Start your workspace"
      headline={
        <>
          Launch your organization
          <span className="text-[#60A5FA]"> in minutes.</span>
        </>
      }
      subtext="Create your workspace, invite your team, and manage employees, projects and payroll from a single place."
      features={FEATURES}
      alt={{ prompt: "Already have an account?", label: "Sign in", href: "/login" }}
    >
      <div>
        <h1 className="flex items-center gap-2 text-[1.65rem] font-bold tracking-tight text-[#0F172A] dark:text-white">
          <Rocket className="size-5 text-[#2563EB]" />
          Create your organization
        </h1>
        <p className="mt-1.5 text-sm text-[#64748B] dark:text-[#94A3B8]">Set up your workspace and admin account.</p>
      </div>

      <form onKeyDown={focusNextOnEnter} onSubmit={handleSubmit((values) => register.mutate(values))} className="mt-6 space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="organizationName" className="text-xs font-semibold text-[#0F172A] dark:text-white">Organization name</Label>
          <div className="relative">
            <Building2 className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[#94A3B8]" />
            <Input
              id="organizationName"
              placeholder="Acme Corporation"
              {...field("organizationName", { onChange: (e: React.ChangeEvent<HTMLInputElement>) => handleOrgNameChange(e.target.value) })}
              className={inputClass}
            />
          </div>
          {errors.organizationName ? <p className="text-xs font-medium text-[#DC2626]">{errors.organizationName.message}</p> : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="organizationSlug" className="text-xs font-semibold text-[#0F172A] dark:text-white">Workspace slug</Label>
          <div className="relative">
            <AtSign className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[#94A3B8]" />
            <Input
              id="organizationSlug"
              placeholder="acme-corp"
              {...field("organizationSlug", {
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                  setSlugEdited(true);
                  setValue("organizationSlug", e.target.value);
                },
              })}
              className={inputClass}
            />
          </div>
          {errors.organizationSlug ? <p className="text-xs font-medium text-[#DC2626]">{errors.organizationSlug.message}</p> : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-xs font-semibold text-[#0F172A] dark:text-white">Your name</Label>
          <div className="relative">
            <User className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[#94A3B8]" />
            <Input id="name" placeholder="John Doe" {...field("name")} className={inputClass} />
          </div>
          {errors.name ? <p className="text-xs font-medium text-[#DC2626]">{errors.name.message}</p> : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs font-semibold text-[#0F172A] dark:text-white">Work email</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[#94A3B8]" />
            <Input id="email" type="email" placeholder="admin@company.com" {...field("email")} className={inputClass} />
          </div>
          {errors.email ? <p className="text-xs font-medium text-[#DC2626]">{errors.email.message}</p> : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-xs font-semibold text-[#0F172A] dark:text-white">Password</Label>
          <PasswordInput id="password" withIcon placeholder="Min. 8 characters" {...field("password")} />
          {errors.password ? <p className="text-xs font-medium text-[#DC2626]">{errors.password.message}</p> : null}
          {watch("password") ? <PasswordRules value={watch("password")} /> : null}
        </div>

        <Button
          type="submit"
          disabled={register.isPending}
          className="mt-1 h-11 w-full rounded-lg bg-[#2563EB] text-sm font-semibold text-white shadow-[0_10px_24px_-10px_rgba(37,99,235,0.7)] transition-all hover:-translate-y-0.5 hover:bg-[#1D4ED8]"
        >
          {register.isPending ? (
            <><Loader2 className="mr-2 size-4 animate-spin" aria-hidden="true" />Creating workspace...</>
          ) : (
            <span className="inline-flex items-center gap-1.5">Create account<ArrowRight className="size-4" /></span>
          )}
        </Button>
      </form>
    </AuthShell>
  );
}
