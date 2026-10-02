"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, ApiError } from "@/lib/api";
import type { Department, Employee, EmployeeDetail } from "@/types/employee.type";

export interface RoleOption {
	id: string;
	name: string;
	description: string | null;
}

export interface CreateEmployeePayload {
	name: string;
	email: string;
	roleId: string;
	departmentId?: string;
	jobTitle: string;
	salaryType: "MONTHLY" | "HOURLY";
	salary?: number;
	hourlyRate?: number;
	joiningDate: string;
}

export interface EmployeeListParams {
	page?: number;
	search?: string;
	status?: string;
	departmentId?: string;
}

const buildQuery = (params: EmployeeListParams) => {
	const query = new URLSearchParams();
	if (params.page && params.page > 1) query.set("page", String(params.page));
	if (params.search) query.set("search", params.search);
	if (params.status) query.set("status", params.status);
	if (params.departmentId) query.set("departmentId", params.departmentId);
	const str = query.toString();
	return str ? `?${str}` : "";
};

const errorMessage = (error: Error, fallback: string) =>
	error instanceof ApiError ? error.message : fallback;

export function useEmployees(params: EmployeeListParams) {
	return useQuery({
		queryKey: ["employees", params],
		queryFn: async () => {
			const res = await api.get<Employee[]>(
				`/employees${buildQuery(params)}`,
			);
			return { rows: res.data, meta: res.meta };
		},
		placeholderData: (prev) => prev,
	});
}

export function useEmployee(id: string) {
	return useQuery({
		queryKey: ["employee", id],
		queryFn: async () => {
			const { data } = await api.get<EmployeeDetail>(`/employees/${id}`);
			return data;
		},
		enabled: Boolean(id),
	});
}

export function useDeleteEmployee() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => api.delete(`/employees/${id}`),
		onSuccess: () => {
			toast.success("Employee deleted");
			void queryClient.invalidateQueries({ queryKey: ["employees"] });
		},
		onError: (error) =>
			toast.error(errorMessage(error, "Failed to delete employee")),
	});
}

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

export function useRoles() {
	return useQuery({
		queryKey: ["roles"],
		queryFn: async () => {
			const { data } = await api.get<RoleOption[]>("/roles");
			return data;
		},
		staleTime: 5 * 60 * 1000,
	});
}

export function useCreateEmployee() {
	const router = useRouter();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: CreateEmployeePayload) =>
			api.post<Employee>("/employees", payload),
		onSuccess: ({ data: employee }) => {
			toast.success(
				`${employee.user.name} created — credentials sent to ${employee.user.email}`,
			);
			void queryClient.invalidateQueries({ queryKey: ["employees"] });
			router.push("/admin/employees");
		},
		onError: (error) =>
			toast.error(errorMessage(error, "Failed to create employee")),
	});
}
