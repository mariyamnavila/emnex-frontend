"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type {
	AdminDashboardStats,
	PayrollAnalytics,
	ProjectAnalytics,
} from "@/types/analytics.type";
import type { AuditLog } from "@/types/audit-log.type";

export function useAdminDashboard() {
	return useQuery({
		queryKey: ["analytics", "dashboard"],
		queryFn: async () => {
			const { data } = await api.get<AdminDashboardStats>("/analytics/dashboard");
			return data;
		},
	});
}

export function usePayrollAnalytics() {
	return useQuery({
		queryKey: ["analytics", "payroll"],
		queryFn: async () => {
			const { data } = await api.get<PayrollAnalytics>("/analytics/payroll");
			return data;
		},
	});
}

export function useProjectAnalytics() {
	return useQuery({
		queryKey: ["analytics", "projects"],
		queryFn: async () => {
			const { data } = await api.get<ProjectAnalytics>("/analytics/projects");
			return data;
		},
	});
}

const SESSION_ACTIONS = ["LOGIN", "LOGIN_FAILED", "GOOGLE_LOGIN", "LOGOUT"];

// Logins would crowd out real work, and the API can't exclude actions — filter here
export function useRecentActivity(limit = 6) {
	return useQuery({
		queryKey: ["audit-logs", "recent", limit],
		queryFn: async () => {
			const { data } = await api.get<AuditLog[]>("/audit-logs?limit=30");
			return data
				.filter((log) => !SESSION_ACTIONS.includes(log.action))
				.slice(0, limit);
		},
	});
}
