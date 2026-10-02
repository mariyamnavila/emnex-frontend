import type { Metadata } from "next";
import DashboardShell from "@/components/dashboard/dashboard-shell";

export const metadata: Metadata = {
  title: { template: "%s | EmNex", default: "Dashboard | EmNex" },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // AuthGuard only — any authenticated user (EMPLOYEE + custom roles)
  return <DashboardShell>{children}</DashboardShell>;
}
