"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useGetMe, getHomePath } from "@/hooks/auth.hook";
import AuthLoading from "./auth-loading";
import AccessDenied from "./access-denied";

interface RoleGuardProps {
  children: ReactNode;
  /** Roles allowed to view this section */
  roles?: string[];
  /** Permissions required (any one suffices) — alternative to roles */
  permissions?: string[];
}

export default function RoleGuard({
  children,
  roles,
  permissions,
}: RoleGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { data, isPending, isError } = useGetMe();

  const role = data?.role?.name;
  const userPermissions = data?.permissions ?? [];

  const roleMatch = roles && role ? roles.includes(role) : true;
  const permissionMatch = permissions
    ? permissions.some((p) => userPermissions.includes(p))
    : true;

  useEffect(() => {
    if (isPending) return;

    // Not logged in → login page, then come back here
    if (isError || !data) {
      router.replace(`/login?redirectTo=${encodeURIComponent(pathname)}`);
      return;
    }

    // Wrong role for this section → their home
    if (!roleMatch) {
      router.replace(getHomePath(data.role.name));
    }
  }, [isPending, isError, data, roleMatch, router, pathname]);

  if (isPending) return <AuthLoading />;
  if (isError || !data) return <AuthLoading label="Redirecting..." />;

  // Role mismatch → already redirecting, show loading briefly
  if (!roleMatch) return <AuthLoading label="Redirecting..." />;

  // Permission gate failed (same role, insufficient perms) → AccessDenied
  if (!permissionMatch) {
    return <AccessDenied homeHref={getHomePath(data.role.name)} />;
  }

  return <>{children}</>;
}
