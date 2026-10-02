import { PageHeader } from "@/components/shared/page-header";

export default function AdminOverviewPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Overview"
        description="Organization stats, payroll trends and recent activity"
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {["Employees", "Projects", "Payroll", "Payments"].map((label) => (
          <div
            key={label}
            className="rounded-lg border border-[#E2E8F0] bg-white p-4 dark:border-[#1E293B] dark:bg-[#0F172A]"
          >
            <p className="text-xs font-medium text-[#64748B] dark:text-[#94A3B8]">
              {label}
            </p>
            <p className="mt-2 text-2xl font-bold text-[#0F172A] dark:text-white">
              —
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
