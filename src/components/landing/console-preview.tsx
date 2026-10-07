import { Layers, Banknote } from "lucide-react";

const KPIS = [
  { label: "Active Workforce", value: "1,420", note: "+12 this wk", tone: "text-[#16A34A]" },
  { label: "Pending Approvals", value: "14", note: "Needs review", tone: "text-[#D97706]" },
  { label: "Monthly Payroll (Oct)", value: "$284,500", note: "Calculated", tone: "text-[#2563EB]" },
  { label: "Deliverable SLA", value: "98.4%", note: "On target", tone: "text-[#16A34A]" },
];

const PRIORITY = {
  Urgent: "bg-[#FEF2F2] text-[#DC2626]",
  High: "bg-[#EFF6FF] text-[#2563EB]",
  Medium: "bg-[#F1F5F9] text-[#64748B]",
};

const STATUS = {
  Approved: "border-[#16A34A]/20 bg-[#F0FDF4] text-[#16A34A]",
  "Under Review": "border-[#D97706]/20 bg-[#FFFBEB] text-[#D97706]",
  "In Progress": "border-[#2563EB]/20 bg-[#EFF6FF] text-[#2563EB]",
};

const DISPATCH: { title: string; who: string; dept: string; priority: keyof typeof PRIORITY; status: keyof typeof STATUS }[] = [
  { title: "Solar Array Inspection — Sector 4", who: "Marcus Vance", dept: "Field Engineering", priority: "Urgent", status: "Approved" },
  { title: "HVAC Central Chillers Audit", who: "Sarah Jenkins", dept: "Facility Maintenance", priority: "High", status: "Under Review" },
  { title: "Fiber Uplink Verification", who: "David Chen", dept: "Network Operations", priority: "Medium", status: "In Progress" },
];

const RUNS = [
  { run: "Run #PAY-2026-10-A", amount: "$94,200.00", team: "18 Field Specialists", state: "Paid via Stripe", tone: "text-[#16A34A]" },
  { run: "Run #PAY-2026-10-B", amount: "$112,450.00", team: "24 Field Specialists", state: "Paid via Stripe", tone: "text-[#16A34A]" },
  { run: "Run #PAY-2026-10-C (Draft)", amount: "$77,850.00", team: "16 Field Specialists", state: "Awaiting Approval", tone: "text-[#D97706]" },
];

const rowClass = "rounded-md border border-[#E2E8F0] p-2.5 text-xs dark:border-[#1E293B] dark:bg-[#0B1120]";

export function ConsolePreview() {
  return (
    <div className="mx-auto mt-14 max-w-6xl">
      <div className="rounded-xl border border-[#CBD5E1] bg-[#0F172A] p-2 shadow-xl ring-1 ring-black/5 dark:border-[#1E293B]">
        {/* Window title bar */}
        <div className="flex items-center justify-between gap-3 border-b border-[#1E293B] px-4 py-2.5 text-xs text-[#94A3B8]">
          <div className="flex min-w-0 items-center gap-2">
            <div className="flex shrink-0 gap-1.5">
              <div className="size-2.5 rounded-full bg-[#EF4444]/80" />
              <div className="size-2.5 rounded-full bg-[#F59E0B]/80" />
              <div className="size-2.5 rounded-full bg-[#10B981]/80" />
            </div>
            <span className="ml-2 truncate font-mono text-[11px] text-[#CBD5E1]">
              emnex-enterprise-cluster // node-01.us-east.prod
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <span className="inline-flex items-center gap-1 rounded bg-[#1E293B] px-2 py-0.5 font-mono text-[10px] whitespace-nowrap text-[#4ADE80]">
              <span className="size-1.5 animate-pulse rounded-full bg-[#4ADE80]" />
              99.998% SLA
            </span>
            <span className="hidden font-mono text-[11px] text-[#64748B] sm:inline">RBAC: Strict Enforcement</span>
          </div>
        </div>

        {/* Dashboard Mockup Content */}
        <div className="grid gap-4 bg-[#F8FAFC] p-4 sm:p-6 lg:grid-cols-12 dark:bg-[#0B1120]">
          {/* KPI Strip — value and note stack until the tiles are wide enough */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:col-span-12">
            {KPIS.map((kpi) => (
              <div
                key={kpi.label}
                className="rounded-lg border border-[#E2E8F0] bg-white p-3.5 shadow-2xs dark:border-[#1E293B] dark:bg-[#0F172A]"
              >
                <span className="block text-[11px] leading-snug font-medium text-[#64748B] dark:text-[#94A3B8]">{kpi.label}</span>
                <div className="mt-1 flex flex-col gap-0.5 lg:flex-row lg:items-baseline lg:justify-between">
                  <span className="text-xl font-bold tracking-tight text-[#0F172A] tabular-nums dark:text-white">
                    {kpi.value}
                  </span>
                  <span className={`text-[10px] font-semibold whitespace-nowrap ${kpi.tone}`}>{kpi.note}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Left Pane: Task Dispatch Queue */}
          <div className="rounded-lg border border-[#E2E8F0] bg-white p-4 lg:col-span-7 dark:border-[#1E293B] dark:bg-[#0F172A]">
            <div className="flex items-center justify-between gap-3 border-b border-[#E2E8F0] pb-3 dark:border-[#1E293B]">
              <div className="flex items-center gap-2">
                <Layers className="size-4 text-[#2563EB]" />
                <span className="text-xs font-bold text-[#0F172A] dark:text-white">Live Operations Dispatch</span>
              </div>
              <span className="text-[11px] whitespace-nowrap text-[#64748B] dark:text-[#94A3B8]">Auto-refreshed</span>
            </div>

            <div className="mt-3 space-y-2.5">
              {DISPATCH.map((task) => (
                <div key={task.title} className={`flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between ${rowClass}`}>
                  <div className="min-w-0 space-y-0.5">
                    <p className="font-semibold text-[#0F172A] dark:text-white">{task.title}</p>
                    <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                      Assigned to: {task.who} &bull; Dept: {task.dept}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ${PRIORITY[task.priority]}`}>
                      {task.priority}
                    </span>
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium whitespace-nowrap ${STATUS[task.status]}`}>
                      {task.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Pane: Stripe Payroll Settlement Feed */}
          <div className="rounded-lg border border-[#E2E8F0] bg-white p-4 lg:col-span-5 dark:border-[#1E293B] dark:bg-[#0F172A]">
            <div className="flex items-center justify-between gap-3 border-b border-[#E2E8F0] pb-3 dark:border-[#1E293B]">
              <div className="flex items-center gap-2">
                <Banknote className="size-4 text-[#16A34A]" />
                <span className="text-xs font-bold text-[#0F172A] dark:text-white">Payroll Settlements (Stripe)</span>
              </div>
              <span className="font-mono text-[10px] text-[#16A34A]">Synced</span>
            </div>

            <div className="mt-3 space-y-2.5">
              {RUNS.map((run) => (
                <div key={run.run} className={rowClass}>
                  <div className="flex items-center justify-between gap-3">
                    <span className="min-w-0 font-medium text-[#0F172A] dark:text-white">{run.run}</span>
                    <span className="font-semibold whitespace-nowrap text-[#0F172A] tabular-nums dark:text-white">
                      {run.amount}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center justify-between gap-3 text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                    <span>{run.team}</span>
                    <span className={`font-medium whitespace-nowrap ${run.tone}`}>{run.state}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
