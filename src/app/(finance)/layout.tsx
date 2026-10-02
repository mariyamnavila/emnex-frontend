import type { Metadata } from "next";
import RoleGuard from "@/components/auth/role-guard";
import DashboardShell from "@/components/dashboard/dashboard-shell";

export const metadata: Metadata = {
  title: { template: "%s | Finance | EmNex", default: "Finance | EmNex" },
};

export default function FinanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard roles={["FINANCE_MANAGER"]}>
      <DashboardShell title="Finance">{children}</DashboardShell>
    </RoleGuard>
  );
}
