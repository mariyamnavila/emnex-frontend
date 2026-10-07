import type { Metadata } from "next";
import Link from "next/link";
import {
  Target,
  Eye,
  HeartHandshake,
  Users,
  Shield,
  Zap,
  CheckCircle2,
  Lock,
  Sparkles,
  ArrowRight,
  Cpu,
  Server,
  Database,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About EmNex | Enterprise Mission, Architecture & Leadership",
  description:
    "Learn about EmNex: our mission to eliminate operational fragmentation for distributed field workforces, our engineering principles, and our leadership.",
  openGraph: {
    title: "About EmNex Enterprise",
    description:
      "A unified system of record for workforce management, project delivery, deliverable approvals, and automated Stripe payroll.",
    type: "website",
  },
};

const PRINCIPLES = [
  {
    icon: Shield,
    title: "Defense-Grade Security",
    desc: "Permission checking is enforced at the database query and API controller boundary, not merely masked in the UI. 44 permissions govern every possible mutation.",
  },
  {
    icon: Zap,
    title: "High-Throughput Velocity",
    desc: "From employee onboarding to batch payroll approvals, workflows are engineered to minimize click fatigue and maximize operational throughput.",
  },
  {
    icon: Target,
    title: "Mathematical Precision",
    desc: "No floating point rounding errors in payroll calculations. Monospace tabular numbers ensure complete financial alignment across all ledgers.",
  },
  {
    icon: HeartHandshake,
    title: "Frontline Transparency",
    desc: "Field employees should never have to ask where their pay stands. Real-time deliverable statuses, submission notes, and self-service payslips build trust.",
  },
];

const ARCHITECTURE_PILLARS = [
  {
    icon: Server,
    title: "Next.js 16 App Router",
    desc: "Leveraging React Server Components for maximum SEO, streaming performance, and strict client/server boundary separation.",
  },
  {
    icon: Database,
    title: "Relational ACID Persistence",
    desc: "Strict foreign key relations and transactional atomicity ensuring payroll batches and deliverable audits never diverge.",
  },
  {
    icon: Cpu,
    title: "Stripe Payment Orchestration",
    desc: "Direct integration with Stripe Checkout infrastructure, handling asynchronous webhooks and transaction settlement.",
  },
  {
    icon: Lock,
    title: "44-Permission RBAC Matrix",
    desc: "Fine-grained capability evaluation across Executive Admins, Field Managers, Finance Officers, and Field Specialists.",
  },
];

const LEADERSHIP = [
  {
    name: "Alexandria Vance",
    role: "Chief Executive Officer & Co-Founder",
    bio: "Former VP of Field Operations with 15+ years orchestrating industrial infrastructure networks across North America and EMEA.",
  },
  {
    name: "David Chen, Ph.D.",
    role: "Chief Technology Officer",
    bio: "Distributed systems architect previously leading high-concurrency payment streaming and compliance infrastructure.",
  },
  {
    name: "Sarah Sterling",
    role: "Head of Product & Design",
    bio: "Specializes in high-density enterprise SaaS interfaces, reducing cognitive load for complex administrative and field operations.",
  },
  {
    name: "Marcus Holloway",
    role: "Director of Security & Compliance",
    bio: "Information security veteran overseeing SOC 2 Type II controls, cryptographic key isolation, and immutable audit architectures.",
  },
];

const MILESTONES = [
  {
    year: "2024",
    title: "Platform Conception",
    desc: "Engineered from scratch to solve severe data silos between contractor dispatching and fragmented end-of-month payroll.",
  },
  {
    year: "2025",
    title: "44-Permission RBAC & Stripe Engine",
    desc: "Rolled out granular permission masking, multi-stage deliverable approvals, and integrated Stripe Checkout settlement pipelines.",
  },
  {
    year: "2026",
    title: "Enterprise Multi-Department Scale",
    desc: "Surpassed 14,000+ monthly field dispatches and $18M+ in automated monthly payroll disbursements with 99.99% uptime.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-[#F8FAFC] dark:bg-[#0B1120]">
      {/* 1. Header */}
      <section className="relative overflow-hidden border-b border-[#E2E8F0] bg-white px-4 py-16 sm:px-6 sm:py-24 lg:px-8 dark:border-[#1E293B] dark:bg-[#0F172A]">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#2563EB]/25 bg-[#EFF6FF] px-3.5 py-1 text-xs font-semibold text-[#2563EB] dark:bg-[#2563EB]/15 dark:text-[#60A5FA]">
            <Sparkles className="size-3.5" />
            <span>Enterprise Identity & Mission</span>
          </div>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[#0F172A] sm:text-4xl lg:text-5xl dark:text-white">
            Unifying Workforce Dispatch & <br className="hidden sm:inline" />
            <span className="text-[#2563EB]">Financial Operations at Scale</span>
          </h1>

          <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-[#475569] sm:text-base dark:text-[#94A3B8]">
            EmNex was created to solve an endemic corporate failure: the disconnect between human resources,
            frontline operations dispatch, and payroll disbursement. We replace fragile spreadsheets and disjointed tools
            with an authoritative, audited system of record.
          </p>
        </div>
      </section>

      {/* 2. Mission & Vision Dual Card */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-[#E2E8F0] bg-white p-8 shadow-2xs dark:border-[#1E293B] dark:bg-[#0F172A]">
            <div className="flex size-11 items-center justify-center rounded-md bg-[#EFF6FF] text-[#2563EB] dark:bg-[#1E293B] dark:text-[#60A5FA]">
              <Target className="size-5" />
            </div>
            <h2 className="mt-5 text-xl font-bold text-[#0F172A] dark:text-white">
              Our Core Mission
            </h2>
            <p className="mt-3 text-xs leading-relaxed text-[#475569] sm:text-sm dark:text-[#94A3B8]">
              Empower operations executives, managers, and frontline specialists with an unified
              platform where workforce scheduling, deliverable verification, and payroll calculation execute
              with mathematical precision and zero data leakage.
            </p>
            <ul className="mt-6 space-y-2 border-t border-[#E2E8F0] pt-4 dark:border-[#1E293B]">
              <li className="flex items-center gap-2 text-xs text-[#334155] dark:text-[#CBD5E1]">
                <CheckCircle2 className="size-3.5 text-[#16A34A]" />
                <span>Eliminate monthly payroll reconciliation delays</span>
              </li>
              <li className="flex items-center gap-2 text-xs text-[#334155] dark:text-[#CBD5E1]">
                <CheckCircle2 className="size-3.5 text-[#16A34A]" />
                <span>Provide audit-proof proof-of-work workflows</span>
              </li>
            </ul>
          </div>

          <div className="rounded-lg border border-[#E2E8F0] bg-white p-8 shadow-2xs dark:border-[#1E293B] dark:bg-[#0F172A]">
            <div className="flex size-11 items-center justify-center rounded-md bg-[#EFF6FF] text-[#2563EB] dark:bg-[#1E293B] dark:text-[#60A5FA]">
              <Eye className="size-5" />
            </div>
            <h2 className="mt-5 text-xl font-bold text-[#0F172A] dark:text-white">
              Our Operational Vision
            </h2>
            <p className="mt-3 text-xs leading-relaxed text-[#475569] sm:text-sm dark:text-[#94A3B8]">
              A future where field operations and workforce management run continuously in real time.
              Managers approve deliverables from any device, payroll runs with single-click certainty,
              and compliance audits pass without friction.
            </p>
            <ul className="mt-6 space-y-2 border-t border-[#E2E8F0] pt-4 dark:border-[#1E293B]">
              <li className="flex items-center gap-2 text-xs text-[#334155] dark:text-[#CBD5E1]">
                <CheckCircle2 className="size-3.5 text-[#16A34A]" />
                <span>Instantaneous Stripe payout reconciliation</span>
              </li>
              <li className="flex items-center gap-2 text-xs text-[#334155] dark:text-[#CBD5E1]">
                <CheckCircle2 className="size-3.5 text-[#16A34A]" />
                <span>Zero administrative confusion across corporate roles</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 3. Architectural Principles */}
      <section className="border-t border-[#E2E8F0] bg-white px-4 py-20 sm:px-6 lg:px-8 dark:border-[#1E293B] dark:bg-[#0F172A]">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <span className="text-xs font-semibold tracking-wider text-[#2563EB] uppercase">
              Engineering Disciplines
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#0F172A] dark:text-white">
              The Principles That Drive EmNex
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-[#64748B] dark:text-[#94A3B8]">
              We adhere to strict enterprise software standards rather than consumer shortcuts.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PRINCIPLES.map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.title}
                  className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-6 shadow-2xs dark:border-[#1E293B] dark:bg-[#0B1120]"
                >
                  <div className="flex size-10 items-center justify-center rounded-md bg-[#EFF6FF] text-[#2563EB] dark:bg-[#1E293B] dark:text-[#60A5FA]">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-[#0F172A] dark:text-white">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-[#64748B] dark:text-[#94A3B8]">
                    {p.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Enterprise Tech Stack & Infrastructure */}
      <section id="security" className="border-t border-[#E2E8F0] bg-[#F8FAFC] px-4 py-20 sm:px-6 lg:px-8 dark:border-[#1E293B] dark:bg-[#0B1120]">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <span className="text-xs font-semibold tracking-wider text-[#2563EB] uppercase">
              Technology Architecture
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#0F172A] dark:text-white">
              Institutional Stack Architecture
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-[#64748B] dark:text-[#94A3B8]">
              Constructed on modern, auditable primitives for enterprise scale and fault tolerance.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {ARCHITECTURE_PILLARS.map((arch) => {
              const Icon = arch.icon;
              return (
                <div
                  key={arch.title}
                  className="rounded-lg border border-[#E2E8F0] bg-white p-6 shadow-2xs dark:border-[#1E293B] dark:bg-[#0F172A]"
                >
                  <div className="flex size-10 items-center justify-center rounded-md bg-[#EFF6FF] text-[#2563EB] dark:bg-[#1E293B] dark:text-[#60A5FA]">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-[#0F172A] dark:text-white">
                    {arch.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-[#64748B] dark:text-[#94A3B8]">
                    {arch.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Company Milestones / Journey */}
      <section className="border-t border-[#E2E8F0] bg-white px-4 py-20 sm:px-6 lg:px-8 dark:border-[#1E293B] dark:bg-[#0F172A]">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <span className="text-xs font-semibold tracking-wider text-[#2563EB] uppercase">
              Operational Trajectory
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#0F172A] dark:text-white">
              Chronology of Innovation
            </h2>
          </div>

          <div className="mt-12 space-y-6">
            {MILESTONES.map((m) => (
              <div
                key={m.year}
                className="flex flex-col gap-4 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-6 sm:flex-row sm:items-center dark:border-[#1E293B] dark:bg-[#0B1120]"
              >
                <div className="flex size-14 shrink-0 items-center justify-center rounded-md bg-[#2563EB] text-base font-extrabold text-white">
                  {m.year}
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0F172A] dark:text-white">
                    {m.title}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-[#64748B] dark:text-[#94A3B8]">
                    {m.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Executive Leadership Team */}
      <section id="team" className="border-t border-[#E2E8F0] bg-[#F8FAFC] px-4 py-20 sm:px-6 lg:px-8 dark:border-[#1E293B] dark:bg-[#0B1120]">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <span className="text-xs font-semibold tracking-wider text-[#2563EB] uppercase">
              Governance & Leadership
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#0F172A] dark:text-white">
              Built by Industry Practitioners
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-[#64748B] dark:text-[#94A3B8]">
              Our leadership brings decades of collective field dispatch, payroll mathematics, and cybersecurity experience.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {LEADERSHIP.map((leader) => (
              <div
                key={leader.name}
                className="rounded-lg border border-[#E2E8F0] bg-white p-6 shadow-2xs dark:border-[#1E293B] dark:bg-[#0F172A]"
              >
                <div className="flex size-12 items-center justify-center rounded-full bg-[#EFF6FF] text-[#2563EB] dark:bg-[#1E293B] dark:text-[#60A5FA]">
                  <Users className="size-5" />
                </div>
                <h3 className="mt-4 text-sm font-bold text-[#0F172A] dark:text-white">
                  {leader.name}
                </h3>
                <p className="text-[11px] font-semibold text-[#2563EB]">
                  {leader.role}
                </p>
                <p className="mt-3 text-xs leading-relaxed text-[#64748B] dark:text-[#94A3B8]">
                  {leader.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Closing CTA */}
      <section className="border-t border-[#E2E8F0] bg-white px-4 py-16 sm:px-6 lg:px-8 dark:border-[#1E293B] dark:bg-[#0F172A]">
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-6 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-8 text-center sm:flex-row sm:text-left dark:border-[#1E293B] dark:bg-[#0B1120]">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-[#0F172A] dark:text-white">
              Want to see our architecture in action?
            </h3>
            <p className="mt-1 text-xs text-[#64748B] dark:text-[#94A3B8]">
              Test our 3-tier corporate workspaces or review API documentation with our engineering team.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <Button
              asChild
              className="h-10 bg-[#2563EB] px-5 text-xs font-semibold text-white shadow-none transition-colors hover:bg-[#1D4ED8]"
            >
              <Link href="/login" className="inline-flex items-center gap-2">
                <span>Launch Role Sandbox</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
