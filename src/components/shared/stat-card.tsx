import type { LucideIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  hint?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  isLoading?: boolean;
  className?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  hint,
  trend,
  isLoading = false,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-col rounded-lg border border-[#E2E8F0] bg-white p-4 shadow-2xs sm:p-5 dark:border-[#1E293B] dark:bg-[#0F172A]",
        className
      )}
    >
      <div className="flex items-start justify-between gap-2 sm:gap-3">
        <span className="pt-1 text-[11px] font-semibold tracking-wider text-[#64748B] uppercase sm:pt-2 sm:text-xs dark:text-[#94A3B8]">
          {title}
        </span>
        <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-[#EFF6FF] text-[#2563EB] sm:size-9 dark:bg-[#1E293B] dark:text-[#3B82F6]">
          <Icon className="size-4 sm:size-4.5" aria-hidden="true" />
        </div>
      </div>

      {isLoading ? (
        <div className="mt-3 space-y-2.5 sm:mt-4" aria-busy="true" aria-label={`Loading ${title}`}>
          <Skeleton className="h-7 w-20 bg-[#F1F5F9] sm:h-8 sm:w-24 dark:bg-[#1E293B]" />
          <Skeleton className="h-3 w-24 bg-[#F1F5F9] sm:w-32 dark:bg-[#1E293B]" />
        </div>
      ) : (
        <div className="mt-3 min-w-0 space-y-1.5 sm:mt-4">
          <p className="truncate text-xl font-bold tracking-tight text-[#0F172A] tabular-nums sm:text-2xl lg:text-3xl dark:text-white">
            {value}
          </p>

          {(hint || trend) && (
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs">
              {trend && (
                <span
                  className={cn(
                    "font-semibold",
                    trend.isPositive ? "text-[#16A34A]" : "text-[#DC2626]"
                  )}
                >
                  {trend.value}
                </span>
              )}
              {hint && (
                <span className="text-[#64748B] dark:text-[#94A3B8]">{hint}</span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
