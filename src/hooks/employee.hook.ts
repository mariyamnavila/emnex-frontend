"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, ApiError } from "@/lib/api";
import { toAmount } from "@/lib/pay";
import type {
	ApiEmployee,
	Employee,
	EmployeeAnalytics,
	EmployeeDetail,
	EmployeeStatus,
} from "@/types/employee.type";

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

// POST /employees returns the new employee + a one-time password
// (also emailed, but the email can fail silently on the backend)
export interface CreateEmployeeResult {
	employee: Employee;
	temporaryPassword: string;
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

// Decimal strings ("4000") → numbers, once, so every screen can do math/formatting
const normalizePay = <T extends Employee>(raw: ApiEmployee<T>): T =>
	({
		...raw,
		salary: toAmount(raw.salary),
		hourlyRate: toAmount(raw.hourlyRate),
	}) as T;

export function useEmployees(params: EmployeeListParams) {
	return useQuery({
		queryKey: ["employees", params],
		queryFn: async () => {
			const res = await api.get<ApiEmployee[]>(
				`/employees${buildQuery(params)}`,
			);
			return { rows: res.data.map(normalizePay), meta: res.meta };
		},
		placeholderData: (prev) => prev,
	});
}

export function useEmployee(id: string) {
	return useQuery({
		queryKey: ["employees", "detail", id],
		queryFn: async () => {
			const { data } = await api.get<ApiEmployee<EmployeeDetail>>(
				`/employees/${id}`,
			);
			return normalizePay(data);
		},
		enabled: Boolean(id),
	});
}

// Headcount by status — feeds the stat cards on the employees page.
// Key starts with "employees" so creating/terminating refreshes it too.
export function useEmployeeAnalytics() {
	return useQuery({
		queryKey: ["employees", "analytics"],
		queryFn: async () => {
			const { data } = await api.get<EmployeeAnalytics>("/analytics/employees");
			return data;
		},
	});
}

export function useUpdateEmployeeStatus() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, status }: { id: string; status: EmployeeStatus }) =>
			api.patch<ApiEmployee>(`/employees/${id}`, { status }),
		onSuccess: ({ data }) => {
			toast.success(`${data.user.name} is now ${data.status.toLowerCase()}`);
			void queryClient.invalidateQueries({ queryKey: ["employees"] });
		},
		onError: (error) =>
			toast.error(errorMessage(error, "Failed to change status")),
	});
}

// Backend "delete" is a soft delete: status → TERMINATED, records are kept
export function useTerminateEmployee() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => api.delete(`/employees/${id}`),
		onSuccess: () => {
			toast.success("Employee terminated");
			void queryClient.invalidateQueries({ queryKey: ["employees"] });
		},
		onError: (error) =>
			toast.error(errorMessage(error, "Failed to terminate employee")),
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

// The caller decides what to do after success (the wizard shows the password first)
export function useCreateEmployee() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (payload: CreateEmployeePayload) => {
			const res = await api.post<
				Omit<CreateEmployeeResult, "employee"> & { employee: ApiEmployee }
			>("/employees", payload);
			const data: CreateEmployeeResult = {
				...res.data,
				employee: normalizePay(res.data.employee),
			};
			return { ...res, data };
		},
		onSuccess: ({ data }) => {
			toast.success(`${data.employee.user.name} created`);
			void queryClient.invalidateQueries({ queryKey: ["employees"] });
		},
		onError: (error) =>
			toast.error(errorMessage(error, "Failed to create employee")),
	});
}
