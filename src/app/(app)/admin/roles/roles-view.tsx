"use client";

import { useRef, useState } from "react";
import { AlertCircle, Pencil, Plus, ShieldCheck, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState, PageHeader } from "@/components/shared";
import { PermissionEditor } from "@/components/roles/permission-editor";
import { RoleFormDialog } from "@/components/roles/role-form-dialog";
import { useCan, useGetMe } from "@/hooks/auth.hook";
import { useDeleteRole, useRoles } from "@/hooks/role.hook";
import { useUrlFilters } from "@/hooks/use-url-filters";
import { cn, formatRoleName, plural } from "@/lib/utils";
import type { Role } from "@/types/role.type";

const SYSTEM_ORDER = ["ADMIN", "HR_MANAGER", "FINANCE_MANAGER", "EMPLOYEE"];

// Built-in roles first in a fixed order, then custom roles A–Z
const sortRoles = (roles: Role[]) =>
	[...roles].sort((a, b) => {
		if (a.isSystem !== b.isSystem) return a.isSystem ? -1 : 1;
		if (a.isSystem) return SYSTEM_ORDER.indexOf(a.name) - SYSTEM_ORDER.indexOf(b.name);
		return a.name.localeCompare(b.name);
	});


export function RolesView() {
	const { get, apply } = useUrlFilters();
	const { data: me } = useGetMe();
	const can = useCan();

	const { data: roles = [], isLoading, isError, refetch } = useRoles();
	const deleteRole = useDeleteRole();
	const editorRef = useRef<HTMLDivElement>(null);

	const [formOpen, setFormOpen] = useState(false);
	const [editing, setEditing] = useState<Role | null>(null);
	const [pendingDelete, setPendingDelete] = useState<Role | null>(null);

	const sorted = sortRoles(roles);
	const selected = sorted.find((role) => role.id === get("role")) ?? sorted[0] ?? null;

	function selectRole(id: string) {
		apply({ role: id });
		// Phones: the editor sits below the list
		if (window.innerWidth < 1024) {
			requestAnimationFrame(() => editorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
		}
	}

	function openCreate() {
		setEditing(null);
		setFormOpen(true);
	}

	let readOnlyReason: string | null = null;
	if (selected && selected.id === me?.role.id) {
		readOnlyReason = "This is your own role. You can't change its permissions, so you can't lock yourself out.";
	} else if (!can("permission.assign")) {
		readOnlyReason = "You can view this role's permissions but not change them.";
	}

	return (
		<div className="space-y-6">
			<PageHeader
				title="Roles & Permissions"
				description="Decide exactly what each role can see and do."
				actions={
					can("role.create") ? (
						<Button
							onClick={openCreate}
							className="h-9 bg-[#2563EB] text-sm font-semibold text-white shadow-none hover:bg-[#1D4ED8]"
						>
							<Plus className="size-4" />
							New role
						</Button>
					) : null
				}
			/>

			{isLoading ? (
				<div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
					<div className="space-y-2">
						{Array.from({ length: 4 }).map((_, i) => (
							<Skeleton key={`role-${i}`} className="h-16 rounded-lg bg-[#F1F5F9] dark:bg-[#1E293B]" />
						))}
					</div>
					<Skeleton className="h-96 rounded-lg bg-[#F1F5F9] dark:bg-[#1E293B]" />
				</div>
			) : isError || !selected ? (
				<EmptyState
					icon={AlertCircle}
					title="Couldn't load roles"
					description="Check your connection and try again."
					action={
						<Button variant="outline" onClick={() => void refetch()}>
							Try again
						</Button>
					}
					className="rounded-lg border border-[#E2E8F0] bg-white dark:border-[#1E293B] dark:bg-[#0F172A]"
				/>
			) : (
				<div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
					<nav aria-label="Roles" className="space-y-2 lg:sticky lg:top-20 lg:self-start">
						{sorted.map((role) => {
							const isActive = role.id === selected.id;
							const isOwn = role.id === me?.role.id;
							return (
								<button
									key={role.id}
									type="button"
									aria-current={isActive ? "true" : undefined}
									onClick={() => selectRole(role.id)}
									className={cn(
										"w-full rounded-lg border p-3 text-left transition-colors focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:outline-none",
										isActive
											? "border-[#BFDBFE] bg-[#EFF6FF] dark:border-[#1E3A5F] dark:bg-[#1E293B]"
											: "border-[#E2E8F0] bg-white hover:border-[#CBD5E1] dark:border-[#1E293B] dark:bg-[#0F172A]",
									)}
								>
									<span className="flex items-center justify-between gap-2">
										<span
											className={cn(
												"truncate text-sm font-semibold",
												isActive ? "text-[#1D4ED8] dark:text-[#93C5FD]" : "text-[#0F172A] dark:text-white",
											)}
										>
											{formatRoleName(role.name)}
										</span>
										<span className="shrink-0 rounded-full border border-[#E2E8F0] bg-white px-1.5 py-px text-[10px] font-semibold tracking-wider text-[#64748B] uppercase dark:border-[#1E293B] dark:bg-[#0F172A]">
											{role.isSystem ? "Built-in" : "Custom"}
										</span>
									</span>
									<span className="mt-1 block text-xs text-[#64748B] tabular-nums dark:text-[#94A3B8]">
										{plural(role._count.users, "user")} · {plural(role._count.permissions, "permission")}
										{isOwn ? <span className="font-medium text-[#2563EB]"> · Your role</span> : null}
									</span>
								</button>
							);
						})}
					</nav>

					<div ref={editorRef} className="@container min-w-0 scroll-mt-20 space-y-4">
						<div className="flex flex-col gap-4 rounded-lg border border-[#E2E8F0] bg-white p-4 shadow-2xs @2xl:flex-row @2xl:items-start @2xl:justify-between sm:p-5 dark:border-[#1E293B] dark:bg-[#0F172A]">
							<div className="min-w-0">
								<div className="flex flex-wrap items-center gap-2">
									<ShieldCheck className="size-5 text-[#2563EB]" aria-hidden="true" />
									<h2 className="text-lg font-semibold tracking-tight text-[#0F172A] dark:text-white">
										{formatRoleName(selected.name)}
									</h2>
								</div>
								<p className="mt-1 text-sm text-[#64748B] dark:text-[#94A3B8]">
									{selected.description || "No description"}
								</p>
								<p className="mt-2 flex items-center gap-1.5 text-xs text-[#64748B] tabular-nums dark:text-[#94A3B8]">
									<Users className="size-3.5" aria-hidden="true" />
									{plural(selected._count.users, "user")} with this role
								</p>
							</div>
							{!selected.isSystem && (can("role.update") || can("role.delete")) ? (
								<div className="flex shrink-0 gap-2">
									{can("role.update") ? (
										<Button
											variant="outline"
											className="h-9 border-[#E2E8F0] text-sm"
											onClick={() => {
												setEditing(selected);
												setFormOpen(true);
											}}
										>
											<Pencil className="size-4" />
											Edit
										</Button>
									) : null}
									{can("role.delete") ? (
										<Button
											variant="outline"
											disabled={selected._count.users > 0}
											title={selected._count.users > 0 ? "Move its users to another role first" : undefined}
											className="h-9 border-[#E2E8F0] text-sm text-[#DC2626] hover:bg-[#FEF2F2] hover:text-[#DC2626]"
											onClick={() => setPendingDelete(selected)}
										>
											<Trash2 className="size-4" />
											Delete
										</Button>
									) : null}
								</div>
							) : null}
						</div>

						<PermissionEditor
							key={selected.id}
							roleId={selected.id}
							userCount={selected._count.users}
							readOnlyReason={readOnlyReason}
						/>
					</div>
				</div>
			)}

			<RoleFormDialog
				open={formOpen}
				onOpenChange={setFormOpen}
				role={editing}
				onCreated={(role) => apply({ role: role.id })}
			/>

			<Dialog
				open={pendingDelete !== null}
				onOpenChange={(open) => {
					if (!open) setPendingDelete(null);
				}}
			>
				<DialogContent className="border-[#E2E8F0] bg-white dark:border-[#1E293B] dark:bg-[#0F172A]">
					<DialogHeader>
						<DialogTitle className="text-[#0F172A] dark:text-white">Delete role?</DialogTitle>
						<DialogDescription>
							{pendingDelete
								? `${formatRoleName(pendingDelete.name)} and its permission set will be removed.`
								: null}
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button variant="outline" onClick={() => setPendingDelete(null)}>
							Cancel
						</Button>
						<Button
							variant="destructive"
							disabled={deleteRole.isPending}
							onClick={() => {
								if (!pendingDelete) return;
								deleteRole.mutate(pendingDelete.id, {
									onSuccess: () => apply({ role: null }),
									onSettled: () => setPendingDelete(null),
								});
							}}
						>
							{deleteRole.isPending ? "Deleting..." : "Delete"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
