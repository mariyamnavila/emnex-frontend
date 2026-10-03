import type { Metadata } from "next";
import DashboardShell from "@/components/dashboard/dashboard-shell";
import { getSessionUser, getSidebarOpen } from "@/lib/session";

export const metadata: Metadata = {
  title: { template: "%s | EmNex", default: "Dashboard | EmNex" },
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [session, sidebarOpen] = await Promise.all([getSessionUser(), getSidebarOpen()]);

  return (
    <DashboardShell session={session} sidebarOpen={sidebarOpen}>
      {children}
    </DashboardShell>
  );
}
