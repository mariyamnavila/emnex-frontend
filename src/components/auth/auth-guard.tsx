"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useGetMe } from "@/hooks/auth.hook";
import AuthLoading from "./auth-loading";

export default function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { data, isPending, isError } = useGetMe();

  useEffect(() => {
    if (isPending) return;
    if (isError || !data) {
      router.replace("/login");
    }
  }, [isPending, isError, data, router]);

  if (isPending) return <AuthLoading />;
  if (isError || !data) return <AuthLoading label="Redirecting..." />;

  return <>{children}</>;
}
