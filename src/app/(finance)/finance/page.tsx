import { PageHeader } from "@/components/shared/page-header";

export default function FinanceOverviewPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Finance Overview"
        description="Payroll and payment summaries"
      />
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {["Payroll This Month", "Payments Received", "Pending Approvals", "Total Paid"].map(
          (label) => (
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
          ),
        )}
      </div>
    </div>
  );
}
