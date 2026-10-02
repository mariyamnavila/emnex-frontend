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

export function StatsRibbon() {
  return (
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
  );
}
