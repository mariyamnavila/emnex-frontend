"use client";

import { type QueryKey, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { toIsoDay } from "@/lib/utils";
import { type ApiEnvelope, api, errorMessage, toQuery } from "@/lib/api";
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

type SubmissionList = { rows: Submission[]; meta?: ApiEnvelope<unknown>["meta"] };
type ListSnapshot = [QueryKey, SubmissionList | undefined][];

// Optimistic review: the log leaves "pending" lists and shows its new status
// everywhere else at once; rollback() restores the lists if the API refuses
function useOptimisticReview() {
	const queryClient = useQueryClient();
	const listKey = ["submissions", "list"];

	const apply = async (id: string, status: SubmissionStatus, reviewNote?: string): Promise<ListSnapshot> => {
		await queryClient.cancelQueries({ queryKey: listKey });
		const snapshot = queryClient.getQueriesData<SubmissionList>({ queryKey: listKey });
		for (const [key, list] of snapshot) {
			if (!list?.rows.some((row) => row.id === id)) continue;
			const filter = (key[2] as SubmissionParams | undefined)?.status;
			const rows =
				filter === "PENDING"
					? list.rows.filter((row) => row.id !== id)
					: list.rows.map((row) => (row.id === id ? { ...row, status, reviewNote: reviewNote ?? row.reviewNote } : row));
			const meta =
				filter === "PENDING" && list.meta ? { ...list.meta, total: Math.max(0, list.meta.total - 1) } : list.meta;
			queryClient.setQueryData<SubmissionList>(key, { rows, meta });
		}
		return snapshot;
	};

	const rollback = (snapshot?: ListSnapshot) => {
		for (const [key, list] of snapshot ?? []) queryClient.setQueryData(key, list);
	};

	// Reviews change the dashboard counts too (the task's own status is untouched)
	const sync = () => {
		void queryClient.invalidateQueries({ queryKey: ["submissions"] });
		void queryClient.invalidateQueries({ queryKey: ["analytics"] });
	};

	return { apply, rollback, sync };
}

export function useApproveSubmission() {
	const review = useOptimisticReview();
	return useMutation({
		mutationFn: (submission: Submission) => api.post(`/submissions/${submission.id}/approve`),
		onMutate: (submission) => review.apply(submission.id, "APPROVED"),
		onSuccess: (_, submission) => {
			toast.success(`Approved ${submission.hoursWorked} h for ${submission.employee.user.name}`);
		},
		onError: (error, _, snapshot) => {
			review.rollback(snapshot);
			toast.error(errorMessage(error, "Failed to approve work hours"));
		},
		onSettled: review.sync,
	});
}

export function useRejectSubmission() {
	const review = useOptimisticReview();
	return useMutation({
		mutationFn: ({ submission, reason }: { submission: Submission; reason: string }) =>
			api.post(`/submissions/${submission.id}/reject`, { reason }),
		onMutate: ({ submission, reason }) => review.apply(submission.id, "REJECTED", reason),
		onSuccess: (_, { submission }) => {
			toast.success(`Sent back to ${submission.employee.user.name} with your note`);
		},
		onError: (error, _, snapshot) => {
			review.rollback(snapshot);
			toast.error(errorMessage(error, "Failed to reject work hours"));
		},
		onSettled: review.sync,
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
