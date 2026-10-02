"use client";

import type { ReactNode } from "react";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { DashboardSidebar } from "./dashboard-sidebar";
import { useGetMe } from "@/hooks/auth.hook";
import AuthGuard from "@/components/auth/auth-guard";
import AuthLoading from "@/components/auth/auth-loading";

export default function DashboardShell({
  children,
  title,
}: {
  children: ReactNode;
  title?: string;
}) {
  return (
    <AuthGuard>
      <ShellInner title={title}>{children}</ShellInner>
    </AuthGuard>
  );
}

function ShellInner({
  children,
  title,
}: {
  children: ReactNode;
  title?: string;
}) {
  const { data: user, isPending } = useGetMe();

  if (isPending) return <AuthLoading />;

  const role = user?.role?.name ?? "EMPLOYEE";

  return (
    <SidebarProvider>
      <DashboardSidebar role={role} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-[#E2E8F0] px-4 dark:border-[#1E293B]">
          <SidebarTrigger className="-ml-1" />
          {title ? (
            <>
              <Separator orientation="vertical" className="mr-2 h-4" />
              <h1 className="text-sm font-semibold text-[#0F172A] dark:text-white">
                {title}
              </h1>
            </>
          ) : null}
        </header>
        <div className="flex-1 p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
