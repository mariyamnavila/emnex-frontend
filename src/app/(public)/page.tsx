import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Users,
  Layers,
  Banknote,
  CheckCircle2,
  Check,
  ChevronRight,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "EmNex | Enterprise Workforce & Field Operations Platform",
  description:
    "The unified corporate operating system for enterprise workforce management, field project dispatch, submission approvals, and automated Stripe payroll.",
  openGraph: {
    title: "EmNex Enterprise Workforce & Field Operations",
    description:
      "Precision workforce hierarchy, project dispatch, deliverable verification, and automated payroll with granular RBAC governance.",
    type: "website",
    url: "https://emnex.vercel.app",
  },
};

const LOGO_COMPANIES = [
  { name: "AeroCorp Logistics", label: "AEROCORP" },
  { name: "Vertex Energy Systems", label: "VERTEX ENERGY" },
  { name: "Apex Global Facilities", label: "APEX GLOBAL" },
  { name: "Meridian Field Health", label: "MERIDIAN" },
  { name: "OmniFleet Networks", label: "OMNIFLEET" },
  { name: "TerraCore Infrastructure", label: "TERRACORE" },
];

const STATS = [
  {
    label: "Active Field Operations",
    value: "14,800+",
    change: "+28% YoY expansion",
    tone: "text-[#16A34A]",
  },
  {
    label: "Monthly Payroll Disbursed",
    value: "$18.4M",
    change: "100% calculation accuracy",
    tone: "text-[#2563EB]",
  },
  {
    label: "System SLA Availability",
    value: "99.99%",
    change: "High-availability edge",
    tone: "text-[#0F172A] dark:text-white",
  },
  {
    label: "Granular RBAC Controls",
    value: "43",
    change: "Strict zero-leakage security",
    tone: "text-[#D97706]",
  },
];

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
    desc: "43 granular permissions mapped across 4 corporate default tiers plus unlimited custom roles. Immutable audit logs tracking all actions across the system.",
    highlights: [
      "Full API & middleware route enforcement",
      "Custom organization role builder",
      "Comprehensive actor attribution logging",
    ],
  },
];

const ROLE_TIERS = [
  {
    role: "Executive Admin",
    tagline: "Total Governance & Financial Command",
    badge: "Full Privileges",
    badgeStyle: "bg-[#0F172A] text-white",
    desc: "Holistic oversight across all departments, aggregate cashflow analytics, company-wide payroll sign-offs, and custom permission provisioning.",
    demoUser: "admin@emnex.com",
    demoRoleParam: "ADMIN",
    capabilities: [
      "Global operational dashboard & KPI charts",
      "Company-wide payroll generation & approval",
      "Department and employee roster administration",
      "Full RBAC matrix editor (43 permissions)",
      "System-wide immutable audit trail inspection",
    ],
  },
  {
    role: "Operations Manager",
    tagline: "Field Dispatch & Delivery Velocity",
    badge: "Field Operations",
    badgeStyle: "bg-[#2563EB] text-white",
    desc: "Targeted focus on team execution: creating project deliverables, dispatching urgent tasks, evaluating employee submissions, and reviewing quality.",
    demoUser: "manager@emnex.com",
    demoRoleParam: "HR_MANAGER",
    capabilities: [
      "Departmental project & task board management",
      "Direct task assignment with priority levels",
      "Submission review queue with approval reasons",
      "Real-time employee workload monitoring",
      "Department performance analytics",
    ],
  },
  {
    role: "Field Employee",
    tagline: "Task Execution & Transparent Compensation",
    badge: "Specialist Portal",
    badgeStyle: "bg-[#475569] text-white",
    desc: "Frictionless personal workspace: view assigned tickets, log field hours, attach proof-of-completion deliverables, and download verified payslips.",
    demoUser: "employee@emnex.com",
    demoRoleParam: "EMPLOYEE",
    capabilities: [
      "Focused 'My Tasks' queue with deadlines",
      "Work submission form with notes and proof",
      "Real-time review status notifications",
      "Personal salary and payslip history",
      "Stripe payment checkout tracking",
    ],
  },
];

const TESTIMONIALS = [
  {
    quote:
      "EmNex replaced three separate tools for dispatch, hours logging, and contractor payroll. Our weekly close cycle dropped from 4 days to under 45 minutes, with zero payroll discrepancy disputes.",
    author: "Marcus Vance",
    role: "VP of Global Field Operations",
    company: "Apex Global Facilities",
  },
  {
    quote:
      "The 43-permission role matrix gave our compliance officer complete peace of mind. Our field supervisors get exactly what they need to approve deliverables without seeing sensitive payroll financials.",
    author: "Elena Rostova",
    role: "Director of People & Operations",
    company: "Vertex Energy Systems",
  },
  {
    quote:
      "Our field teams love the simplicity. They log work proofs on mobile, managers approve in one click, and automated Stripe settlements disburse right on schedule.",
    author: "David Chen",
    role: "Chief Operating Officer",
    company: "TerraCore Infrastructure",
  },
];

const SECURITY_STANDARDS = [
  {
    title: "SOC 2 Type II Architecture",
    desc: "Strict logical separation of tenant data, encryption at rest with AES-256, and verified data integrity.",
  },
  {
    title: "Granular 43-Permission RBAC",
    desc: "Every database query and API mutation is validated against user permission masks at middleware & controller boundaries.",
  },
  {
    title: "End-to-End TLS 1.3 Transport",
    desc: "All client-to-server communications and Stripe payment transactions enforce modern cryptographic transport ciphers.",
  },
  {
    title: "Immutable Operational Audits",
    desc: "Actor identification, timestamp, IP, entity type, and delta states logged for strict corporate compliance reviews.",
  },
];

const FAQS = [
  {
    q: "How does EmNex handle 3 distinct corporate roles?",
    a: "EmNex enforces role-based access control at both Next.js middleware and backend API layers. Executive Admins govern global org analytics, payroll approvals, and RBAC matrices; Operations Managers oversee department tasks, dispatching, and submission approvals; while Field Employees access their personalized task queues, submission history, and verified payslips.",
  },
  {
    q: "Can I test the platform without setting up real bank accounts?",
    a: "Yes. EmNex features 1-Click Demo Login buttons for all roles directly on the login page. Furthermore, our Stripe integration runs in Test Mode, enabling you to test full payment sessions and webhook updates safely.",
  },
  {
    q: "How is payroll calculated and disbursed?",
    a: "Admins or Finance managers trigger payroll generation for specified date ranges. The system aggregates active base salaries and calculates deductions to yield exact net compensation. Once approved by an authorized executive, Stripe checkout sessions can be generated for instant digital settlement.",
  },
  {
    q: "Can we create custom roles with tailored permissions?",
    a: "Yes. EmNex includes an organization role builder that allows you to configure custom roles from our 43 discrete permissions (e.g. 'Field Supervisor', 'Regional Auditor', 'Contractor Lead') matching your corporate hierarchy.",
  },
  {
    q: "How does the work submission workflow function?",
    a: "Field employees submit completion notes and proofs against assigned tasks. Assigned managers receive the item in their Review Queue, where they can approve the task or reject it with actionable feedback.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col bg-[#F8FAFC] dark:bg-[#0B1120]">
      {/* 1. Hero Section */}
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

          {/* Micro trust note */}
          <div className="mt-4 flex items-center justify-center gap-4 text-xs text-[#64748B] dark:text-[#94A3B8]">
            <span className="inline-flex items-center gap-1.5">
              <Check className="size-3 text-[#16A34A]" /> No credit card required
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1.5">
              <Check className="size-3 text-[#16A34A]" /> Instant pre-seeded accounts
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1.5">
              <Check className="size-3 text-[#16A34A]" /> Stripe test mode included
            </span>
          </div>
        </div>

        {/* 2. Simulated Enterprise Command Console Preview */}
        <div className="mx-auto mt-14 max-w-6xl">
          <div className="rounded-xl border border-[#CBD5E1] bg-[#0F172A] p-2 shadow-xl ring-1 ring-black/5 dark:border-[#1E293B]">
            {/* Window title bar */}
            <div className="flex items-center justify-between border-b border-[#1E293B] px-4 py-2.5 text-xs text-[#94A3B8]">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="size-2.5 rounded-full bg-[#EF4444]/80" />
                  <div className="size-2.5 rounded-full bg-[#F59E0B]/80" />
                  <div className="size-2.5 rounded-full bg-[#10B981]/80" />
                </div>
                <span className="ml-2 font-mono text-[11px] text-[#CBD5E1]">
                  emnex-enterprise-cluster // node-01.us-east.prod
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1 rounded bg-[#1E293B] px-2 py-0.5 font-mono text-[10px] text-[#4ADE80]">
                  <span className="size-1.5 animate-pulse rounded-full bg-[#4ADE80]" />
                  99.998% SLA
                </span>
                <span className="hidden sm:inline font-mono text-[11px] text-[#64748B]">
                  RBAC: Strict Enforcement
                </span>
              </div>
            </div>

            {/* Dashboard Mockup Content */}
            <div className="grid gap-4 bg-[#F8FAFC] p-4 sm:p-6 lg:grid-cols-12 dark:bg-[#0B1120]">
              {/* KPI Strip */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:col-span-12">
                <div className="rounded-lg border border-[#E2E8F0] bg-white p-3.5 shadow-2xs dark:border-[#1E293B] dark:bg-[#0F172A]">
                  <span className="text-[11px] font-medium text-[#64748B] dark:text-[#94A3B8]">
                    Active Workforce
                  </span>
                  <div className="mt-1 flex items-baseline justify-between">
                    <span className="text-xl font-bold tracking-tight text-[#0F172A] tabular-nums dark:text-white">
                      1,420
                    </span>
                    <span className="text-[10px] font-semibold text-[#16A34A]">+12 this wk</span>
                  </div>
                </div>

                <div className="rounded-lg border border-[#E2E8F0] bg-white p-3.5 shadow-2xs dark:border-[#1E293B] dark:bg-[#0F172A]">
                  <span className="text-[11px] font-medium text-[#64748B] dark:text-[#94A3B8]">
                    Pending Approvals
                  </span>
                  <div className="mt-1 flex items-baseline justify-between">
                    <span className="text-xl font-bold tracking-tight text-[#0F172A] tabular-nums dark:text-white">
                      14
                    </span>
                    <span className="text-[10px] font-semibold text-[#D97706]">Needs review</span>
                  </div>
                </div>

                <div className="rounded-lg border border-[#E2E8F0] bg-white p-3.5 shadow-2xs dark:border-[#1E293B] dark:bg-[#0F172A]">
                  <span className="text-[11px] font-medium text-[#64748B] dark:text-[#94A3B8]">
                    Monthly Payroll (Oct)
                  </span>
                  <div className="mt-1 flex items-baseline justify-between">
                    <span className="text-xl font-bold tracking-tight text-[#0F172A] tabular-nums dark:text-white">
                      $284,500
                    </span>
                    <span className="text-[10px] font-semibold text-[#2563EB]">Calculated</span>
                  </div>
                </div>

                <div className="rounded-lg border border-[#E2E8F0] bg-white p-3.5 shadow-2xs dark:border-[#1E293B] dark:bg-[#0F172A]">
                  <span className="text-[11px] font-medium text-[#64748B] dark:text-[#94A3B8]">
                    Deliverable SLA
                  </span>
                  <div className="mt-1 flex items-baseline justify-between">
                    <span className="text-xl font-bold tracking-tight text-[#0F172A] tabular-nums dark:text-white">
                      98.4%
                    </span>
                    <span className="text-[10px] font-semibold text-[#16A34A]">On target</span>
                  </div>
                </div>
              </div>

              {/* Left Pane: Task Dispatch Queue */}
              <div className="rounded-lg border border-[#E2E8F0] bg-white p-4 lg:col-span-7 dark:border-[#1E293B] dark:bg-[#0F172A]">
                <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3 dark:border-[#1E293B]">
                  <div className="flex items-center gap-2">
                    <Layers className="size-4 text-[#2563EB]" />
                    <span className="text-xs font-bold text-[#0F172A] dark:text-white">
                      Live Operations Dispatch
                    </span>
                  </div>
                  <span className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                    Auto-refreshed
                  </span>
                </div>

                <div className="mt-3 space-y-2.5">
                  <div className="flex items-center justify-between rounded-md border border-[#E2E8F0] p-2.5 text-xs dark:border-[#1E293B] dark:bg-[#0B1120]">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#0F172A] dark:text-white">
                          Solar Array Inspection — Sector 4
                        </span>
                        <span className="rounded bg-[#FEF2F2] px-1.5 py-0.5 text-[9px] font-bold text-[#DC2626] uppercase">
                          Urgent
                        </span>
                      </div>
                      <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                        Assigned to: Marcus Vance • Dept: Field Engineering
                      </p>
                    </div>
                    <span className="rounded-full border border-[#16A34A]/20 bg-[#F0FDF4] px-2 py-0.5 text-[10px] font-medium text-[#16A34A]">
                      Approved
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-md border border-[#E2E8F0] p-2.5 text-xs dark:border-[#1E293B] dark:bg-[#0B1120]">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#0F172A] dark:text-white">
                          HVAC Central Chillers Audit
                        </span>
                        <span className="rounded bg-[#EFF6FF] px-1.5 py-0.5 text-[9px] font-bold text-[#2563EB] uppercase">
                          High
                        </span>
                      </div>
                      <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                        Assigned to: Sarah Jenkins • Dept: Facility Maintenance
                      </p>
                    </div>
                    <span className="rounded-full border border-[#D97706]/20 bg-[#FFFBEB] px-2 py-0.5 text-[10px] font-medium text-[#D97706]">
                      Under Review
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-md border border-[#E2E8F0] p-2.5 text-xs dark:border-[#1E293B] dark:bg-[#0B1120]">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#0F172A] dark:text-white">
                          Fiber Uplink Verification
                        </span>
                        <span className="rounded bg-[#F1F5F9] px-1.5 py-0.5 text-[9px] font-bold text-[#64748B] uppercase">
                          Medium
                        </span>
                      </div>
                      <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                        Assigned to: David Chen • Dept: Network Operations
                      </p>
                    </div>
                    <span className="rounded-full border border-[#2563EB]/20 bg-[#EFF6FF] px-2 py-0.5 text-[10px] font-medium text-[#2563EB]">
                      In Progress
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Pane: Stripe Payroll Settlement Feed */}
              <div className="rounded-lg border border-[#E2E8F0] bg-white p-4 lg:col-span-5 dark:border-[#1E293B] dark:bg-[#0F172A]">
                <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3 dark:border-[#1E293B]">
                  <div className="flex items-center gap-2">
                    <Banknote className="size-4 text-[#16A34A]" />
                    <span className="text-xs font-bold text-[#0F172A] dark:text-white">
                      Payroll Settlements (Stripe)
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-[#16A34A]">Synced</span>
                </div>

                <div className="mt-3 space-y-2.5">
                  <div className="rounded-md border border-[#E2E8F0] p-2.5 text-xs dark:border-[#1E293B] dark:bg-[#0B1120]">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-[#0F172A] dark:text-white">
                        Run #PAY-2026-10-A
                      </span>
                      <span className="font-semibold text-[#0F172A] tabular-nums dark:text-white">
                        $94,200.00
                      </span>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                      <span>18 Field Specialists</span>
                      <span className="font-medium text-[#16A34A]">Paid via Stripe</span>
                    </div>
                  </div>

                  <div className="rounded-md border border-[#E2E8F0] p-2.5 text-xs dark:border-[#1E293B] dark:bg-[#0B1120]">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-[#0F172A] dark:text-white">
                        Run #PAY-2026-10-B
                      </span>
                      <span className="font-semibold text-[#0F172A] tabular-nums dark:text-white">
                        $112,450.00
                      </span>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                      <span>24 Field Specialists</span>
                      <span className="font-medium text-[#16A34A]">Paid via Stripe</span>
                    </div>
                  </div>

                  <div className="rounded-md border border-[#E2E8F0] p-2.5 text-xs dark:border-[#1E293B] dark:bg-[#0B1120]">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-[#0F172A] dark:text-white">
                        Run #PAY-2026-10-C (Draft)
                      </span>
                      <span className="font-semibold text-[#0F172A] tabular-nums dark:text-white">
                        $77,850.00
                      </span>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                      <span>16 Field Specialists</span>
                      <span className="font-medium text-[#D97706]">Awaiting Approval</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Corporate Trust Banner */}
        <div className="mx-auto mt-16 max-w-6xl border-t border-[#E2E8F0] pt-10 dark:border-[#1E293B]">
          <p className="text-center text-xs font-semibold tracking-wider text-[#64748B] uppercase dark:text-[#94A3B8]">
            Trusted by mission-critical enterprise operations & field networks
          </p>
          <div className="mt-6 grid grid-cols-2 items-center justify-center gap-6 sm:grid-cols-3 md:grid-cols-6">
            {LOGO_COMPANIES.map((company) => (
              <div
                key={company.name}
                className="flex items-center justify-center rounded border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-center text-xs font-bold tracking-wider text-[#475569] dark:border-[#1E293B] dark:bg-[#0F172A] dark:text-[#94A3B8]"
              >
                {company.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Verified Quantitative Impact Stats */}
      <section className="border-b border-[#E2E8F0] bg-[#F8FAFC] px-4 py-14 sm:px-6 lg:px-8 dark:border-[#1E293B] dark:bg-[#0B1120]">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="rounded-lg border border-[#E2E8F0] bg-white p-6 shadow-2xs dark:border-[#1E293B] dark:bg-[#0F172A]"
              >
                <p className="text-xs font-semibold tracking-wider text-[#64748B] uppercase dark:text-[#94A3B8]">
                  {stat.label}
                </p>
                <p className="mt-2 text-3xl font-extrabold tracking-tight text-[#0F172A] tabular-nums dark:text-white">
                  {stat.value}
                </p>
                <p className={`mt-1.5 text-xs font-medium ${stat.tone}`}>
                  {stat.change}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Core Architectural Engines */}
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

      {/* 5. Three-Tier Corporate Workspaces (Role Showcase) */}
      <section className="border-t border-[#E2E8F0] bg-white px-4 py-20 sm:px-6 lg:px-8 dark:border-[#1E293B] dark:bg-[#0F172A]">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <span className="text-xs font-semibold tracking-wider text-[#2563EB] uppercase">
              Role-Based Governance
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#0F172A] dark:text-white">
              Tailored Workspaces for 3 Critical Enterprise Roles
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-[#64748B] dark:text-[#94A3B8]">
              No role confusion. Each persona logs into a purpose-built console equipped with
              exact permission boundaries and context-specific workflows.
            </p>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            {ROLE_TIERS.map((tier) => (
              <div
                key={tier.role}
                className="flex flex-col justify-between rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-6 shadow-xs dark:border-[#1E293B] dark:bg-[#0B1120]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-[#0F172A] dark:text-white">
                        {tier.role}
                      </span>
                      <p className="text-[11px] font-medium text-[#2563EB]">{tier.tagline}</p>
                    </div>
                    <span
                      className={`rounded px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase ${tier.badgeStyle}`}
                    >
                      {tier.badge}
                    </span>
                  </div>

                  <p className="mt-3 text-xs leading-relaxed text-[#64748B] dark:text-[#94A3B8]">
                    {tier.desc}
                  </p>

                  <div className="mt-6 space-y-2 border-t border-[#E2E8F0] pt-4 dark:border-[#1E293B]">
                    <p className="text-[11px] font-semibold tracking-wider text-[#0F172A] uppercase dark:text-white">
                      Granted Operational Rights
                    </p>
                    {tier.capabilities.map((cap) => (
                      <div
                        key={cap}
                        className="flex items-start gap-2 text-xs text-[#334155] dark:text-[#CBD5E1]"
                      >
                        <Check className="mt-0.5 size-3.5 shrink-0 text-[#16A34A]" />
                        <span>{cap}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 border-t border-[#E2E8F0] pt-5 dark:border-[#1E293B]">
                  <div className="mb-3 flex items-center justify-between text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                    <span>Demo Account:</span>
                    <span className="font-mono font-medium text-[#0F172A] dark:text-white">
                      {tier.demoUser}
                    </span>
                  </div>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full justify-center border-[#CBD5E1] bg-white text-xs font-semibold text-[#0F172A] hover:bg-[#F8FAFC] dark:border-[#1E293B] dark:bg-[#0F172A] dark:text-white"
                  >
                    <Link
                      href={`/login`}
                      className="inline-flex items-center gap-1.5"
                    >
                      <span>1-Click Launch {tier.role}</span>
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Enterprise Customer Testimonials */}
      <section className="border-t border-[#E2E8F0] bg-[#F8FAFC] px-4 py-20 sm:px-6 lg:px-8 dark:border-[#1E293B] dark:bg-[#0B1120]">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <span className="text-xs font-semibold tracking-wider text-[#2563EB] uppercase">
              Field Validated
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#0F172A] dark:text-white">
              Proven Across High-Volume Field Operations
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-[#64748B] dark:text-[#94A3B8]">
              Read how enterprise operations leaders streamlined dispatch and payroll with EmNex.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.author}
                className="flex flex-col justify-between rounded-lg border border-[#E2E8F0] bg-white p-6 shadow-2xs dark:border-[#1E293B] dark:bg-[#0F172A]"
              >
                <p className="text-xs leading-relaxed text-[#334155] italic dark:text-[#CBD5E1]">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-6 border-t border-[#E2E8F0] pt-4 dark:border-[#1E293B]">
                  <p className="text-xs font-bold text-[#0F172A] dark:text-white">{t.author}</p>
                  <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">{t.role}</p>
                  <p className="text-[11px] font-medium text-[#2563EB]">{t.company}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Institutional Security & Compliance */}
      <section className="border-t border-[#E2E8F0] bg-white px-4 py-20 sm:px-6 lg:px-8 dark:border-[#1E293B] dark:bg-[#0F172A]">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <span className="text-xs font-semibold tracking-wider text-[#2563EB] uppercase">
                Defense-Grade Trust
              </span>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#0F172A] sm:text-3xl dark:text-white">
                Enterprise security built directly into the schema
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[#64748B] dark:text-[#94A3B8]">
                Every single query, state mutation, and API call executes through authenticated JWT
                verification, role permission masks, and immutable audit logs.
              </p>
              <div className="mt-6">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="border-[#CBD5E1] bg-white text-xs font-semibold text-[#0F172A] hover:bg-[#F8FAFC] dark:border-[#1E293B] dark:bg-[#0F172A] dark:text-white"
                >
                  <Link href="/about#security">Review security architecture</Link>
                </Button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
              {SECURITY_STANDARDS.map((sec) => (
                <div
                  key={sec.title}
                  className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-5 dark:border-[#1E293B] dark:bg-[#0B1120]"
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="size-4 text-[#16A34A]" />
                    <h3 className="text-sm font-bold text-[#0F172A] dark:text-white">
                      {sec.title}
                    </h3>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-[#64748B] dark:text-[#94A3B8]">
                    {sec.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 8. Frequently Asked Questions */}
      <section className="border-t border-[#E2E8F0] bg-[#F8FAFC] px-4 py-20 sm:px-6 lg:px-8 dark:border-[#1E293B] dark:bg-[#0B1120]">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <span className="text-xs font-semibold tracking-wider text-[#2563EB] uppercase">
              Operational Answers
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#0F172A] dark:text-white">
              Frequently Asked Questions
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-[#64748B] dark:text-[#94A3B8]">
              Key architectural details about EmNex deployment, roles, and payroll flows.
            </p>
          </div>

          <div className="mt-10 rounded-lg border border-[#E2E8F0] bg-white p-6 dark:border-[#1E293B] dark:bg-[#0F172A]">
            <Accordion type="single" collapsible className="w-full">
              {FAQS.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`}>
                  <AccordionTrigger className="text-left text-sm font-semibold text-[#0F172A] hover:text-[#2563EB] dark:text-white dark:hover:text-[#60A5FA]">
                    <span className="flex items-center gap-2.5">
                      <HelpCircle className="size-4 shrink-0 text-[#2563EB]" />
                      {faq.q}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-xs leading-relaxed text-[#475569] dark:text-[#94A3B8]">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* 9. Executive Closing CTA */}
      <section className="border-t border-[#E2E8F0] bg-white px-4 py-20 sm:px-6 lg:px-8 dark:border-[#1E293B] dark:bg-[#0F172A]">
        <div className="mx-auto max-w-5xl rounded-xl border border-[#0F172A] bg-[#0F172A] p-8 text-white shadow-lg sm:p-12 dark:border-[#1E293B]">
          <div className="flex flex-col items-center justify-between gap-8 lg:flex-row lg:text-left">
            <div className="max-w-xl text-center lg:text-left">
              <span className="rounded bg-[#2563EB] px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase text-white">
                Ready For Immediate Deployment
              </span>
              <h3 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl text-white">
                Modernize your enterprise workforce & field operations today
              </h3>
              <p className="mt-3 text-xs leading-relaxed text-[#94A3B8] sm:text-sm">
                Join high-performance operations teams managing thousands of field tasks and millions
                in monthly Stripe settlements with absolute accuracy.
              </p>
            </div>

            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <Button
                asChild
                className="h-11 rounded-md bg-[#2563EB] px-6 text-xs font-semibold text-white shadow-none transition-colors hover:bg-[#1D4ED8]"
              >
                <Link href="/register" className="inline-flex items-center gap-2">
                  <span>Create enterprise account</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-11 rounded-md border-[#334155] bg-transparent px-6 text-xs font-semibold text-white hover:bg-[#1E293B]"
              >
                <Link href="/login">Launch 1-Click Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
