import type { Metadata } from "next";
import DashboardShell from "@/components/dashboard/dashboard-shell";
import { getSessionUser, getSidebarOpen } from "@/lib/session";

export const metadata: Metadata = {
  title: { template: "%s | Admin | EmNex", default: "Admin | EmNex" },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const [session, sidebarOpen] = await Promise.all([getSessionUser(), getSidebarOpen()]);

  return (
    <DashboardShell session={session} sidebarOpen={sidebarOpen} title="Admin" roles={["ADMIN"]}>
      {children}
    </DashboardShell>
  );
}
