"use client";

import { type ReactNode } from "react";
import { usePathname } from "next/navigation";
import AccessDenied from "@/components/auth/access-denied";
import { firstAccessibleHref, routePermissions } from "@/config/sidebar-routes";
import { getHomePath, useCurrentUser } from "@/hooks/auth.hook";

// Page-level permission gate: the area RoleGuard decides who enters an area, this
// shows a clear "access denied" for a specific page the user lacks (e.g. a
// hand-typed /admin/roles). Optimistic while permissions load (null) so normal
// navigation never flashes it.
export default function RoutePermissionGuard({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { role, permissions } = useCurrentUser();

  const required = routePermissions(pathname);
  const denied =
    required !== null && permissions !== null && !required.some((p) => permissions.includes(p));

  if (denied) {
    return <AccessDenied homeHref={firstAccessibleHref(role, permissions) ?? getHomePath(role)} />;
  }
  return <>{children}</>;
}
