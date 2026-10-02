import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaBanner() {
  return (
    <section className="border-t border-[#E2E8F0] bg-white px-4 py-20 sm:px-6 lg:px-8 dark:border-[#1E293B] dark:bg-[#0F172A]">
      <div className="mx-auto max-w-5xl rounded-xl border border-[#0F172A] bg-[#0F172A] p-8 text-white shadow-lg sm:p-12 dark:border-[#1E293B]">
        <div className="flex flex-col items-center justify-between gap-8 lg:flex-row lg:text-left">
          <div className="max-w-xl text-center lg:text-left">
            <span className="rounded bg-[#2563EB] px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase text-white">
              Ready For Immediate Deployment
            </span>
            <h3 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl text-white">
              Modernize your enterprise workforce & field operations today
            </h3>
            <p className="mt-3 text-xs leading-relaxed text-[#94A3B8] sm:text-sm">
              Join high-performance operations teams managing thousands of field tasks and millions
              in monthly Stripe settlements with absolute accuracy.
            </p>
          </div>

          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <Button
              asChild
              className="h-11 rounded-md bg-[#2563EB] px-6 text-xs font-semibold text-white shadow-none transition-colors hover:bg-[#1D4ED8]"
            >
              <Link href="/register" className="inline-flex items-center gap-2">
                <span>Create enterprise account</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-11 rounded-md border-[#334155] bg-transparent px-6 text-xs font-semibold text-white hover:bg-[#1E293B]"
            >
              <Link href="/login">Launch 1-Click Demo</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
