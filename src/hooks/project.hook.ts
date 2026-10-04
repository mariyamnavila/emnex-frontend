"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { toIsoDay } from "@/lib/utils";
import { api, errorMessage, toQuery } from "@/lib/api";
import { toAmount } from "@/lib/pay";
import type {
	ApiProject,
	ApiProjectDetail,
	Project,
	ProjectDetail,
} from "@/types/project.type";
import type { ProjectFormValues } from "@/validation/project.validation";

export interface ProjectListParams {
	page?: number;
	search?: string;
	status?: string;
}

const normalizeProject = (raw: ApiProject): Project => ({
	...raw,
	budget: toAmount(raw.budget),
});

// Empty dates are omitted (the backend can't clear them)
const optionalDay = (day: string) => (day ? toIsoDay(day) : undefined);

const toPayload = (values: ProjectFormValues) => ({
	name: values.name,
	startDate: optionalDay(values.startDate),
	endDate: optionalDay(values.endDate),
	budget: values.budget ? Number(values.budget) : undefined,
});

export function useProjects(params: ProjectListParams) {
	return useQuery({
		queryKey: ["projects", params],
		queryFn: async () => {
			const res = await api.get<ApiProject[]>(`/projects${toQuery({ ...params })}`);
			return { rows: res.data.map(normalizeProject), meta: res.meta };
		},
		placeholderData: (prev) => prev,
	});
}

// Every project, for filter dropdowns
export function useProjectOptions() {
	return useQuery({
		queryKey: ["projects", "options"],
		queryFn: async () => {
			const { data } = await api.get<ApiProject[]>("/projects?limit=100");
			return data.map(normalizeProject);
		},
		staleTime: 60 * 1000,
	});
}

export function useProject(id: string) {
	return useQuery({
		queryKey: ["projects", "detail", id],
		queryFn: async (): Promise<ProjectDetail> => {
			const { data } = await api.get<ApiProjectDetail>(`/projects/${id}`);
			return {
				...normalizeProject(data),
				// The API also returns soft-deleted tasks
				tasks: data.tasks
					.filter((task) => task.deletedAt === null)
					.map((task) => ({ ...task, estimatedHours: toAmount(task.estimatedHours) })),
			};
		},
	});
}

// Project counts feed the overview and the projects stat cards
function useInvalidateProjects() {
	const queryClient = useQueryClient();
	return () => {
		void queryClient.invalidateQueries({ queryKey: ["projects"] });
		void queryClient.invalidateQueries({ queryKey: ["analytics"] });
	};
}

export function useCreateProject() {
	const invalidate = useInvalidateProjects();

	return useMutation({
		mutationFn: (values: ProjectFormValues) =>
			api.post<ApiProject>("/projects", {
				...toPayload(values),
				description: values.description || undefined,
			}),
		onSuccess: ({ data }) => {
			toast.success(`${data.name} created`);
			invalidate();
		},
		onError: (error) => toast.error(errorMessage(error, "Failed to create project")),
	});
}

export function useUpdateProject() {
	const invalidate = useInvalidateProjects();

	return useMutation({
		mutationFn: ({ id, values }: { id: string; values: ProjectFormValues }) =>
			api.patch<ApiProject>(`/projects/${id}`, {
				...toPayload(values),
				description: values.description,
				status: values.status,
			}),
		onSuccess: ({ data }) => {
			toast.success(`${data.name} updated`);
			invalidate();
		},
		onError: (error) => toast.error(errorMessage(error, "Failed to update project")),
	});
}

export function useDeleteProject() {
	const invalidate = useInvalidateProjects();

	return useMutation({
		mutationFn: (id: string) => api.delete(`/projects/${id}`),
		onSuccess: () => {
			toast.success("Project deleted");
			invalidate();
		},
		onError: (error) => toast.error(errorMessage(error, "Failed to delete project")),
	});
}
