import { Badge } from "@/components/ui/badge";
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

const TONE_CLASSES: Record<Tone, string> = {
  success: "border-success/25 bg-success/10 text-success",
  warning: "border-warning/25 bg-warning/10 text-warning",
  destructive: "border-destructive/25 bg-destructive/10 text-destructive",
  info: "border-info/25 bg-info/10 text-info",
  muted: "border-border bg-muted text-muted-foreground",
};

export function statusTone(status: string): Tone {
  return STATUS_TONES[status.toUpperCase()] ?? "muted";
}

function formatStatus(status: string): string {
  return status
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const tone = statusTone(status);

  return (
    <Badge
      variant="outline"
      className={cn(TONE_CLASSES[tone], "font-medium whitespace-nowrap", className)}
    >
      {formatStatus(status)}
    </Badge>
  );
}
