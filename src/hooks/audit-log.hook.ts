"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { AuditLog } from "@/types/audit-log.type";

export interface AuditLogParams {
	page?: number;
	entity?: string;
	action?: string;
	userId?: string;
}

const buildQuery = (params: AuditLogParams) => {
	const query = new URLSearchParams();
	if (params.page && params.page > 1) query.set("page", String(params.page));
	if (params.entity) query.set("entity", params.entity);
	if (params.action) query.set("action", params.action);
	if (params.userId) query.set("userId", params.userId);
	const str = query.toString();
	return str ? `?${str}` : "";
};

export function useAuditLogs(params: AuditLogParams) {
	return useQuery({
		queryKey: ["audit-logs", params],
		queryFn: async () => {
			const res = await api.get<AuditLog[]>(`/audit-logs${buildQuery(params)}`);
			return { rows: res.data, meta: res.meta };
		},
		placeholderData: (prev) => prev,
	});
}
