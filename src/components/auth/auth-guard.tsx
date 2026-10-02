"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useGetMe } from "@/hooks/auth.hook";
import AuthLoading from "./auth-loading";

export default function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data, isPending, isError } = useGetMe();

  useEffect(() => {
    if (isPending) return;
    // Session gone (logged out / expired) → login, then come back here
    if (isError || !data) {
      router.replace(`/login?redirectTo=${encodeURIComponent(pathname)}`);
    }
  }, [isPending, isError, data, router, pathname]);

  if (isPending) return <AuthLoading />;
  if (isError || !data) return <AuthLoading label="Redirecting..." />;

  return <>{children}</>;
}
