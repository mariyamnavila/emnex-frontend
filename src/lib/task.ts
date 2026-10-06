import type { TaskStatus } from "@/types/task.type";
import { sumBy } from "./utils";

const DONE: TaskStatus[] = ["APPROVED", "COMPLETED"];

/** Same rule as the backend: closed projects take no new tasks or hours */
export const isProjectClosed = (status: string) => status === "COMPLETED" || status === "CANCELLED";

/** Statuses the assignee still has to act on */
export const OPEN_TASK_STATUSES: TaskStatus[] = ["TODO", "IN_PROGRESS", "REJECTED"];

// Due dates are stored as UTC midnight, so compare calendar days in UTC
export function isTaskOverdue(task: { dueDate: string | null; status: TaskStatus }) {
	if (!task.dueDate || DONE.includes(task.status)) return false;
	return task.dueDate.slice(0, 10) < new Date().toISOString().slice(0, 10);
}

/** Sort comparator: overdue first, then by due date; tasks without a due date last */
export function compareByUrgency(
	a: { dueDate: string | null; status: TaskStatus },
	b: { dueDate: string | null; status: TaskStatus },
) {
	const overdue = Number(isTaskOverdue(b)) - Number(isTaskOverdue(a));
	if (overdue !== 0) return overdue;
	return (a.dueDate ?? "9999").localeCompare(b.dueDate ?? "9999");
}

/** The assignee's next move for a task, if any (same rule as the backend) */
export function nextAssigneeStep(status: TaskStatus): { status: TaskStatus; label: string } | null {
	if (status === "TODO") return { status: "IN_PROGRESS", label: "Start task" };
	if (status === "REJECTED") return { status: "IN_PROGRESS", label: "Restart task" };
	if (status === "IN_PROGRESS") return { status: "SUBMITTED", label: "Submit for review" };
	return null;
}

type WorkLogHours = { status: string; hoursWorked: number };

/** Total hours across some work logs */
export function sumHours(logs: WorkLogHours[]): number {
	return sumBy(logs, (log) => log.hoursWorked);
}

/** Approved and still-in-review hours across some work logs */
export function hoursByStatus(logs: WorkLogHours[]) {
	return {
		approved: sumHours(logs.filter((log) => log.status === "APPROVED")),
		pending: sumHours(logs.filter((log) => log.status === "PENDING")),
	};
}
