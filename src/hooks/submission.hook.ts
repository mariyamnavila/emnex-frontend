"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toAmount } from "@/lib/pay";

interface ApiApprovedSubmission {
	id: string;
	workDate: string;
	hoursWorked: string | number;
}

// An employee's approved work logs — the hours hourly payroll is paid from
export function useApprovedSubmissions(employeeId: string | null) {
	return useQuery({
		queryKey: ["submissions", "approved", employeeId],
		queryFn: async () => {
			const { data } = await api.get<ApiApprovedSubmission[]>(
				`/submissions?employeeId=${employeeId}&status=APPROVED&limit=100`,
			);
			return data.map((submission) => ({
				...submission,
				hoursWorked: toAmount(submission.hoursWorked) ?? 0,
			}));
		},
		enabled: Boolean(employeeId),
		retry: false,
	});
}
