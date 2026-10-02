import type { Metadata } from "next";
import Link from "next/link";
import {
  Users,
  Layers,
  Banknote,
  Shield,
  ListTodo,
  ClipboardCheck,
  ScrollText,
  Building2,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Platform Capabilities & Modules | EmNex Enterprise",
  description:
    "Explore the 8 integrated enterprise modules of EmNex: workforce hierarchy, project dispatch, deliverable approvals, automated Stripe payroll, and 43-permission RBAC.",
  openGraph: {
    title: "EmNex Platform Capabilities & Modules",
    description:
      "A complete system of record for high-compliance field operations, workforce management, and audited payroll settlements.",
    type: "website",
  },
};

const MODULES = [
  {
    id: "workforce",
    icon: Users,
    moduleNum: "MOD-01",
    title: "Workforce & Organization Hierarchy",
    desc: "Centralized employee directory with departmental hierarchy, salary specifications, credential provisioning, and comprehensive lifecycle states.",
    capabilities: [
      "Department structuring with manager assignments and budget allocations",
      "Employee lifecycle transitions: Active, Probation, Suspended, Terminated",
      "Automatic temporary password generation and secure onboarding email dispatch",
      "Granular salary and hourly compensation rate tracking per employee",
    ],
    technicalSnippet: "POST /employees -> Hash generation, roleId mapping, audit event logged",
  },
  {
    id: "projects",
    icon: Layers,
    moduleNum: "MOD-02",
    title: "Project Delivery & Milestone Tracking",
    desc: "Multi-stage project tracking, budget utilization, task delegations, priority controls, and deadline forecasting across distributed operations.",
    capabilities: [
      "Project creation with start/end dates, total fiscal budget, and department tags",
      "Breakdown of complex projects into discrete, assignable task units",
      "Dynamic project health: budget expended vs. remaining, completed vs. pending tasks",
      "Executive and manager visibility into team-wide milestone fulfillment",
    ],
    technicalSnippet: "GET /projects/:id -> Includes budget metrics, task list, assignee roster",
  },
  {
    id: "tasks",
    icon: ListTodo,
    moduleNum: "MOD-03",
    title: "Task Dispatch & Priority Queues",
    desc: "Direct work dispatching with 4 priority tiers (Low, Medium, High, Urgent), status pipelines, and assigned specialist tracking.",
    capabilities: [
      "Priority controls allowing rapid escalation of time-sensitive field tasks",
      "Status lifecycle: Pending -> In Progress -> Completed with milestone markers",
      "Filtered views: 'My Tasks' for individual specialists, 'All Tasks' for managers",
      "Contextual task instruction sets and location reference metadata",
    ],
    technicalSnippet: "GET /tasks?status=IN_PROGRESS&priority=URGENT -> Synced with URL state",
  },
  {
    id: "submissions",
    icon: ClipboardCheck,
    moduleNum: "MOD-04",
    title: "Deliverable Submissions & Review Queue",
    desc: "Field specialists log hours and attach completion proofs; operations managers inspect deliverables and approve or request revisions.",
    capabilities: [
      "Field hour logging directly tied to active project tasks",
      "Submission notes and deliverable proofs attached for manager inspection",
      "Manager review queue with one-click Approve or Reject with feedback reasons",
      "Immutable submission audit history ensuring zero dispute over work completion",
    ],
    technicalSnippet: "PATCH /submissions/:id/review -> Status transition with reviewer notes",
  },
  {
    id: "payroll",
    icon: Banknote,
    moduleNum: "MOD-05",
    title: "Algorithmic Payroll Calculation",
    desc: "Batch payroll generation with mathematical salary precision, deduction tracking, net pay calculations, and multi-tier approval workflows.",
    capabilities: [
      "One-click batch payroll generation across all eligible active employees",
      "Transparent breakdown of Gross Pay, Allowances, Deductions, and Net Disbursal",
      "Two-phase approval workflow (Draft -> Approved -> Paid) with executive sign-off",
      "Self-service digital payslip generation and export for all staff members",
    ],
    technicalSnippet: "POST /payroll/generate -> Period date-range batch mathematical computation",
  },
  {
    id: "payments",
    icon: Building2,
    moduleNum: "MOD-06",
    title: "Stripe Financial Settlement",
    desc: "End-to-end payment processing via Stripe Checkout sessions with automated status updates, webhook synchronization, and payment records.",
    capabilities: [
      "Hosted Stripe Checkout integration supporting cards and bank transfers",
      "Automated success and cancel redirect routing with session verification",
      "Real-time payment record updates reflecting completed Stripe transaction IDs",
      "Test mode sandbox for risk-free pre-production validation",
    ],
    technicalSnippet: "POST /payments/create-checkout-session -> Stripe Session URL dispatch",
  },
  {
    id: "rbac",
    icon: Shield,
    moduleNum: "MOD-07",
    title: "43-Permission RBAC Matrix & Custom Roles",
    desc: "Enterprise authorization enforcing 43 granular permissions across 4 standard roles, with an organization builder for bespoke roles.",
    capabilities: [
      "Default role tiers: Admin, HR Manager, Finance Manager, Employee",
      "Custom role builder allowing exact permission cherry-picking per organization",
      "Enforced at Next.js Middleware, UI component rendering, and Backend API layers",
      "Zero unauthorized privilege escalation with strict role verification",
    ],
    technicalSnippet: "RoleGuard(permissions) -> Evaluated via bitmask/array against user session",
  },
  {
    id: "audit",
    icon: ScrollText,
    moduleNum: "MOD-08",
    title: "Institutional Audit Trails",
    desc: "Comprehensive operational logging capturing every critical state transition, user login, credential change, and payroll authorization.",
    capabilities: [
      "Actor attribution: User ID, IP address, user-agent, timestamp, and entity type",
      "Delta tracking: Previous state vs. Updated state for total compliance clarity",
      "Searchable, filterable, and paginated audit viewer for corporate compliance officers",
      "Tamper-resistant append-only logging architecture",
    ],
    technicalSnippet: "GET /audit-logs?entity=PAYROLL&actorId=usr_123 -> Filterable log stream",
  },
];

const COMPARISON_ROWS = [
  { feature: "Active Workforce Capacity", starter: "Up to 10", pro: "Up to 100", enterprise: "Unlimited" },
  { feature: "Department Hierarchies", starter: "1 Department", pro: "Unlimited", enterprise: "Unlimited" },
  { feature: "Project & Task Management", starter: "Basic", pro: "Advanced + Due Dates", enterprise: "Full + Gantt Forecast" },
  { feature: "Work Deliverable Review Queue", starter: "Manual", pro: "Included with Feedback", enterprise: "Included + Multi-Stage" },
  { feature: "Automated Payroll Generation", starter: "Not available", pro: "Included (Batch)", enterprise: "Included (Real-Time)" },
  { feature: "Stripe Settlement Integration", starter: "Manual transfers", pro: "Stripe Checkout", enterprise: "Stripe Checkout + Invoicing" },
  { feature: "Role-Based Access Control", starter: "3 Standard Roles", pro: "4 Standard Roles", enterprise: "Custom Roles (43 perms)" },
  { feature: "Audit Log History Retention", starter: "7 Days", pro: "90 Days", enterprise: "Unlimited Immutable" },
  { feature: "System Availability SLA", starter: "Community Best-Effort", pro: "99.9% Uptime", enterprise: "99.99% Guaranteed SLA" },
  { feature: "Support Response Standard", starter: "Community Docs", pro: "< 4h Priority Email", enterprise: "24/7 Dedicated Lead" },
];

export default function FeaturesPage() {
  return (
    <div className="bg-[#F8FAFC] dark:bg-[#0B1120]">
      {/* 1. Header */}
      <section className="relative overflow-hidden border-b border-[#E2E8F0] bg-white px-4 py-16 sm:px-6 sm:py-24 lg:px-8 dark:border-[#1E293B] dark:bg-[#0F172A]">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#2563EB]/25 bg-[#EFF6FF] px-3.5 py-1 text-xs font-semibold text-[#2563EB] dark:bg-[#2563EB]/15 dark:text-[#60A5FA]">
            <Sparkles className="size-3.5" />
            <span>Architecture & Capabilities Overview</span>
          </div>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[#0F172A] sm:text-4xl lg:text-5xl dark:text-white">
            Eight Integrated Modules. <br className="hidden sm:inline" />
            <span className="text-[#2563EB]">One Uncompromised System of Record.</span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[#475569] sm:text-base dark:text-[#94A3B8]">
            Explore the complete feature footprint of EmNex. Designed to bridge the operational gap
            between frontline workforce execution, project delivery, and financial payroll settlements.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button
              asChild
              className="h-10 bg-[#2563EB] px-5 text-xs font-semibold text-white shadow-none transition-colors hover:bg-[#1D4ED8]"
            >
              <Link href="/login" className="inline-flex items-center gap-2">
                <span>Launch 1-Click Interactive Demo</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-10 border-[#CBD5E1] bg-white px-5 text-xs font-semibold text-[#0F172A] hover:bg-[#F8FAFC] dark:border-[#1E293B] dark:bg-[#0F172A] dark:text-white"
            >
              <Link href="/pricing">View Pricing Tiers</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 2. Feature Modules Grid */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col justify-between gap-4 border-b border-[#E2E8F0] pb-6 sm:flex-row sm:items-end dark:border-[#1E293B]">
            <div>
              <span className="text-xs font-semibold tracking-wider text-[#2563EB] uppercase">
                Functional Decomposition
              </span>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#0F172A] dark:text-white">
                Detailed Enterprise Modules
              </h2>
            </div>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
              All modules enforce strict role permissions and immutable audit trails
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {MODULES.map((m) => {
              const Icon = m.icon;
              return (
                <div
                  key={m.id}
                  id={m.id}
                  className="flex flex-col justify-between rounded-lg border border-[#E2E8F0] bg-white p-6 shadow-2xs scroll-mt-24 dark:border-[#1E293B] dark:bg-[#0F172A]"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-[#EFF6FF] text-[#2563EB] dark:bg-[#1E293B] dark:text-[#60A5FA]">
                          <Icon className="size-5" />
                        </div>
                        <div>
                          <span className="font-mono text-[10px] font-bold text-[#64748B] dark:text-[#94A3B8]">
                            {m.moduleNum}
                          </span>
                          <h3 className="text-base font-bold text-[#0F172A] dark:text-white">
                            {m.title}
                          </h3>
                        </div>
                      </div>
                    </div>

                    <p className="mt-3 text-xs leading-relaxed text-[#475569] dark:text-[#94A3B8]">
                      {m.desc}
                    </p>

                    {/* Technical payload snippet */}
                    <div className="mt-4 rounded-md border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-1.5 font-mono text-[10px] text-[#334155] dark:border-[#1E293B] dark:bg-[#0B1120] dark:text-[#CBD5E1]">
                      <span className="text-[#2563EB] dark:text-[#60A5FA]">API &bull;</span> {m.technicalSnippet}
                    </div>

                    {/* Capabilities list */}
                    <ul className="mt-5 space-y-2 border-t border-[#E2E8F0] pt-4 dark:border-[#1E293B]">
                      {m.capabilities.map((cap) => (
                        <li
                          key={cap}
                          className="flex items-start gap-2 text-xs text-[#334155] dark:text-[#CBD5E1]"
                        >
                          <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-[#16A34A]" />
                          <span>{cap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 border-t border-[#E2E8F0] pt-4 dark:border-[#1E293B]">
                    <Link
                      href="/login"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8]"
                    >
                      <span>Test this module in Demo Sandbox</span>
                      <ChevronRight className="size-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Capability Comparison Matrix */}
      <section className="border-t border-[#E2E8F0] bg-white px-4 py-20 sm:px-6 lg:px-8 dark:border-[#1E293B] dark:bg-[#0F172A]">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <span className="text-xs font-semibold tracking-wider text-[#2563EB] uppercase">
              Plan Matrix
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#0F172A] dark:text-white">
              Feature Availability Across Tiers
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-[#64748B] dark:text-[#94A3B8]">
              Compare operational limits and capabilities across Starter, Professional, and Enterprise plans.
            </p>
          </div>

          <div className="mt-12 overflow-x-auto rounded-lg border border-[#E2E8F0] bg-white shadow-2xs dark:border-[#1E293B] dark:bg-[#0F172A]">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] dark:border-[#1E293B] dark:bg-[#0B1120]">
                  <th className="px-5 py-4 font-bold text-[#0F172A] dark:text-white">Platform Capability</th>
                  <th className="px-5 py-4 font-bold text-[#0F172A] dark:text-white">Starter ($0)</th>
                  <th className="px-5 py-4 font-bold text-[#2563EB]">Professional ($49)</th>
                  <th className="px-5 py-4 font-bold text-[#0F172A] dark:text-white">Enterprise ($199)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#1E293B]">
                {COMPARISON_ROWS.map((row) => (
                  <tr key={row.feature} className="hover:bg-[#F8FAFC] dark:hover:bg-[#1E293B]/40">
                    <td className="px-5 py-3.5 font-medium text-[#0F172A] dark:text-white">{row.feature}</td>
                    <td className="px-5 py-3.5 text-[#64748B] dark:text-[#94A3B8]">{row.starter}</td>
                    <td className="px-5 py-3.5 font-semibold text-[#2563EB]">{row.pro}</td>
                    <td className="px-5 py-3.5 text-[#0F172A] dark:text-white">{row.enterprise}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 4. Closing CTA */}
      <section className="border-t border-[#E2E8F0] bg-[#F8FAFC] px-4 py-16 sm:px-6 lg:px-8 dark:border-[#1E293B] dark:bg-[#0B1120]">
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-6 rounded-xl border border-[#E2E8F0] bg-white p-8 text-center sm:flex-row sm:text-left dark:border-[#1E293B] dark:bg-[#0F172A]">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-[#0F172A] dark:text-white">
              Experience the full EmNex module suite
            </h3>
            <p className="mt-1 text-xs text-[#64748B] dark:text-[#94A3B8]">
              No credit card required. Log in as Admin, Operations Manager, or Employee instantly.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <Button
              asChild
              className="h-10 bg-[#2563EB] px-5 text-xs font-semibold text-white shadow-none transition-colors hover:bg-[#1D4ED8]"
            >
              <Link href="/login" className="inline-flex items-center gap-2">
                <span>Launch Interactive Demo</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
