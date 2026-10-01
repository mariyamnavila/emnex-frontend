import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon: Icon = Inbox,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 px-6 py-14 text-center",
        className
      )}
    >
      <div className="flex size-12 items-center justify-center rounded-lg bg-[#EFF6FF] text-[#2563EB] dark:bg-[#1E293B] dark:text-[#3B82F6]">
        <Icon className="size-6" aria-hidden="true" />
      </div>
      <h3 className="mt-2 text-sm font-semibold text-[#0F172A] dark:text-white">{title}</h3>
      {description ? (
        <p className="max-w-sm text-sm text-[#64748B] dark:text-[#94A3B8]">{description}</p>
      ) : null}
      {action ? <div className="mt-3">{action}</div> : null}
    </div>
  );
}
