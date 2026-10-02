import type { Metadata } from "next";
import RoleGuard from "@/components/auth/role-guard";
import DashboardShell from "@/components/dashboard/dashboard-shell";

export const metadata: Metadata = {
  title: { template: "%s | Admin | EmNex", default: "Admin | EmNex" },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard roles={["ADMIN"]}>
      <DashboardShell title="Admin">{children}</DashboardShell>
    </RoleGuard>
  );
}
