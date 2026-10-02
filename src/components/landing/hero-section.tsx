import Link from "next/link";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConsolePreview } from "./console-preview";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-[#E2E8F0] bg-white px-4 pt-16 pb-20 sm:px-6 sm:pt-24 sm:pb-28 lg:px-8 dark:border-[#1E293B] dark:bg-[#0F172A]">
      {/* Subtle structural pattern */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,#E2E8F0_1px,transparent_1px),linear-gradient(to_bottom,#E2E8F0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35 dark:bg-[linear-gradient(to_right,#1E293B_1px,transparent_1px),linear-gradient(to_bottom,#1E293B_1px,transparent_1px)] dark:opacity-20" />

      <div className="mx-auto max-w-5xl text-center">
        {/* Release Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[#2563EB]/25 bg-[#EFF6FF] px-3.5 py-1 text-xs font-semibold text-[#2563EB] dark:bg-[#2563EB]/15 dark:text-[#60A5FA]">
          <Sparkles className="size-3.5 shrink-0" />
          <span>EmNex Enterprise 2.4 Active</span>
          <span className="text-[#CBD5E1] dark:text-[#334155]">|</span>
          <span className="font-normal text-[#334155] dark:text-[#CBD5E1]">
            Field Dispatch & Instant Stripe Payroll
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-[#0F172A] sm:text-5xl lg:text-6xl dark:text-white">
          Enterprise workforce & field operations, <br className="hidden sm:inline" />
          <span className="text-[#2563EB]">engineered for absolute control.</span>
        </h1>

        {/* Subheading */}
        <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-[#475569] sm:text-lg dark:text-[#94A3B8]">
          Unified command across departmental hierarchies, multi-stage project dispatch, deliverable
          verification, and automated Stripe payroll. Designed for high-compliance enterprise teams.
        </p>

        {/* CTAs */}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <Button
            asChild
            className="h-11 rounded-md bg-[#2563EB] px-6 text-sm font-semibold text-white shadow-none transition-colors hover:bg-[#1D4ED8]"
          >
            <Link href="/register" className="inline-flex items-center gap-2">
              <span>Deploy enterprise workspace</span>
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-11 rounded-md border-[#CBD5E1] bg-white px-6 text-sm font-semibold text-[#0F172A] hover:bg-[#F8FAFC] dark:border-[#1E293B] dark:bg-[#0F172A] dark:text-white"
          >
            <Link href="/login" className="inline-flex items-center gap-2">
              <span>Launch 1-Click Role Sandbox</span>
              <span className="rounded bg-[#EFF6FF] px-1.5 py-0.5 text-[10px] font-bold text-[#2563EB] dark:bg-[#1E293B] dark:text-[#60A5FA]">
                3 Roles
              </span>
            </Link>
          </Button>
        </div>

        {/* Micro trust notes */}
        <div className="mt-4 flex items-center justify-center gap-4 text-xs text-[#64748B] dark:text-[#94A3B8]">
          <span className="inline-flex items-center gap-1.5">
            <Check className="size-3 text-[#16A34A]" /> No credit card required
          </span>
          <span>&bull;</span>
          <span className="inline-flex items-center gap-1.5">
            <Check className="size-3 text-[#16A34A]" /> Instant pre-seeded accounts
          </span>
          <span>&bull;</span>
          <span className="inline-flex items-center gap-1.5">
            <Check className="size-3 text-[#16A34A]" /> Stripe test mode included
          </span>
        </div>
      </div>

      {/* Simulated Console Preview */}
      <ConsolePreview />
    </section>
  );
}
