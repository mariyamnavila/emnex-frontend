import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Users,
  Layers,
  Banknote,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const STATS = [
  { label: "Active Field Operations", value: "14,800+" },
  { label: "Automated Monthly Payroll", value: "$18.4M" },
  { label: "System SLA Reliability", value: "99.99%" },
  { label: "Granular RBAC Permissions", value: "40+" },
];

const MODULES = [
  {
    icon: Users,
    title: "Workforce & Team Directory",
    desc: "Centralized employee profiles, departmental hierarchies, credential management, and role-based assignments.",
  },
  {
    icon: Layers,
    title: "Project & Milestone Tracking",
    desc: "Multi-stage project workflows, task delegations, priority controls, and real-time field progress reporting.",
  },
  {
    icon: Banknote,
    title: "Automated Enterprise Payroll",
    desc: "Generate, review, and approve payroll runs with precision salary calculations, audit logs, and Stripe settlement.",
  },
  {
    icon: ShieldCheck,
    title: "Institutional RBAC Security",
    desc: "Rigorous 3-tier authorization model distinguishing Executive Admins, Operational Managers, and Field Employees.",
  },
];

const ROLES = [
  {
    role: "Executive Admin",
    badge: "Full Governance",
    tone: "bg-[#0F172A] text-white",
    desc: "Complete operational visibility over organizational units, cross-department analytics, budget health, and payroll sign-offs.",
    features: ["All 40 system permissions", "Payroll generation & approval", "Department & role administration"],
  },
  {
    role: "Operations Manager",
    badge: "Field Dispatch",
    tone: "bg-[#2563EB] text-white",
    desc: "Assign projects, monitor employee task status, review deliverable submissions, and oversee shift execution.",
    features: ["Project assignment & tracking", "Task review & approvals", "Department performance metrics"],
  },
  {
    role: "Field Employee",
    badge: "Specialist Console",
    tone: "bg-[#64748B] text-white",
    desc: "Access daily task pipelines, submit completion proofs, log field hours, and track verified payslips transparently.",
    features: ["My assigned tasks pipeline", "Work proof submissions", "Personal payroll history"],
  },
];

export default function Home() {
  return (
    <div className="flex flex-col bg-[#F8FAFC] dark:bg-[#0B1120]">
      {/* Hero Section */}
      <section className="relative border-b border-[#E2E8F0] bg-white px-4 py-20 sm:px-6 sm:py-28 lg:px-8 dark:border-[#1E293B] dark:bg-[#0F172A]">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#2563EB]/20 bg-[#EFF6FF] px-3.5 py-1 text-xs font-semibold text-[#2563EB] dark:bg-[#2563EB]/10 dark:text-[#60A5FA]">
            <Lock className="size-3" />
            <span>Institutional Workforce & Field Management</span>
          </div>

          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-[#0F172A] sm:text-5xl lg:text-6xl dark:text-white">
            Enterprise operations, <br className="hidden sm:inline" />
            <span className="text-[#2563EB]">engineered for scale.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base text-[#64748B] sm:text-lg dark:text-[#94A3B8]">
            Unified command across employee directories, field project delivery, deliverable approvals,
            and automated payroll. Built for high-compliance enterprise teams.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Button
              asChild
              className="h-11 rounded-md bg-[#2563EB] px-6 text-sm font-semibold text-white shadow-none transition-colors hover:bg-[#1D4ED8]"
            >
              <Link href="/register" className="inline-flex items-center gap-2">
                <span>Start enterprise trial</span>
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-11 rounded-md border-[#CBD5E1] bg-white px-6 text-sm font-semibold text-[#0F172A] hover:bg-[#F8FAFC] dark:border-[#1E293B] dark:bg-[#0F172A] dark:text-white"
            >
              <Link href="/login">Launch 1-Click Demo</Link>
            </Button>
          </div>
        </div>

        {/* Corporate KPI / Stats Ribbon */}
        <div className="mx-auto mt-16 max-w-5xl">
          <div className="grid grid-cols-2 gap-4 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-6 lg:grid-cols-4 dark:border-[#1E293B] dark:bg-[#0B1120]">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center sm:text-left">
                <p className="text-2xl font-bold tracking-tight text-[#0F172A] tabular-nums sm:text-3xl dark:text-white">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs font-semibold tracking-wider text-[#64748B] uppercase dark:text-[#94A3B8]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Enterprise Modules */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold tracking-wider text-[#2563EB] uppercase">
              Core Architecture
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#0F172A] dark:text-white">
              Engineered for absolute operational clarity
            </h2>
            <p className="mt-3 text-sm text-[#64748B] dark:text-[#94A3B8]">
              No fragmented spreadsheets or siloed tools. A single system of record for workforce management.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {MODULES.map((m) => {
              const Icon = m.icon;
              return (
                <div
                  key={m.title}
                  className="flex flex-col justify-between rounded-lg border border-[#E2E8F0] bg-white p-6 shadow-2xs dark:border-[#1E293B] dark:bg-[#0F172A]"
                >
                  <div>
                    <div className="flex size-10 items-center justify-center rounded-md bg-[#EFF6FF] text-[#2563EB] dark:bg-[#1E293B] dark:text-[#3B82F6]">
                      <Icon className="size-5" />
                    </div>
                    <h3 className="mt-4 text-base font-semibold text-[#0F172A] dark:text-white">
                      {m.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-[#64748B] dark:text-[#94A3B8]">
                      {m.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3 Tier Role Workflows */}
      <section className="border-t border-[#E2E8F0] bg-white px-4 py-20 sm:px-6 lg:px-8 dark:border-[#1E293B] dark:bg-[#0F172A]">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <span className="text-xs font-semibold tracking-wider text-[#2563EB] uppercase">
              Role-Based Governance
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#0F172A] dark:text-white">
              Three distinct corporate workspaces
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-[#64748B] dark:text-[#94A3B8]">
              Tailored interfaces ensuring each persona executes workflows with zero friction.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {ROLES.map((r) => (
              <div
                key={r.role}
                className="flex flex-col justify-between rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-6 shadow-2xs dark:border-[#1E293B] dark:bg-[#0B1120]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-[#0F172A] dark:text-white">{r.role}</span>
                    <span className={`rounded px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase ${r.tone}`}>
                      {r.badge}
                    </span>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-[#64748B] dark:text-[#94A3B8]">
                    {r.desc}
                  </p>

                  <ul className="mt-6 space-y-2 border-t border-[#E2E8F0] pt-4 dark:border-[#1E293B]">
                    {r.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-xs text-[#334155] dark:text-[#CBD5E1]">
                        <CheckCircle2 className="size-3.5 text-[#16A34A]" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-4">
                  <Button
                    asChild
                    variant="outline"
                    className="w-full justify-center border-[#CBD5E1] bg-white text-xs font-semibold text-[#0F172A] hover:bg-[#F8FAFC] dark:border-[#1E293B] dark:bg-[#0F172A] dark:text-white"
                  >
                    <Link href="/login" className="inline-flex items-center gap-1.5">
                      <span>Test {r.role} view</span>
                      <ArrowRight className="size-3" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-[#E2E8F0] bg-[#F8FAFC] px-4 py-16 sm:px-6 lg:px-8 dark:border-[#1E293B] dark:bg-[#0B1120]">
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-6 rounded-xl border border-[#E2E8F0] bg-white p-8 text-center sm:flex-row sm:text-left dark:border-[#1E293B] dark:bg-[#0F172A]">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-[#0F172A] dark:text-white">
              Ready to modernize your field operations?
            </h3>
            <p className="mt-1 text-sm text-[#64748B] dark:text-[#94A3B8]">
              Deploy the EmNex platform or log in with instant role credentials.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <Button
              asChild
              className="h-10 bg-[#2563EB] px-5 text-xs font-semibold text-white shadow-none transition-colors hover:bg-[#1D4ED8]"
            >
              <Link href="/register">Get started now</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
