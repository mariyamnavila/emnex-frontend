import Link from "next/link";
import {
  Users,
  Layers,
  Banknote,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const ARCHITECTURAL_ENGINES = [
  {
    icon: Users,
    badge: "Engine 01",
    title: "Workforce & Organization Hierarchy",
    desc: "Centralized multi-department structure, employee lifecycle states (Active, Probation, Suspended), role assignments, and secure credential provisioning.",
    highlights: [
      "Departmental budget & headcount caps",
      "Instant temporary credential issuance",
      "Employee lifecycle state management",
    ],
  },
  {
    icon: Layers,
    badge: "Engine 02",
    title: "Field Project Dispatch & Deliverables",
    desc: "Multi-stage project tracking, task prioritization, due-date forecasting, and proof-of-work submission pipelines with manager review checkpoints.",
    highlights: [
      "Low, Medium, High & Urgent prioritization",
      "Deliverable work proofs & hours logging",
      "Manager approve, reject, or request revisions",
    ],
  },
  {
    icon: Banknote,
    badge: "Engine 03",
    title: "Algorithmic Payroll & Stripe Settlement",
    desc: "Single-click payroll batch runs calculating gross salaries, deductions, and net payouts. Integrated Stripe Checkout transfers and auditable payslips.",
    highlights: [
      "Precision tabular-num ledger calculations",
      "Test & production Stripe payment pipelines",
      "Direct employee payslip transparency",
    ],
  },
  {
    icon: ShieldCheck,
    badge: "Engine 04",
    title: "Institutional RBAC & Audit Trails",
    desc: "44 granular permissions mapped across 4 corporate default tiers plus unlimited custom roles. Immutable audit logs tracking all actions across the system.",
    highlights: [
      "Full API & middleware route enforcement",
      "Custom organization role builder",
      "Comprehensive actor attribution logging",
    ],
  },
];

export function CoreEngines() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold tracking-wider text-[#2563EB] uppercase">
            System Architecture
          </span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#0F172A] dark:text-white">
            The Four Core Engines of EmNex
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#64748B] dark:text-[#94A3B8]">
            Engineered from first principles to eliminate data fragmentation between human resources,
            project supervisors, and financial settlement teams.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ARCHITECTURAL_ENGINES.map((engine) => {
            const Icon = engine.icon;
            return (
              <div
                key={engine.title}
                className="flex flex-col justify-between rounded-lg border border-[#E2E8F0] bg-white p-6 shadow-2xs dark:border-[#1E293B] dark:bg-[#0F172A]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex size-10 items-center justify-center rounded-md bg-[#EFF6FF] text-[#2563EB] dark:bg-[#1E293B] dark:text-[#60A5FA]">
                      <Icon className="size-5" />
                    </div>
                    <span className="rounded bg-[#F1F5F9] px-2 py-0.5 font-mono text-[10px] font-bold text-[#475569] dark:bg-[#1E293B] dark:text-[#94A3B8]">
                      {engine.badge}
                    </span>
                  </div>

                  <h3 className="mt-5 text-base font-bold text-[#0F172A] dark:text-white">
                    {engine.title}
                  </h3>

                  <p className="mt-2 text-xs leading-relaxed text-[#64748B] dark:text-[#94A3B8]">
                    {engine.desc}
                  </p>
                </div>

                <ul className="mt-6 space-y-2 border-t border-[#E2E8F0] pt-4 dark:border-[#1E293B]">
                  {engine.highlights.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-[11px] text-[#334155] dark:text-[#CBD5E1]"
                    >
                      <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-[#16A34A]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="border-[#CBD5E1] bg-white text-xs font-semibold text-[#0F172A] hover:bg-[#F8FAFC] dark:border-[#1E293B] dark:bg-[#0F172A] dark:text-white"
          >
            <Link href="/features" className="inline-flex items-center gap-1.5">
              <span>Inspect all 8 domain modules</span>
              <ChevronRight className="size-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
