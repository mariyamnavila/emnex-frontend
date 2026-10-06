import type { ApiTask, Task } from "./task.type";

export type ProjectStatus = "PLANNED" | "ACTIVE" | "ON_HOLD" | "COMPLETED" | "CANCELLED";

// Minimal row from GET /projects/options, for the task-create project picker
export interface ProjectOption {
	id: string;
	name: string;
	status: ProjectStatus;
}

export interface Project {
	id: string;
	name: string;
	description: string | null;
	startDate: string | null;
	endDate: string | null;
	budget: number | null;
	status: ProjectStatus;
	createdAt: string;
	_count: { tasks: number };
}

// As sent by the API: budget is a Prisma Decimal string
export type ApiProject = Omit<Project, "budget"> & { budget: string | number | null };

export interface ProjectDetail extends Project {
	tasks: Task[];
}

export type ApiProjectDetail = ApiProject & { tasks: ApiTask[] };
