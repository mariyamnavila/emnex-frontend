import { Layers, Banknote } from "lucide-react";

export function ConsolePreview() {
  return (
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
                    Assigned to: Marcus Vance &bull; Dept: Field Engineering
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
                    Assigned to: Sarah Jenkins &bull; Dept: Facility Maintenance
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
                    Assigned to: David Chen &bull; Dept: Network Operations
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
  );
}
