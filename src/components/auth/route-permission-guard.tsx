"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { firstAccessibleHref, routePermissions } from "@/config/sidebar-routes";
import { getHomePath, useCurrentUser } from "@/hooks/auth.hook";

// Page-level permission gate: the area RoleGuard decides who enters an area,
// this bounces a user off a specific page they lack the permission for (e.g. a
// hand-typed /admin/roles). Optimistic while permissions load (null) so normal
// navigation never flashes a skeleton; redirects only once we know it's denied.
export default function RoutePermissionGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { role, permissions } = useCurrentUser();

  const required = routePermissions(pathname);
  const denied =
    required !== null && permissions !== null && !required.some((p) => permissions.includes(p));

  useEffect(() => {
    if (denied) router.replace(firstAccessibleHref(role, permissions) ?? getHomePath(role));
  }, [denied, role, permissions, router]);

  if (denied) return null;
  return <>{children}</>;
}
