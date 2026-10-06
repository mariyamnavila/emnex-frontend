"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { toIsoDay } from "@/lib/utils";
import { api, errorMessage, toQuery } from "@/lib/api";
import { toAmount } from "@/lib/pay";
import type { LogHoursValues } from "@/validation/submission.validation";
import type {
	ApiMySubmission,
	ApiSubmission,
	MySubmission,
	Submission,
	SubmissionStatus,
} from "@/types/submission.type";

// Hours arrive as a Decimal string
const normalize = <T extends { hoursWorked: string | number }>(submission: T) => ({
	...submission,
	hoursWorked: toAmount(submission.hoursWorked) ?? 0,
});

interface ApiApprovedSubmission {
	id: string;
	workDate: string;
	hoursWorked: string | number;
}

// An employee's approved work logs — the hours hourly payroll is paid from
export function useApprovedSubmissions(employeeId: string | null) {
	return useQuery({
		queryKey: ["submissions", "approved", employeeId],
		queryFn: async () => {
			const { data } = await api.get<ApiApprovedSubmission[]>(
				`/submissions?employeeId=${employeeId}&status=APPROVED&limit=100`,
			);
			return data.map((submission) => normalize(submission));
		},
		enabled: Boolean(employeeId),
		retry: false,
	});
}

// The signed-in employee's own work logs, newest first
export function useMySubmissions() {
	return useQuery({
		queryKey: ["submissions", "my"],
		queryFn: async () => {
			const { data } = await api.get<ApiMySubmission[]>("/submissions/my");
			return data.map((submission): MySubmission => normalize(submission));
		},
	});
}

export interface SubmissionParams {
	page?: number;
	limit?: number;
	status?: SubmissionStatus;
	employeeId?: string;
	oldestFirst?: boolean;
}

export function useSubmissions(params: SubmissionParams) {
	return useQuery({
		queryKey: ["submissions", "list", params],
		queryFn: async () => {
			const { oldestFirst, ...filters } = params;
			const res = await api.get<ApiSubmission[]>(
				`/submissions${toQuery({ ...filters, sortOrder: oldestFirst ? "asc" : undefined })}`,
			);
			return { rows: res.data.map((submission): Submission => normalize(submission)), meta: res.meta };
		},
		placeholderData: (prev) => prev,
	});
}

// Reviews change the dashboard counts too (the task's own status is untouched)
function useInvalidateReviews() {
	const queryClient = useQueryClient();
	return () => {
		void queryClient.invalidateQueries({ queryKey: ["submissions"] });
		void queryClient.invalidateQueries({ queryKey: ["analytics"] });
	};
}

export function useApproveSubmission() {
	const invalidate = useInvalidateReviews();
	return useMutation({
		mutationFn: (submission: Submission) => api.post(`/submissions/${submission.id}/approve`),
		onSuccess: (_, submission) => {
			toast.success(`Approved ${submission.hoursWorked} h for ${submission.employee.user.name}`);
			invalidate();
		},
		onError: (error) => toast.error(errorMessage(error, "Failed to approve work hours")),
	});
}

export function useRejectSubmission() {
	const invalidate = useInvalidateReviews();
	return useMutation({
		mutationFn: ({ submission, reason }: { submission: Submission; reason: string }) =>
			api.post(`/submissions/${submission.id}/reject`, { reason }),
		onSuccess: (_, { submission }) => {
			toast.success(`Sent back to ${submission.employee.user.name} with your note`);
			invalidate();
		},
		onError: (error) => toast.error(errorMessage(error, "Failed to reject work hours")),
	});
}

// Form values → API body ("YYYY-MM-DD" → UTC midnight, hours → number)
const toWorkLog = (values: LogHoursValues) => ({
	workDate: toIsoDay(values.workDate),
	hoursWorked: Number(values.hoursWorked),
	description: values.description,
});

function useInvalidateWorkLogs() {
	const queryClient = useQueryClient();
	return () => {
		void queryClient.invalidateQueries({ queryKey: ["submissions"] });
		void queryClient.invalidateQueries({ queryKey: ["tasks"] });
		void queryClient.invalidateQueries({ queryKey: ["analytics"] });
	};
}

export function useLogHours() {
	const invalidate = useInvalidateWorkLogs();
	return useMutation({
		mutationFn: (values: LogHoursValues) =>
			api.post<ApiSubmission>("/submissions", { taskId: values.taskId, ...toWorkLog(values) }),
		onSuccess: ({ data }) => {
			toast.success(`Logged ${toAmount(data.hoursWorked)} h on "${data.task.title}" — sent for review`);
			invalidate();
		},
		onError: (error) => toast.error(errorMessage(error, "Couldn't log your hours")),
	});
}

// Only the owner can edit, and only while the log is still pending
export function useUpdateWorkLog() {
	const invalidate = useInvalidateWorkLogs();
	return useMutation({
		mutationFn: ({ id, values }: { id: string; values: LogHoursValues }) =>
			api.patch<ApiSubmission>(`/submissions/${id}`, toWorkLog(values)),
		onSuccess: () => {
			toast.success("Work log updated");
			invalidate();
		},
		onError: (error) => toast.error(errorMessage(error, "Couldn't update your work log")),
	});
}
