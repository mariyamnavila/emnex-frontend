import type { Metadata } from "next";
import DashboardShell from "@/components/dashboard/dashboard-shell";
import { getSessionUser, getSidebarOpen } from "@/lib/session";

export const metadata: Metadata = {
  title: { template: "%s | EmNex", default: "EmNex" },
};

// One shell for every dashboard area (admin/manager/finance/employee). Keeping
// it here — instead of a layout per route group — means crossing areas swaps
// only the page content, so the sidebar/header no longer remount (no flash).
// Access is permission-based: the proxy checks auth, RoutePermissionGuard gates
// each page, and the API enforces permissions, so the shell only needs a signed-in user.
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const [session, sidebarOpen] = await Promise.all([getSessionUser(), getSidebarOpen()]);

  return (
    <DashboardShell session={session} sidebarOpen={sidebarOpen}>
      {children}
    </DashboardShell>
  );
}
