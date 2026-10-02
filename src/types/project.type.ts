export type ProjectStatus = "PLANNED" | "ACTIVE" | "ON_HOLD" | "COMPLETED" | "CANCELLED";

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
