"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PricingPlan {
  id: string;
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  desc: string;
  badge?: string;
  highlight: boolean;
  ctaText: string;
  ctaHref: string;
  features: string[];
  metrics: {
    employees: string;
    departments: string;
    payrollRuns: string;
    rbac: string;
  };
}

const PLANS: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    monthlyPrice: 0,
    annualPrice: 0,
    desc: "Essential workforce coordination for small teams and pilot operations.",
    highlight: false,
    ctaText: "Start free tier",
    ctaHref: "/register",
    features: [
      "Up to 10 active employees",
      "Single department structure",
      "Standard task assignment & status board",
      "Employee self-service console",
      "Community forum & docs access",
      "7-day audit history retention",
    ],
    metrics: {
      employees: "10 workers",
      departments: "1 dept",
      payrollRuns: "Manual only",
      rbac: "Standard 3 roles",
    },
  },
  {
    id: "pro",
    name: "Professional",
    monthlyPrice: 49,
    annualPrice: 39,
    desc: "Full automated dispatch, work proof verification, and one-click Stripe payroll.",
    badge: "Most Selected for Operations",
    highlight: true,
    ctaText: "Start 14-day trial",
    ctaHref: "/register",
    features: [
      "Up to 100 active employees",
      "Unlimited department hierarchies",
      "Automated monthly payroll generation",
      "Deliverable review & approval queue",
      "Stripe payment checkout integration",
      "Full audit logs with actor attribution",
      "Priority email support (< 4h SLA)",
      "CSV & financial ledger export",
    ],
    metrics: {
      employees: "100 workers",
      departments: "Unlimited",
      payrollRuns: "Automated batch",
      rbac: "Standard + Manager",
    },
  },
  {
    id: "enterprise",
    name: "Enterprise",
    monthlyPrice: 199,
    annualPrice: 159,
    desc: "Institutional control with 43-permission custom roles, custom SLAs, and dedicated engineering.",
    badge: "Maximum Governance",
    highlight: false,
    ctaText: "Contact solutions team",
    ctaHref: "/contact",
    features: [
      "Unlimited workforce headcount",
      "Custom role builder (all 43 permissions)",
      "High-density executive analytics suite",
      "Dedicated solutions engineer & account lead",
      "Institutional SLA (99.99% uptime guarantee)",
      "Unlimited audit retention & export",
      "Custom Stripe or corporate invoice billing",
      "24/7 phone & critical emergency dispatch",
    ],
    metrics: {
      employees: "Unlimited",
      departments: "Unlimited",
      payrollRuns: "Real-time & scheduled",
      rbac: "Custom 43-perm matrix",
    },
  },
];

export function PricingCalculator() {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <div className="space-y-12">
      {/* Billing Cadence Toggle */}
      <div className="flex flex-col items-center justify-center gap-3">
        <div className="inline-flex items-center rounded-lg border border-[#E2E8F0] bg-white p-1 shadow-2xs dark:border-[#1E293B] dark:bg-[#0F172A]">
          <button
            type="button"
            onClick={() => setIsAnnual(false)}
            className={`rounded-md px-4 py-1.5 text-xs font-semibold transition-all ${
              !isAnnual
                ? "bg-[#0F172A] text-white shadow-2xs dark:bg-white dark:text-[#0F172A]"
                : "text-[#64748B] hover:text-[#0F172A] dark:text-[#94A3B8] dark:hover:text-white"
            }`}
          >
            Monthly Billing
          </button>
          <button
            type="button"
            onClick={() => setIsAnnual(true)}
            className={`flex items-center gap-2 rounded-md px-4 py-1.5 text-xs font-semibold transition-all ${
              isAnnual
                ? "bg-[#2563EB] text-white shadow-2xs"
                : "text-[#64748B] hover:text-[#0F172A] dark:text-[#94A3B8] dark:hover:text-white"
            }`}
          >
            <span>Annual Billing</span>
            <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold text-white">
              Save 20%
            </span>
          </button>
        </div>
        <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
          Transparent corporate pricing. No setup fees. Switch or cancel whenever needed.
        </p>
      </div>

      {/* Plan Cards */}
      <div className="grid gap-6 lg:grid-cols-3">
        {PLANS.map((plan) => {
          const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;
          return (
            <div
              key={plan.id}
              className={`relative flex flex-col justify-between rounded-lg border bg-white p-6 shadow-xs transition-shadow dark:bg-[#0F172A] ${
                plan.highlight
                  ? "border-[#2563EB] ring-2 ring-[#2563EB]/20 dark:border-[#2563EB]"
                  : "border-[#E2E8F0] hover:border-[#CBD5E1] dark:border-[#1E293B] dark:hover:border-[#334155]"
              }`}
            >
              {plan.badge ? (
                <div className="absolute -top-3 left-6">
                  <span
                    className={`rounded-full px-3 py-0.5 text-[10px] font-bold tracking-wider uppercase ${
                      plan.highlight
                        ? "bg-[#2563EB] text-white"
                        : "bg-[#0F172A] text-white dark:bg-white dark:text-[#0F172A]"
                    }`}
                  >
                    {plan.badge}
                  </span>
                </div>
              ) : null}

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-[#0F172A] dark:text-white">
                    {plan.name}
                  </h3>
                  {plan.highlight ? (
                    <Zap className="size-4 text-[#2563EB]" />
                  ) : (
                    <ShieldCheck className="size-4 text-[#64748B]" />
                  )}
                </div>

                <p className="mt-2 min-h-[36px] text-xs leading-relaxed text-[#64748B] dark:text-[#94A3B8]">
                  {plan.desc}
                </p>

                {/* Price Lockup */}
                <div className="mt-5 border-t border-[#E2E8F0] pt-5 dark:border-[#1E293B]">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl font-extrabold tracking-tight text-[#0F172A] tabular-nums dark:text-white">
                      ${price}
                    </span>
                    <span className="text-xs font-medium text-[#64748B] dark:text-[#94A3B8]">
                      / month {isAnnual && price > 0 ? "(billed annually)" : ""}
                    </span>
                  </div>
                  {isAnnual && price > 0 ? (
                    <p className="mt-1 text-[11px] text-[#16A34A]">
                      Billed as ${price * 12}/year (Save ${(plan.monthlyPrice - plan.annualPrice) * 12}/yr)
                    </p>
                  ) : (
                    <p className="mt-1 text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                      {price === 0 ? "Free tier without expiration" : "Billed on a monthly rolling cycle"}
                    </p>
                  )}
                </div>

                {/* Key Capacity Metrics */}
                <div className="mt-5 grid grid-cols-2 gap-2 rounded-md border border-[#E2E8F0] bg-[#F8FAFC] p-3 text-[11px] dark:border-[#1E293B] dark:bg-[#0B1120]">
                  <div>
                    <span className="text-[#64748B] dark:text-[#94A3B8]">Capacity:</span>
                    <p className="font-semibold text-[#0F172A] dark:text-white">{plan.metrics.employees}</p>
                  </div>
                  <div>
                    <span className="text-[#64748B] dark:text-[#94A3B8]">Hierarchy:</span>
                    <p className="font-semibold text-[#0F172A] dark:text-white">{plan.metrics.departments}</p>
                  </div>
                  <div>
                    <span className="text-[#64748B] dark:text-[#94A3B8]">Payroll:</span>
                    <p className="font-semibold text-[#0F172A] dark:text-white">{plan.metrics.payrollRuns}</p>
                  </div>
                  <div>
                    <span className="text-[#64748B] dark:text-[#94A3B8]">Governance:</span>
                    <p className="font-semibold text-[#0F172A] dark:text-white">{plan.metrics.rbac}</p>
                  </div>
                </div>

                {/* Feature Checklist */}
                <div className="mt-6 space-y-2.5">
                  <p className="text-[11px] font-semibold tracking-wider text-[#0F172A] uppercase dark:text-white">
                    Included Capabilities
                  </p>
                  <ul className="space-y-2">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-xs text-[#334155] dark:text-[#CBD5E1]">
                        <Check className="mt-0.5 size-3.5 shrink-0 text-[#16A34A]" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-8 pt-4">
                <Button
                  asChild
                  className={`h-10 w-full rounded-md text-xs font-semibold shadow-none transition-colors ${
                    plan.highlight
                      ? "bg-[#2563EB] text-white hover:bg-[#1D4ED8]"
                      : "border border-[#CBD5E1] bg-white text-[#0F172A] hover:bg-[#F8FAFC] dark:border-[#1E293B] dark:bg-[#0F172A] dark:text-white"
                  }`}
                  variant={plan.highlight ? "default" : "outline"}
                >
                  <Link href={plan.ctaHref} className="inline-flex items-center justify-center gap-1.5">
                    <span>{plan.ctaText}</span>
                    <ArrowRight className="size-3.5" />
                  </Link>
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
