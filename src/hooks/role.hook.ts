"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, errorMessage } from "@/lib/api";
import { formatRoleName } from "@/lib/utils";
import type { Permission, Role, RoleDetail } from "@/types/role.type";
import type { RoleFormValues } from "@/validation/role.validation";

export function useRoles(enabled = true) {
	return useQuery({
		queryKey: ["roles"],
		queryFn: async () => {
			const { data } = await api.get<Role[]>("/roles");
			return data;
		},
		staleTime: 5 * 60 * 1000,
		enabled,
	});
}

export function useRole(id: string | null) {
	return useQuery({
		queryKey: ["roles", "detail", id],
		queryFn: async () => {
			const { data } = await api.get<RoleDetail>(`/roles/${id}`);
			return data;
		},
		enabled: Boolean(id),
	});
}

// The full permission catalog never changes at runtime
export function usePermissions() {
	return useQuery({
		queryKey: ["permissions"],
		queryFn: async () => {
			const { data } = await api.get<Permission[]>("/roles/permissions/all");
			return data;
		},
		staleTime: Number.POSITIVE_INFINITY,
	});
}

function useInvalidateRoles() {
	const queryClient = useQueryClient();
	return () => void queryClient.invalidateQueries({ queryKey: ["roles"] });
}

export function useCreateRole() {
	const invalidate = useInvalidateRoles();

	return useMutation({
		mutationFn: (values: RoleFormValues & { permissionIds: string[] }) =>
			api.post<Role>("/roles", {
				name: values.name,
				description: values.description || undefined,
				permissionIds: values.permissionIds,
			}),
		onSuccess: ({ data }) => {
			toast.success(`${formatRoleName(data.name)} role created`);
			invalidate();
		},
		onError: (error) => toast.error(errorMessage(error, "Failed to create role")),
	});
}

export function useUpdateRole() {
	const invalidate = useInvalidateRoles();

	return useMutation({
		mutationFn: ({ id, values }: { id: string; values: RoleFormValues }) =>
			api.patch<Role>(`/roles/${id}`, values),
		onSuccess: ({ data }) => {
			toast.success(`${formatRoleName(data.name)} updated`);
			invalidate();
		},
		onError: (error) => toast.error(errorMessage(error, "Failed to update role")),
	});
}

export function useDeleteRole() {
	const invalidate = useInvalidateRoles();

	return useMutation({
		mutationFn: (id: string) => api.delete(`/roles/${id}`),
		onSuccess: () => {
			toast.success("Role deleted");
			invalidate();
		},
		onError: (error) => toast.error(errorMessage(error, "Failed to delete role")),
	});
}

// Replaces the role's whole permission set
export function useAssignPermissions() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ roleId, permissionIds }: { roleId: string; permissionIds: string[] }) =>
			api.post<RoleDetail>(`/roles/${roleId}/permissions`, { permissionIds }),
		onSuccess: ({ data }) => {
			toast.success(`Permissions saved for ${formatRoleName(data.name)}`);
			void queryClient.invalidateQueries({ queryKey: ["roles"] });
		},
		onError: (error) => toast.error(errorMessage(error, "Failed to save permissions")),
	});
}

// Restore a built-in role's permissions to its default set
export function useResetRolePermissions() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (roleId: string) =>
			api.post<RoleDetail>(`/roles/${roleId}/reset-permissions`),
		onSuccess: ({ data }) => {
			toast.success(`${formatRoleName(data.name)} reset to its default permissions`);
			void queryClient.invalidateQueries({ queryKey: ["roles"] });
		},
		onError: (error) => toast.error(errorMessage(error, "Failed to reset permissions")),
	});
}
