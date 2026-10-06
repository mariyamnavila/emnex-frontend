"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, errorMessage, toQuery } from "@/lib/api";
import { toAmount } from "@/lib/pay";
import type {
	ApiEmployee,
	Employee,
	EmployeeAnalytics,
	EmployeeDetail,
	EmployeeOption,
	EmployeeStatus,
} from "@/types/employee.type";

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
				`/employees${toQuery({ ...params })}`,
			);
			return { rows: res.data.map(normalizePay), meta: res.meta };
		},
		placeholderData: (prev) => prev,
	});
}

// Every employee (any status) for pickers and filters
export function useEmployeeOptions() {
	return useQuery({
		queryKey: ["employees", "options"],
		queryFn: async () => {
			const { data } = await api.get<ApiEmployee[]>("/employees?limit=100");
			return data.map(normalizePay);
		},
		staleTime: 60 * 1000,
	});
}

// Only ACTIVE employees can be given tasks. Uses the pay-free /options endpoint,
// so a dispatcher with task.assign/create (but no employee.view) can pick an
// assignee without seeing salaries.
export function useActiveEmployees() {
	return useQuery({
		queryKey: ["employees", "assignable-options"],
		queryFn: async () => {
			const { data } = await api.get<EmployeeOption[]>("/employees/options");
			return data.filter((employee) => employee.status === "ACTIVE");
		},
		staleTime: 60 * 1000,
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

export interface UpdateEmployeePayload {
	departmentId?: string;
	jobTitle?: string;
	salaryType?: "MONTHLY" | "HOURLY";
	salary?: number;
	hourlyRate?: number;
	roleId?: string;
}

// Edit the details the backend allows (not name/email/role/joining date)
export function useUpdateEmployee() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, ...payload }: UpdateEmployeePayload & { id: string }) =>
			api.patch<ApiEmployee>(`/employees/${id}`, payload),
		onSuccess: ({ data }) => {
			toast.success(`${data.user.name} updated`);
			void queryClient.invalidateQueries({ queryKey: ["employees"] });
		},
		onError: (error) => toast.error(errorMessage(error, "Failed to update employee")),
	});
}

// Resets the employee's password to a new temporary one and emails it
// (the password isn't returned — it's only sent to their inbox)
export function useResendCredentials() {
	return useMutation({
		mutationFn: (id: string) =>
			api.post<{ temporaryPassword: string }>(`/employees/${id}/resend-credentials`),
		onError: (error) => toast.error(errorMessage(error, "Failed to resend credentials")),
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
