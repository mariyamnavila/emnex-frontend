import { cn } from "@/lib/utils";

type Tone = "success" | "warning" | "destructive" | "info" | "muted";

const STATUS_TONES: Record<string, Tone> = {
  // Employee / user status
  ACTIVE: "success",
  INACTIVE: "muted",
  SUSPENDED: "warning",
  TERMINATED: "destructive",
  BLOCKED: "destructive",
  DELETED: "destructive",

  // Project status
  PLANNED: "info",
  ON_HOLD: "warning",
  COMPLETED: "success",
  CANCELLED: "destructive",

  // Task status
  TODO: "muted",
  IN_PROGRESS: "info",
  SUBMITTED: "info",
  APPROVED: "success",
  REJECTED: "destructive",

  // Submission status
  PENDING: "warning",

  // Payroll status
  DRAFT: "muted",
  GENERATED: "info",
  PROCESSING: "info",
  PAID: "success",

  // Payment status
  FAILED: "destructive",
  REFUNDED: "muted",

  // Priority
  LOW: "muted",
  MEDIUM: "info",
  HIGH: "warning",
  URGENT: "destructive",
};

const TONE_CONFIG: Record<Tone, { badge: string; dot: string }> = {
  success: {
    badge: "bg-[#F0FDF4] text-[#16A34A] border-[#16A34A]/20 dark:bg-[#16A34A]/10 dark:text-[#4ADE80] dark:border-[#4ADE80]/20",
    dot: "bg-[#16A34A] dark:bg-[#4ADE80]",
  },
  warning: {
    badge: "bg-[#FFFBEB] text-[#D97706] border-[#D97706]/20 dark:bg-[#D97706]/10 dark:text-[#FBBF24] dark:border-[#FBBF24]/20",
    dot: "bg-[#D97706] dark:bg-[#FBBF24]",
  },
  destructive: {
    badge: "bg-[#FEF2F2] text-[#DC2626] border-[#DC2626]/20 dark:bg-[#DC2626]/10 dark:text-[#F87171] dark:border-[#F87171]/20",
    dot: "bg-[#DC2626] dark:bg-[#F87171]",
  },
  info: {
    badge: "bg-[#EFF6FF] text-[#2563EB] border-[#2563EB]/20 dark:bg-[#2563EB]/10 dark:text-[#60A5FA] dark:border-[#60A5FA]/20",
    dot: "bg-[#2563EB] dark:bg-[#60A5FA]",
  },
  muted: {
    badge: "bg-[#F1F5F9] text-[#64748B] border-[#64748B]/20 dark:bg-[#1E293B] dark:text-[#94A3B8] dark:border-[#94A3B8]/20",
    dot: "bg-[#64748B] dark:bg-[#94A3B8]",
  },
};

export function statusTone(status: string): Tone {
  return STATUS_TONES[status.toUpperCase()] ?? "muted";
}

export function formatStatus(status: string): string {
  return status
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

interface StatusBadgeProps {
  status: string;
  showDot?: boolean;
  className?: string;
}

export function StatusBadge({ status, showDot = true, className }: StatusBadgeProps) {
  const tone = statusTone(status);
  const config = TONE_CONFIG[tone];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        config.badge,
        className
      )}
    >
      {showDot && <span className={cn("size-1.5 rounded-full shrink-0", config.dot)} />}
      <span>{formatStatus(status)}</span>
    </span>
  );
}
