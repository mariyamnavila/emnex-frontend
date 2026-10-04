"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, errorMessage, toQuery } from "@/lib/api";
import type { MyPayroll, Payroll } from "@/types/payroll.type";
import type { GeneratePayrollValues } from "@/validation/payroll.validation";

export interface PayrollListParams {
	page?: number;
	status?: string;
	employeeId?: string;
}

// "2026-10" → whole month in UTC, last day included up to 23:59:59.999
export function monthToRange(period: string) {
	const [year, month] = period.split("-").map(Number);
	return {
		periodStart: new Date(Date.UTC(year, month - 1, 1)).toISOString(),
		periodEnd: new Date(Date.UTC(year, month, 0, 23, 59, 59, 999)).toISOString(),
	};
}

export function usePayrolls(params: PayrollListParams) {
	return useQuery({
		queryKey: ["payroll", params],
		queryFn: async () => {
			const res = await api.get<Payroll[]>(`/payroll${toQuery({ ...params })}`);
			return { rows: res.data, meta: res.meta };
		},
		placeholderData: (prev) => prev,
	});
}

// The signed-in employee's payslips (money already numbers)
export function useMyPayrolls() {
	return useQuery({
		queryKey: ["payroll", "my"],
		queryFn: async () => {
			const { data } = await api.get<MyPayroll[]>("/payroll/my");
			return data;
		},
	});
}

function useInvalidatePayroll() {
	const queryClient = useQueryClient();
	return () => {
		void queryClient.invalidateQueries({ queryKey: ["payroll"] });
		void queryClient.invalidateQueries({ queryKey: ["analytics"] });
		void queryClient.invalidateQueries({ queryKey: ["employees"] });
	};
}

export function useGeneratePayroll() {
	const invalidate = useInvalidatePayroll();

	return useMutation({
		mutationFn: (values: GeneratePayrollValues) =>
			api.post<Payroll>("/payroll/generate", {
				employeeId: values.employeeId,
				...monthToRange(values.period),
				deductions: values.deductions ? Number(values.deductions) : undefined,
			}),
		onSuccess: ({ data }) => {
			toast.success(`Payroll drafted for ${data.employee.user.name}`);
			invalidate();
		},
		onError: (error) => toast.error(errorMessage(error, "Failed to generate payroll")),
	});
}

export function useApprovePayroll() {
	const invalidate = useInvalidatePayroll();

	return useMutation({
		mutationFn: (id: string) => api.post<Payroll>(`/payroll/${id}/approve`),
		onSuccess: ({ data }) => {
			toast.success(`Payroll approved for ${data.employee.user.name}`);
			invalidate();
		},
		onError: (error) => toast.error(errorMessage(error, "Failed to approve payroll")),
	});
}

export function useRejectPayroll() {
	const invalidate = useInvalidatePayroll();

	return useMutation({
		mutationFn: (id: string) => api.post<Payroll>(`/payroll/${id}/reject`),
		onSuccess: ({ data }) => {
			toast.success(`Payroll rejected for ${data.employee.user.name}`);
			invalidate();
		},
		onError: (error) => toast.error(errorMessage(error, "Failed to reject payroll")),
	});
}
