import type { LucideIcon } from "lucide-react";
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
  className?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  hint,
  trend,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col justify-between rounded-lg border border-[#E2E8F0] bg-white p-5 shadow-2xs dark:border-[#1E293B] dark:bg-[#0F172A]",
        className
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold tracking-wider text-[#64748B] uppercase dark:text-[#94A3B8]">
          {title}
        </span>
        <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-[#EFF6FF] text-[#2563EB] dark:bg-[#1E293B] dark:text-[#3B82F6]">
          <Icon className="size-4.5" aria-hidden="true" />
        </div>
      </div>

      <div className="mt-4 space-y-1.5">
        <p className="text-2xl font-bold tracking-tight text-[#0F172A] tabular-nums sm:text-3xl dark:text-white">
          {value}
        </p>

        {(hint || trend) && (
          <div className="flex items-center gap-2 text-xs">
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
    </div>
  );
}
