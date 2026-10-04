import { CalendarClock } from "lucide-react";
import { isTaskOverdue } from "@/lib/task";
import { cn, formatDay } from "@/lib/utils";
import type { TaskStatus } from "@/types/task.type";

interface TaskDueProps {
	task: { dueDate: string | null; status: TaskStatus };
	/** Spell out "Overdue · " / "Due " instead of icon + date only */
	verbose?: boolean;
	className?: string;
}

// Calendar icon + due date, red when overdue; nothing when there's no due date
export function TaskDue({ task, verbose = false, className }: TaskDueProps) {
	if (!task.dueDate) return null;
	const overdue = isTaskOverdue(task);
	return (
		<span
			className={cn(
				"inline-flex items-center gap-1 text-xs tabular-nums",
				overdue ? "font-medium text-[#DC2626]" : "text-[#64748B] dark:text-[#94A3B8]",
				className,
			)}
			title={overdue ? "Overdue" : "Due date"}
		>
			<CalendarClock className="size-3.5" aria-hidden="true" />
			{verbose ? (overdue ? "Overdue · " : "Due ") : null}
			{formatDay(task.dueDate)}
			{overdue && !verbose ? <span className="sr-only">(overdue)</span> : null}
		</span>
	);
}
