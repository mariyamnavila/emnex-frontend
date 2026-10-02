"use client";

import { useState } from "react";
import {
	AlertCircle,
	Building2,
	MoreHorizontal,
	Pencil,
	Plus,
	Trash2,
	Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState, PageHeader, SearchInput } from "@/components/shared";
import { DepartmentFormDialog } from "@/components/departments/department-form-dialog";
import { DepartmentMembersSheet } from "@/components/departments/department-members-sheet";
import { useGetMe } from "@/hooks/auth.hook";
import { useDeleteDepartment, useDepartments } from "@/hooks/department.hook";
import { useUrlFilters } from "@/hooks/use-url-filters";
import { formatDate } from "@/lib/utils";
import type { Department } from "@/types/employee.type";

const memberCount = (department: Department) => department._count?.employees ?? 0;

export function DepartmentsView() {
	const { get, apply } = useUrlFilters();
	const search = get("search").trim().toLowerCase();

	const { data: me } = useGetMe();
	const can = (permission: string) => me?.permissions.includes(permission) ?? false;

	const { data: departments = [], isLoading, isError, refetch } = useDepartments();
	const deleteDepartment = useDeleteDepartment();

	const [formOpen, setFormOpen] = useState(false);
	const [editing, setEditing] = useState<Department | null>(null);
	const [viewing, setViewing] = useState<Department | null>(null);
	const [membersOpen, setMembersOpen] = useState(false);
	const [pendingDelete, setPendingDelete] = useState<Department | null>(null);

	const visible = search
		? departments.filter(
				(department) =>
					department.name.toLowerCase().includes(search) ||
					department.description?.toLowerCase().includes(search),
			)
		: departments;
	const assigned = departments.reduce((sum, department) => sum + memberCount(department), 0);

	function openCreate() {
		setEditing(null);
		setFormOpen(true);
	}

	function openEdit(department: Department) {
		setEditing(department);
		setFormOpen(true);
	}

	function openMembers(department: Department) {
		setViewing(department);
		setMembersOpen(true);
	}

	let content;
	if (isLoading) {
		content = (
			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
				{Array.from({ length: 6 }).map((_, i) => (
					<Skeleton key={`dept-${i}`} className="h-40 rounded-lg bg-[#F1F5F9] dark:bg-[#1E293B]" />
				))}
			</div>
		);
	} else if (isError) {
		content = (
			<EmptyState
				icon={AlertCircle}
				title="Couldn't load departments"
				description="Check your connection and try again."
				action={
					<Button variant="outline" onClick={() => void refetch()}>
						Try again
					</Button>
				}
				className="rounded-lg border border-[#E2E8F0] bg-white dark:border-[#1E293B] dark:bg-[#0F172A]"
			/>
		);
	} else if (visible.length === 0) {
		content = (
			<EmptyState
				icon={Building2}
				title={search ? "No departments match your search" : "No departments yet"}
				description={
					search
						? "Try a different name."
						: "Create departments to organize employees into teams."
				}
				action={
					search ? (
						<Button variant="outline" onClick={() => apply({ search: null })}>
							Clear search
						</Button>
					) : can("department.create") ? (
						<Button
							onClick={openCreate}
							className="bg-[#2563EB] text-white shadow-none hover:bg-[#1D4ED8]"
						>
							<Plus className="size-4" />
							New department
						</Button>
					) : null
				}
				className="rounded-lg border border-[#E2E8F0] bg-white dark:border-[#1E293B] dark:bg-[#0F172A]"
			/>
		);
	} else {
		content = (
			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
				{visible.map((department) => {
					const count = memberCount(department);
					const showMenu = can("department.update") || can("department.delete");
					return (
						<article
							key={department.id}
							className="relative flex flex-col rounded-lg border border-[#E2E8F0] bg-white p-5 shadow-2xs transition-colors hover:border-[#CBD5E1] dark:border-[#1E293B] dark:bg-[#0F172A] dark:hover:border-[#334155]"
						>
							{/* Whole card opens the members sheet; the menu sits above it */}
							<button
								type="button"
								onClick={() => openMembers(department)}
								aria-label={`View members of ${department.name}`}
								className="absolute inset-0 rounded-lg focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:outline-none"
							/>

							<div className="flex items-start gap-3">
								<div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-[#EFF6FF] text-[#2563EB] dark:bg-[#1E293B] dark:text-[#60A5FA]">
									<Building2 className="size-5" aria-hidden="true" />
								</div>
								<div className="min-w-0 flex-1">
									<h2 className="truncate font-semibold text-[#0F172A] dark:text-white">
										{department.name}
									</h2>
									<p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
										Created {formatDate(department.createdAt)}
									</p>
								</div>
								{showMenu ? (
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button
												variant="ghost"
												size="icon"
												className="relative z-10 -mt-1 -mr-2 size-8 text-[#64748B] hover:text-[#0F172A] dark:text-[#94A3B8] dark:hover:text-white"
												aria-label={`Actions for ${department.name}`}
											>
												<MoreHorizontal className="size-4" />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent
											align="end"
											className="w-56 border-[#E2E8F0] bg-white dark:border-[#1E293B] dark:bg-[#0F172A]"
										>
											{can("department.update") ? (
												<DropdownMenuItem
													className="gap-2 text-[#334155] focus:bg-[#F8FAFC] dark:text-[#CBD5E1] dark:focus:bg-[#1E293B]"
													onSelect={() => openEdit(department)}
												>
													<Pencil className="size-4" />
													Edit
												</DropdownMenuItem>
											) : null}
											{can("department.delete") ? (
												<>
													<DropdownMenuSeparator />
													<DropdownMenuItem
														disabled={count > 0}
														className="items-start gap-2 text-[#DC2626] focus:bg-[#FEF2F2] focus:text-[#DC2626] dark:text-[#F87171] dark:focus:bg-[#450A0A]"
														onSelect={() => setPendingDelete(department)}
													>
														<Trash2 className="mt-0.5 size-4" />
														<span>
															Delete
															{count > 0 ? (
																<span className="block text-xs text-[#64748B] dark:text-[#94A3B8]">
																	Reassign {count} employee{count === 1 ? "" : "s"} first
																</span>
															) : null}
														</span>
													</DropdownMenuItem>
												</>
											) : null}
										</DropdownMenuContent>
									</DropdownMenu>
								) : null}
							</div>

							<p className="mt-3 line-clamp-2 flex-1 text-sm text-[#334155] dark:text-[#CBD5E1]">
								{department.description || (
									<span className="text-[#94A3B8]">No description</span>
								)}
							</p>

							<div className="mt-4 flex items-center gap-1.5 border-t border-[#F1F5F9] pt-3 text-xs text-[#64748B] dark:border-[#1E293B] dark:text-[#94A3B8]">
								<Users className="size-3.5" aria-hidden="true" />
								<span className="font-medium text-[#0F172A] tabular-nums dark:text-white">
									{count}
								</span>
								{count === 1 ? "employee" : "employees"}
							</div>
						</article>
					);
				})}
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<PageHeader
				title="Departments"
				description={
					isLoading
						? "Teams in your organization"
						: `${departments.length} department${departments.length === 1 ? "" : "s"} · ${assigned} employee${assigned === 1 ? "" : "s"} assigned`
				}
				actions={
					can("department.create") ? (
						<Button
							onClick={openCreate}
							className="h-9 bg-[#2563EB] text-sm font-semibold text-white shadow-none hover:bg-[#1D4ED8]"
						>
							<Plus className="size-4" />
							New department
						</Button>
					) : null
				}
			/>

			<SearchInput placeholder="Search departments..." />

			{content}

			<DepartmentFormDialog open={formOpen} onOpenChange={setFormOpen} department={editing} />

			<DepartmentMembersSheet
				department={viewing}
				open={membersOpen}
				onOpenChange={setMembersOpen}
			/>

			<Dialog
				open={pendingDelete !== null}
				onOpenChange={(open) => {
					if (!open) setPendingDelete(null);
				}}
			>
				<DialogContent className="border-[#E2E8F0] bg-white dark:border-[#1E293B] dark:bg-[#0F172A]">
					<DialogHeader>
						<DialogTitle className="text-[#0F172A] dark:text-white">
							Delete department?
						</DialogTitle>
						<DialogDescription>
							{pendingDelete
								? `${pendingDelete.name} will be removed from your organization. This can't be undone from the app.`
								: null}
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant="outline"
							className="border-[#E2E8F0] text-[#334155] dark:border-[#1E293B] dark:text-[#CBD5E1]"
							onClick={() => setPendingDelete(null)}
						>
							Cancel
						</Button>
						<Button
							variant="destructive"
							disabled={deleteDepartment.isPending}
							onClick={() => {
								if (!pendingDelete) return;
								deleteDepartment.mutate(pendingDelete.id, {
									onSettled: () => setPendingDelete(null),
								});
							}}
						>
							{deleteDepartment.isPending ? "Deleting..." : "Delete"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
