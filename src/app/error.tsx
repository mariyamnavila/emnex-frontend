"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="flex size-12 items-center justify-center rounded-lg bg-[#FEF2F2] text-[#DC2626] dark:bg-[#DC2626]/10">
        <AlertCircle className="size-6" aria-hidden="true" />
      </div>

      <h1 className="mt-4 text-2xl font-bold tracking-tight text-[#0F172A] dark:text-white">
        System encountered an error
      </h1>
      <p className="mt-1.5 max-w-md text-sm text-[#64748B] dark:text-[#94A3B8]">
        An unexpected operational error occurred while processing this request. Our telemetry has logged the incident.
      </p>

      {error.digest ? (
        <code className="mt-3 rounded border border-[#E2E8F0] bg-[#F8FAFC] px-2.5 py-1 text-xs text-[#64748B] dark:border-[#1E293B] dark:bg-[#0F172A]">
          Error ID: {error.digest}
        </code>
      ) : null}

      <div className="mt-6 flex items-center gap-3">
        <Button
          onClick={reset}
          className="h-9 bg-[#2563EB] text-xs font-semibold text-white shadow-none transition-colors hover:bg-[#1D4ED8]"
        >
          <RotateCcw className="mr-1.5 size-3.5" />
          <span>Try again</span>
        </Button>
        <Button
          asChild
          variant="outline"
          className="h-9 border-[#E2E8F0] text-xs font-semibold text-[#334155] hover:bg-[#F8FAFC] dark:border-[#1E293B] dark:text-[#CBD5E1]"
        >
          <Link href="/">Return home</Link>
        </Button>
      </div>
    </div>
  );
}
