"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { formatStatus } from "@/components/shared/status-badge";
import { toIsoDay } from "@/lib/utils";
import { api, errorMessage, toQuery } from "@/lib/api";
import { toAmount } from "@/lib/pay";
import type { ApiSubmission, Submission } from "@/types/submission.type";
import type { ApiBoardTask, ApiMyTask, ApiTask, BoardTask, MyTask, TaskStatus } from "@/types/task.type";
import type { TaskFormValues } from "@/validation/task.validation";

export interface TaskBoardParams {
	search?: string;
	projectId?: string;
	employeeId?: string;
	priority?: string;
}

export const BOARD_LIMIT = 200;

// The board groups by status itself, so it loads every matching task at once
export function useTaskBoard(params: TaskBoardParams) {
	return useQuery({
		queryKey: ["tasks", "board", params],
		queryFn: async () => {
			const res = await api.get<ApiBoardTask[]>(`/tasks${toQuery({ limit: BOARD_LIMIT, ...params })}`);
			const tasks: BoardTask[] = res.data.map((task) => ({
				...task,
				estimatedHours: toAmount(task.estimatedHours),
			}));
			return { tasks, total: res.meta?.total ?? tasks.length };
		},
		placeholderData: (prev) => prev,
		// Someone else assigns/moves tasks, so refresh without a manual reload
		refetchOnWindowFocus: true,
		refetchInterval: 60 * 1000,
	});
}

// The signed-in employee's tasks (403 for suspended accounts)
export function useMyTasks() {
	return useQuery({
		queryKey: ["tasks", "my"],
		queryFn: async () => {
			const { data } = await api.get<ApiMyTask[]>("/tasks/my");
			return data.map((task): MyTask => ({ ...task, estimatedHours: toAmount(task.estimatedHours) }));
		},
		// A task assigned by someone else should appear without a manual reload
		refetchOnWindowFocus: true,
		refetchInterval: 60 * 1000,
	});
}

export function useTaskSubmissions(taskId: string | null) {
	return useQuery({
		queryKey: ["submissions", "task", taskId],
		queryFn: async () => {
			const { data } = await api.get<Omit<ApiSubmission, "task">[]>(`/tasks/${taskId}/submissions`);
			return data.map(
				(submission): Omit<Submission, "task"> => ({
					...submission,
					hoursWorked: toAmount(submission.hoursWorked) ?? 0,
				}),
			);
		},
		enabled: Boolean(taskId),
	});
}

// Tasks live inside the project detail; counts feed project lists and analytics
function useInvalidateTasks() {
	const queryClient = useQueryClient();
	return () => {
		void queryClient.invalidateQueries({ queryKey: ["projects"] });
		void queryClient.invalidateQueries({ queryKey: ["tasks"] });
		void queryClient.invalidateQueries({ queryKey: ["analytics"] });
	};
}

export function useCreateTask(projectId: string) {
	const invalidate = useInvalidateTasks();

	return useMutation({
		mutationFn: (values: TaskFormValues) =>
			api.post<ApiTask>("/tasks", {
				projectId,
				employeeId: values.employeeId,
				title: values.title,
				description: values.description || undefined,
				priority: values.priority,
				estimatedHours: values.estimatedHours ? Number(values.estimatedHours) : undefined,
				dueDate: values.dueDate ? toIsoDay(values.dueDate) : undefined,
			}),
		onSuccess: ({ data }) => {
			toast.success(`Task assigned to ${data.employee.user.name}`);
			invalidate();
		},
		onError: (error) => toast.error(errorMessage(error, "Failed to create task")),
	});
}

// Edit a task's details (not its assignee — that's the assign endpoint — or status)
export function useUpdateTask(id: string) {
	const invalidate = useInvalidateTasks();

	return useMutation({
		mutationFn: (values: TaskFormValues) =>
			api.patch<ApiTask>(`/tasks/${id}`, {
				title: values.title,
				description: values.description || undefined,
				priority: values.priority,
				estimatedHours: values.estimatedHours ? Number(values.estimatedHours) : undefined,
				dueDate: values.dueDate ? toIsoDay(values.dueDate) : undefined,
			}),
		onSuccess: ({ data }) => {
			toast.success(`"${data.title}" updated`);
			invalidate();
		},
		onError: (error) => toast.error(errorMessage(error, "Failed to update task")),
	});
}

export function useAssignTask() {
	const invalidate = useInvalidateTasks();

	return useMutation({
		mutationFn: ({ id, employeeId }: { id: string; employeeId: string }) =>
			api.post<ApiTask>(`/tasks/${id}/assign`, { employeeId }),
		onSuccess: ({ data }) => {
			toast.success(`Reassigned to ${data.employee.user.name}`);
			invalidate();
		},
		onError: (error) => toast.error(errorMessage(error, "Failed to reassign task")),
	});
}

export function useUpdateTaskStatus() {
	const invalidate = useInvalidateTasks();

	return useMutation({
		mutationFn: ({ id, status }: { id: string; status: TaskStatus }) =>
			api.patch<ApiTask>(`/tasks/${id}/status`, { status }),
		onSuccess: ({ data }) => {
			toast.success(`"${data.title}" is now ${formatStatus(data.status).toLowerCase()}`);
			invalidate();
		},
		onError: (error) => toast.error(errorMessage(error, "Failed to change task status")),
	});
}

export function useDeleteTask() {
	const invalidate = useInvalidateTasks();

	return useMutation({
		mutationFn: (id: string) => api.delete(`/tasks/${id}`),
		onSuccess: () => {
			toast.success("Task deleted");
			invalidate();
		},
		onError: (error) => toast.error(errorMessage(error, "Failed to delete task")),
	});
}
