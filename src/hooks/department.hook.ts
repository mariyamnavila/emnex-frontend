"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, errorMessage } from "@/lib/api";
import type { ApiEmployee, Department } from "@/types/employee.type";
import type { DepartmentFormValues } from "@/validation/department.validation";


export function useDepartments() {
	return useQuery({
		queryKey: ["departments"],
		queryFn: async () => {
			const { data } = await api.get<Department[]>("/departments");
			return data;
		},
		staleTime: 5 * 60 * 1000,
	});
}

export function useDepartmentMembers(id: string | null) {
	return useQuery({
		queryKey: ["departments", "members", id],
		queryFn: async () => {
			const { data } = await api.get<ApiEmployee[]>(`/departments/${id}/employees`);
			return data;
		},
		enabled: Boolean(id),
	});
}

// Department names show up in employee lists/analytics too
function useInvalidateDepartments() {
	const queryClient = useQueryClient();
	return () => {
		void queryClient.invalidateQueries({ queryKey: ["departments"] });
		void queryClient.invalidateQueries({ queryKey: ["employees"] });
	};
}

export function useCreateDepartment() {
	const invalidate = useInvalidateDepartments();

	return useMutation({
		mutationFn: (values: DepartmentFormValues) =>
			api.post<Department>("/departments", {
				name: values.name,
				description: values.description || undefined,
			}),
		onSuccess: ({ data }) => {
			toast.success(`${data.name} created`);
			invalidate();
		},
		onError: (error) => toast.error(errorMessage(error, "Failed to create department")),
	});
}

export function useUpdateDepartment() {
	const invalidate = useInvalidateDepartments();

	return useMutation({
		mutationFn: ({ id, values }: { id: string; values: DepartmentFormValues }) =>
			api.patch<Department>(`/departments/${id}`, values),
		onSuccess: ({ data }) => {
			toast.success(`${data.name} updated`);
			invalidate();
		},
		onError: (error) => toast.error(errorMessage(error, "Failed to update department")),
	});
}

export function useDeleteDepartment() {
	const invalidate = useInvalidateDepartments();

	return useMutation({
		mutationFn: (id: string) => api.delete(`/departments/${id}`),
		onSuccess: () => {
			toast.success("Department deleted");
			invalidate();
		},
		onError: (error) => toast.error(errorMessage(error, "Failed to delete department")),
	});
}
