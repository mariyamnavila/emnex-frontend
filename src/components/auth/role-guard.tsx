"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getHomePath, isSessionInvalid, useGetMe } from "@/hooks/auth.hook";
import { useSession } from "@/providers/session.provider";
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";
import AccessDenied from "./access-denied";
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
  const roleMatch = !roles || !role || roles.includes(role);
  const permissionMatch =
    !permissions || !data || permissions.some((p) => data.permissions.includes(p));

  useEffect(() => {
    if (loggedOut) {
      router.replace(`/login?redirectTo=${encodeURIComponent(pathname)}`);
    } else if (role && !roleMatch) {
      router.replace(getHomePath(role));
    }
  }, [loggedOut, role, roleMatch, router, pathname]);

  if (loggedOut || !roleMatch) return <DashboardSkeleton />;

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

  if (!permissionMatch) return <AccessDenied homeHref={getHomePath(role ?? "")} />;

  return <>{children}</>;
}
