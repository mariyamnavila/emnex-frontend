import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const ROLE_TIERS = [
  {
    role: "Executive Admin",
    tagline: "Total Governance & Financial Command",
    badge: "Full Privileges",
    badgeStyle: "bg-[#0F172A] text-white",
    desc: "Holistic oversight across all departments, aggregate cashflow analytics, company-wide payroll sign-offs, and custom permission provisioning.",
    demoUser: "admin@emnex.com",
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
    capabilities: [
      "Focused 'My Tasks' queue with deadlines",
      "Work submission form with notes and proof",
      "Real-time review status notifications",
      "Personal salary and payslip history",
      "Stripe payment checkout tracking",
    ],
  },
];

export function RoleShowcase() {
  return (
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
                  <Link href="/login" className="inline-flex items-center gap-1.5">
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
  );
}
