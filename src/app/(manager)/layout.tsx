import type { Metadata } from "next";
import DashboardShell from "@/components/dashboard/dashboard-shell";
import { getSessionUser, getSidebarOpen } from "@/lib/session";

export const metadata: Metadata = {
  title: { template: "%s | Manager | EmNex", default: "Manager | EmNex" },
};

export default async function ManagerLayout({ children }: { children: React.ReactNode }) {
  const [session, sidebarOpen] = await Promise.all([getSessionUser(), getSidebarOpen()]);

  return (
    <DashboardShell
      session={session}
      sidebarOpen={sidebarOpen}
      title="Manager"
      roles={["HR_MANAGER"]}
      permissions={["task.view", "submission.view", "submission.approve", "submission.reject"]}
    >
      {children}
    </DashboardShell>
  );
}
