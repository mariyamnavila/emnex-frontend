"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, ApiError } from "@/lib/api";
import { toAmount } from "@/lib/pay";
import type { ApiSubmission, Submission, SubmissionStatus } from "@/types/submission.type";

const errorMessage = (error: Error, fallback: string) =>
	error instanceof ApiError ? error.message : fallback;

const normalize = (submission: ApiSubmission): Submission => ({
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
			return data.map((submission) => ({
				...submission,
				hoursWorked: toAmount(submission.hoursWorked) ?? 0,
			}));
		},
		enabled: Boolean(employeeId),
		retry: false,
	});
}

export interface SubmissionParams {
	page?: number;
	limit?: number;
	status?: SubmissionStatus;
	oldestFirst?: boolean;
}

export function useSubmissions(params: SubmissionParams) {
	return useQuery({
		queryKey: ["submissions", "list", params],
		queryFn: async () => {
			const query = new URLSearchParams();
			if (params.page && params.page > 1) query.set("page", String(params.page));
			if (params.limit) query.set("limit", String(params.limit));
			if (params.status) query.set("status", params.status);
			if (params.oldestFirst) query.set("sortOrder", "asc");
			const res = await api.get<ApiSubmission[]>(`/submissions?${query}`);
			return { rows: res.data.map(normalize), meta: res.meta };
		},
		placeholderData: (prev) => prev,
	});
}

// Reviews change the task's status and the dashboard counts too
function useInvalidateReviews() {
	const queryClient = useQueryClient();
	return () => {
		void queryClient.invalidateQueries({ queryKey: ["submissions"] });
		void queryClient.invalidateQueries({ queryKey: ["analytics"] });
		void queryClient.invalidateQueries({ queryKey: ["tasks"] });
		void queryClient.invalidateQueries({ queryKey: ["projects"] });
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
		onError: (error) => toast.error(errorMessage(error, "Failed to approve submission")),
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
		onError: (error) => toast.error(errorMessage(error, "Failed to reject submission")),
	});
}
