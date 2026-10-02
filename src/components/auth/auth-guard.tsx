"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { isSessionInvalid, useGetMe } from "@/hooks/auth.hook";
import AuthLoading from "./auth-loading";
import SessionError from "./session-error";

export default function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data, isPending, error, refetch, isFetching } = useGetMe();
  const loggedOut = isSessionInvalid(error);

  useEffect(() => {
    if (loggedOut) {
      router.replace(`/login?redirectTo=${encodeURIComponent(pathname)}`);
    }
  }, [loggedOut, router, pathname]);

  if (isPending) return <AuthLoading />;
  if (loggedOut) return <AuthLoading label="Redirecting..." />;
  // Server unreachable / 5xx / rate limited: keep the session, offer a retry
  if (!data) {
    return (
      <SessionError
        message={error?.message}
        onRetry={() => void refetch()}
        isRetrying={isFetching}
      />
    );
  }

  return <>{children}</>;
}
