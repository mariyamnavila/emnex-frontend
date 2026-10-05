"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getHomePath, isSessionInvalid, useGetMe } from "@/hooks/auth.hook";
import { useSession } from "@/providers/session.provider";
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";
import SessionError from "./session-error";

interface RoleGuardProps {
  children: ReactNode;
  /** Roles allowed in this section — omit to allow any signed-in user */
  roles?: string[];
  /** Permissions required (any one suffices) */
  permissions?: string[];
}

export default function RoleGuard({ children, roles, permissions }: RoleGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const session = useSession();
  const { data, isPending, error, refetch, isFetching } = useGetMe();
  const loggedOut = isSessionInvalid(error);

  // The server-verified JWT lets us render right away; /auth/me confirms in the background
  const role = data?.role.name ?? session?.role;
  const roleAllowed = !roles || !role || roles.includes(role);
  // Permission path only resolves once /auth/me loads (null = still deciding)
  const permAllowed = permissions
    ? data
      ? permissions.some((p) => data.permissions.includes(p))
      : null
    : false;

  // Access = no constraints, OR a matching role, OR (role mismatch but the user
  // has the area permission — this is how custom roles reach management areas).
  let allowed: boolean | null;
  if (!roles && !permissions) allowed = true;
  else if (roleAllowed) allowed = true;
  else allowed = permAllowed;

  useEffect(() => {
    if (loggedOut) {
      router.replace(`/login?redirectTo=${encodeURIComponent(pathname)}`);
    } else if (allowed === false && role) {
      router.replace(getHomePath(role));
    }
  }, [loggedOut, allowed, role, router, pathname]);

  if (loggedOut) return <DashboardSkeleton />;

  if (!data && !session) {
    if (isPending) return <DashboardSkeleton />;
    return (
      <SessionError
        message={error?.message}
        onRetry={() => void refetch()}
        isRetrying={isFetching}
      />
    );
  }

  // Still deciding (waiting for /auth/me on a role mismatch), or denied → bounce
  if (allowed !== true) return <DashboardSkeleton />;

  return <>{children}</>;
}
