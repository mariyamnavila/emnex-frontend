"use client";

import { useQuery } from "@tanstack/react-query";
import { api, toQuery } from "@/lib/api";
import type { AuditLog } from "@/types/audit-log.type";

export interface AuditLogParams {
	page?: number;
	entity?: string;
	action?: string;
	userId?: string;
}

export function useAuditLogs(params: AuditLogParams) {
	return useQuery({
		queryKey: ["audit-logs", params],
		queryFn: async () => {
			const res = await api.get<AuditLog[]>(`/audit-logs${toQuery({ ...params })}`);
			return { rows: res.data, meta: res.meta };
		},
		placeholderData: (prev) => prev,
	});
}
