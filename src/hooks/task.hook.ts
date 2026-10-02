"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { formatStatus } from "@/components/shared";
import { api, ApiError } from "@/lib/api";
import type { ApiTask, TaskStatus } from "@/types/task.type";
import type { TaskFormValues } from "@/validation/task.validation";

const errorMessage = (error: Error, fallback: string) =>
	error instanceof ApiError ? error.message : fallback;

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
				dueDate: values.dueDate ? `${values.dueDate}T00:00:00.000Z` : undefined,
			}),
		onSuccess: ({ data }) => {
			toast.success(`Task assigned to ${data.employee.user.name}`);
			invalidate();
		},
		onError: (error) => toast.error(errorMessage(error, "Failed to create task")),
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
