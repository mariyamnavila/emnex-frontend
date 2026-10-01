import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="inline-flex items-center rounded-full border border-[#2563EB]/20 bg-[#EFF6FF] px-3 py-1 text-xs font-semibold text-[#2563EB] dark:bg-[#2563EB]/10 dark:text-[#60A5FA]">
        404 — Resource Not Found
      </div>

      <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#0F172A] sm:text-4xl dark:text-white">
        Page not found
      </h1>
      <p className="mt-2 max-w-md text-sm text-[#64748B] dark:text-[#94A3B8]">
        The URL or resource you requested does not exist or may have been archived. Please verify the navigation path or return to the overview.
      </p>

      <div className="mt-6">
        <Button
          asChild
          className="h-9 bg-[#2563EB] text-xs font-semibold text-white shadow-none transition-colors hover:bg-[#1D4ED8]"
        >
          <Link href="/" className="inline-flex items-center gap-1.5">
            <ArrowLeft className="size-3.5" />
            <span>Back to overview</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
