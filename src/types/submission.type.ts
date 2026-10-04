export type SubmissionStatus = "PENDING" | "APPROVED" | "REJECTED";

// GET /submissions row (hours arrive as a Decimal string)
export interface ApiSubmission {
	id: string;
	taskId: string;
	employeeId: string;
	description: string;
	hoursWorked: string | number;
	workDate: string;
	status: SubmissionStatus;
	reviewedBy: string | null;
	reviewedAt: string | null;
	reviewNote: string | null;
	createdAt: string;
	task: {
		id: string;
		title: string;
		status: string;
		project?: { id: string; name: string };
	};
	employee: {
		id: string;
		employeeCode: string;
		jobTitle: string | null;
		user: { id: string; name: string; email: string; avatar: string | null };
	};
}

export type Submission = Omit<ApiSubmission, "hoursWorked"> & { hoursWorked: number };
