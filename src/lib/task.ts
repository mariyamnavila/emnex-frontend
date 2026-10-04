import type { TaskStatus } from "@/types/task.type";

const DONE: TaskStatus[] = ["APPROVED", "COMPLETED"];

/** Statuses the assignee still has to act on */
export const OPEN_TASK_STATUSES: TaskStatus[] = ["TODO", "IN_PROGRESS", "REJECTED"];

// Due dates are stored as UTC midnight, so compare calendar days in UTC
export function isTaskOverdue(task: { dueDate: string | null; status: TaskStatus }) {
	if (!task.dueDate || DONE.includes(task.status)) return false;
	return task.dueDate.slice(0, 10) < new Date().toISOString().slice(0, 10);
}
