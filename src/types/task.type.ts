export type TaskStatus =
	| "TODO"
	| "IN_PROGRESS"
	| "SUBMITTED"
	| "APPROVED"
	| "REJECTED"
	| "COMPLETED";

export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface TaskAssignee {
	id: string;
	employeeCode: string;
	jobTitle: string;
	user: { id: string; name: string; email: string; avatar: string | null };
}

export interface Task {
	id: string;
	projectId: string;
	employeeId: string;
	title: string;
	description: string | null;
	estimatedHours: number | null;
	priority: TaskPriority;
	status: TaskStatus;
	dueDate: string | null;
	createdAt: string;
	deletedAt: string | null;
	employee: TaskAssignee;
}

// As sent by the API: estimatedHours is a Prisma Decimal string
export type ApiTask = Omit<Task, "estimatedHours"> & {
	estimatedHours: string | number | null;
};

// Same transitions the backend allows (task.service validTaskTransitions)
export const TASK_TRANSITIONS: Record<TaskStatus, TaskStatus[]> = {
	TODO: ["IN_PROGRESS"],
	IN_PROGRESS: ["SUBMITTED"],
	SUBMITTED: ["APPROVED", "REJECTED"],
	REJECTED: ["IN_PROGRESS"],
	APPROVED: ["COMPLETED"],
	COMPLETED: [],
};

// GET /tasks row: the board needs the project and how many work logs exist
export type ApiBoardTask = ApiTask & {
	project: { id: string; name: string; status: string };
	_count: { submissions: number };
};

export type BoardTask = Task & {
	project: { id: string; name: string; status: string };
	_count: { submissions: number };
};

// GET /tasks/my — the assignee is the signed-in employee, so it isn't included
export type MyTask = Omit<BoardTask, "employee">;
export type ApiMyTask = Omit<ApiBoardTask, "employee">;
