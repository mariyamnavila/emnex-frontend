"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";
import { StatusScreen } from "@/components/shared/status-screen";
import { Button } from "@/components/ui/button";

interface RouteErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
  /** Where the secondary button goes, e.g. the area's overview */
  homeHref?: string;
  homeLabel?: string;
  /** Inside the dashboard shell: keeps the sidebar, drops the logo */
  embedded?: boolean;
}

// Shared body for every error.tsx boundary
export function RouteError({ error, reset, homeHref = "/", homeLabel = "Return home", embedded = false }: RouteErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <StatusScreen
      embedded={embedded}
      code="500"
      icon={AlertTriangle}
      tone="red"
      title="Something went wrong"
      message="An unexpected error occurred while loading this page. The issue has been logged — you can retry, or head back."
      detail={
        error.digest ? (
          <code className="rounded-md border border-[#E2E8F0] bg-white px-2.5 py-1 text-xs text-[#64748B] dark:border-[#1E293B] dark:bg-[#0F172A] dark:text-[#94A3B8]">
            Error ID: {error.digest}
          </code>
        ) : undefined
      }
      actions={
        <>
          <Button
            onClick={reset}
            className="h-10 rounded-lg bg-[#2563EB] px-5 text-sm font-semibold text-white shadow-[0_10px_24px_-10px_rgba(37,99,235,0.7)] transition-all hover:-translate-y-0.5 hover:bg-[#1D4ED8]"
          >
            <RotateCcw className="mr-1.5 size-4" />
            Try again
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-10 rounded-lg border-[#E2E8F0] px-5 text-sm font-semibold text-[#334155] hover:bg-[#F8FAFC] dark:border-[#1E293B] dark:text-[#CBD5E1]"
          >
            <Link href={homeHref} className="inline-flex items-center gap-1.5">
              <Home className="size-4" />
              {homeLabel}
            </Link>
          </Button>
        </>
      }
    />
  );
}
