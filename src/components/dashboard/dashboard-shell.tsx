"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";
import RoleGuard from "@/components/auth/role-guard";
import RoutePermissionGuard from "@/components/auth/route-permission-guard";
import { firstAccessibleHref, getSidebarRoutes, isSystemRole } from "@/config/sidebar-routes";
import { getHomePath, useCurrentUser, useRoleSync } from "@/hooks/auth.hook";
import type { SessionUser } from "@/lib/session";
import { SessionProvider } from "@/providers/session.provider";
import { DashboardSidebar } from "./dashboard-sidebar";

interface DashboardShellProps {
  children: ReactNode;
  /** Roles allowed in this section — omit for any signed-in user */
  roles?: string[];
  /** Permissions (any one) that also grant access — lets custom roles in */
  permissions?: string[];
  /** Decoded on the server so the shell renders before /auth/me answers */
  session: SessionUser | null;
  /** Saved collapsed/expanded state (sidebar_state cookie) */
  sidebarOpen?: boolean;
}

export default function DashboardShell({
  children,
  roles,
  permissions,
  session,
  sidebarOpen = true,
}: DashboardShellProps) {
  useRoleSync();
  return (
    <SessionProvider session={session}>
      <RoleGuard roles={roles} permissions={permissions}>
        <TooltipProvider>
        <SidebarProvider defaultOpen={sidebarOpen}>
          <DashboardSidebar />
          <SidebarInset className="min-w-0 bg-[#F8FAFC] dark:bg-[#0B1120]">
            <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-3 border-b border-[#E2E8F0] bg-white/85 pr-4 pl-3 backdrop-blur-md md:pr-6 dark:border-[#1E293B] dark:bg-[#0F172A]/85">
              <SidebarTrigger className="size-8 text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A]" />
              <Separator
                orientation="vertical"
                className="bg-[#E2E8F0] data-vertical:h-4 data-vertical:self-center dark:bg-[#1E293B]"
              />
              <Breadcrumbs />
            </header>
            <div className="mx-auto w-full max-w-350 flex-1 p-4 md:p-6 lg:p-8">
              <RoutePermissionGuard>{children}</RoutePermissionGuard>
            </div>
          </SidebarInset>
        </SidebarProvider>
        </TooltipProvider>
      </RoleGuard>
    </SessionProvider>
  );
}

// Area label for the first breadcrumb, from the URL's first segment
const SECTION_LABEL: Record<string, string> = {
  admin: "Admin",
  manager: "Manager",
  finance: "Finance",
  dashboard: "Workspace",
};

// "Admin › Projects › Details", derived from the sidebar routes
function Breadcrumbs() {
  const pathname = usePathname();
  const { role, permissions } = useCurrentUser();
  const section = SECTION_LABEL[pathname.split("/")[1] ?? ""] ?? "Workspace";
  const home = isSystemRole(role)
    ? getHomePath(role)
    : (firstAccessibleHref(role, permissions) ?? "/dashboard/profile");

  const match = getSidebarRoutes(role, permissions)
    .flatMap((group) => group.items)
    .filter((item) => pathname === item.url || pathname.startsWith(`${item.url}/`))
    .sort((a, b) => b.url.length - a.url.length)[0];

  const crumbs: { label: string; href?: string }[] = [{ label: section, href: home }];
  if (match) {
    const isDeeper = pathname !== match.url;
    crumbs.push({ label: match.title, href: isDeeper ? match.url : undefined });
    if (isDeeper) crumbs.push({ label: pathname.endsWith("/new") ? "New" : "Details" });
  }

  return (
    <nav aria-label="Breadcrumb" className="min-w-0">
      <ol className="flex items-center gap-1.5 text-sm">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <li key={`${crumb.label}-${index}`} className="flex min-w-0 items-center gap-1.5">
              {index > 0 ? (
                <ChevronRight className="size-3.5 shrink-0 text-[#94A3B8]" aria-hidden="true" />
              ) : null}
              {isLast || !crumb.href ? (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className="truncate font-semibold text-[#0F172A] dark:text-white"
                >
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="truncate text-[#64748B] transition-colors hover:text-[#0F172A] dark:text-[#94A3B8] dark:hover:text-white"
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
