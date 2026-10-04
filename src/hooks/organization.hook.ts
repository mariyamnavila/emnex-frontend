"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, errorMessage } from "@/lib/api";
import type { Organization } from "@/types/organization.type";
import type { OrganizationEditValues } from "@/validation/organization.validation";

// GET /organizations/me — the signed-in user's org + counts (any authenticated user)
export function useMyOrganization() {
	return useQuery({
		queryKey: ["organization", "me"],
		queryFn: async () => {
			const { data } = await api.get<Organization>("/organizations/me");
			return data;
		},
	});
}

export function useUpdateOrganization(id: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (values: OrganizationEditValues) => api.patch<Organization>(`/organizations/${id}`, values),
		onSuccess: () => {
			toast.success("Organization updated");
			void queryClient.invalidateQueries({ queryKey: ["organization"] });
			// The sidebar/header read the org name from /auth/me
			void queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
		},
		onError: (error) => toast.error(errorMessage(error, "Failed to update organization")),
	});
}
