import type { Metadata } from "next";
import RoleGuard from "@/components/auth/role-guard";
import DashboardShell from "@/components/dashboard/dashboard-shell";

export const metadata: Metadata = {
  title: { template: "%s | Manager | EmNex", default: "Manager | EmNex" },
};

export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard roles={["HR_MANAGER"]}>
      <DashboardShell title="Manager">{children}</DashboardShell>
    </RoleGuard>
  );
}
