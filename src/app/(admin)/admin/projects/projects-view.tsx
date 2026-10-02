"use client";

import { useState } from "react";
import {
	CheckCircle2,
	FolderKanban,
	MoreHorizontal,
	PauseCircle,
	Pencil,
	PlayCircle,
	Plus,
	Trash2,
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
import {
	DataTable,
	type DataTableColumn,
	EmptyState,
	PageHeader,
	SearchInput,
	StatCard,
	StatusBadge,
	TablePagination,
} from "@/components/shared";
import { ProjectFormDialog } from "@/components/projects/project-form-dialog";
import { useProjectAnalytics } from "@/hooks/analytics.hook";
import { useGetMe } from "@/hooks/auth.hook";
import { useDeleteProject, useProjects } from "@/hooks/project.hook";
import { useUrlFilters } from "@/hooks/use-url-filters";
import { formatCurrency } from "@/lib/pay";
import { cn, formatDay } from "@/lib/utils";
import type { Project, ProjectStatus } from "@/types/project.type";

const STATUS_TABS: { value: ProjectStatus | ""; label: string }[] = [
	{ value: "", label: "All" },
	{ value: "PLANNED", label: "Planned" },
	{ value: "ACTIVE", label: "Active" },
	{ value: "ON_HOLD", label: "On hold" },
	{ value: "COMPLETED", label: "Completed" },
	{ value: "CANCELLED", label: "Cancelled" },
];

const isOverdue = (project: Project) =>
	project.endDate !== null &&
	new Date(project.endDate) < new Date() &&
	!["COMPLETED", "CANCELLED"].includes(project.status);

function Timeline({ project }: { project: Project }) {
	if (!project.startDate && !project.endDate) {
		return <span className="text-[#94A3B8]">Not scheduled</span>;
	}
	return (
		<div className="whitespace-nowrap tabular-nums">
			<p className="text-[#0F172A] dark:text-white">
				{project.startDate ? formatDay(project.startDate) : "—"} –{" "}
				{project.endDate ? formatDay(project.endDate) : "—"}
			</p>
			{isOverdue(project) ? (
				<p className="text-xs font-medium text-[#DC2626]">Past end date</p>
			) : null}
		</div>
	);
}

export function ProjectsView() {
	const { get, apply, page } = useUrlFilters();
	const search = get("search");
	const status = get("status");
	const hasFilters = Boolean(search || status);

	const { data: me } = useGetMe();
	const can = (permission: string) => me?.permissions.includes(permission) ?? false;

	const { data, isLoading } = useProjects({ page, search, status });
	const { data: analytics, isLoading: analyticsLoading } = useProjectAnalytics();
	const deleteProject = useDeleteProject();

	const [formOpen, setFormOpen] = useState(false);
	const [editing, setEditing] = useState<Project | null>(null);
	const [pendingDelete, setPendingDelete] = useState<Project | null>(null);

	const rows = data?.rows ?? [];
	const meta = data?.meta;

	const countOf = (value: ProjectStatus) =>
		analytics?.byStatus.find((item) => item.status === value)?._count ?? 0;
	const statValue = (value: number) => (analyticsLoading ? "—" : value);

	function openCreate() {
		setEditing(null);
		setFormOpen(true);
	}

	function openEdit(project: Project) {
		setEditing(project);
		setFormOpen(true);
	}

	const columns: DataTableColumn<Project>[] = [
		{
			key: "project",
			header: "Project",
			cell: (row) => (
				<div className="min-w-48 max-w-sm">
					<p className="truncate font-medium text-[#0F172A] dark:text-white">{row.name}</p>
					<p className="truncate text-xs text-[#64748B] dark:text-[#94A3B8]">
						{row.description || "No description"}
					</p>
				</div>
			),
		},
		{
			key: "status",
			header: "Status",
			cell: (row) => <StatusBadge status={row.status} />,
		},
		{
			key: "timeline",
			header: "Timeline",
			headerClassName: "hidden md:table-cell",
			className: "hidden md:table-cell",
			cell: (row) => <Timeline project={row} />,
		},
		{
			key: "budget",
			header: "Budget",
			headerClassName: "text-right",
			className: "text-right tabular-nums whitespace-nowrap",
			cell: (row) =>
				row.budget !== null ? (
					<span className="font-medium text-[#0F172A] dark:text-white">
						{formatCurrency(row.budget)}
					</span>
				) : (
					<span className="text-[#94A3B8]">—</span>
				),
		},
		{
			key: "tasks",
			header: "Tasks",
			headerClassName: "hidden sm:table-cell text-right",
			className: "hidden sm:table-cell text-right tabular-nums",
			cell: (row) => row._count.tasks,
		},
		{
			key: "actions",
			header: <span className="sr-only">Actions</span>,
			headerClassName: "w-12",
			className: "w-12 text-right",
			cell: (row) =>
				can("project.update") || can("project.delete") ? (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className="size-8 text-[#64748B] hover:text-[#0F172A] dark:text-[#94A3B8] dark:hover:text-white"
								aria-label={`Actions for ${row.name}`}
							>
								<MoreHorizontal className="size-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							align="end"
							className="w-44 border-[#E2E8F0] bg-white dark:border-[#1E293B] dark:bg-[#0F172A]"
						>
							{can("project.update") ? (
								<DropdownMenuItem
									className="gap-2 text-[#334155] focus:bg-[#F8FAFC] dark:text-[#CBD5E1] dark:focus:bg-[#1E293B]"
									onSelect={() => openEdit(row)}
								>
									<Pencil className="size-4" />
									Edit
								</DropdownMenuItem>
							) : null}
							{can("project.delete") ? (
								<>
									<DropdownMenuSeparator />
									<DropdownMenuItem
										className="gap-2 text-[#DC2626] focus:bg-[#FEF2F2] focus:text-[#DC2626] dark:text-[#F87171] dark:focus:bg-[#450A0A]"
										onSelect={() => setPendingDelete(row)}
									>
										<Trash2 className="size-4" />
										Delete
									</DropdownMenuItem>
								</>
							) : null}
						</DropdownMenuContent>
					</DropdownMenu>
				) : null,
		},
	];

	return (
		<div className="space-y-6">
			<PageHeader
				title="Projects"
				description="Plan work, track timelines and budgets."
				actions={
					can("project.create") ? (
						<Button
							onClick={openCreate}
							className="h-9 bg-[#2563EB] text-sm font-semibold text-white shadow-none hover:bg-[#1D4ED8]"
						>
							<Plus className="size-4" />
							New project
						</Button>
					) : null
				}
			/>

			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				<StatCard
					title="Total projects"
					value={statValue(analytics?.totalProjects ?? 0)}
					icon={FolderKanban}
					hint={analytics ? `~${analytics.avgTasksPerProject} tasks per project` : undefined}
				/>
				<StatCard
					title="Active"
					value={statValue(countOf("ACTIVE"))}
					icon={PlayCircle}
					hint={`${countOf("PLANNED")} planned`}
				/>
				<StatCard
					title="On hold"
					value={statValue(countOf("ON_HOLD"))}
					icon={PauseCircle}
					hint="Paused for now"
				/>
				<StatCard
					title="Completed"
					value={statValue(countOf("COMPLETED"))}
					icon={CheckCircle2}
					hint={`${countOf("CANCELLED")} cancelled`}
				/>
			</div>

			<section className="overflow-hidden rounded-lg border border-[#E2E8F0] bg-white shadow-2xs dark:border-[#1E293B] dark:bg-[#0F172A]">
				<div className="flex flex-col gap-3 border-b border-[#E2E8F0] p-4 lg:flex-row lg:items-center lg:justify-between dark:border-[#1E293B]">
					<div className="-mx-1 overflow-x-auto px-1">
						<div
							role="group"
							aria-label="Filter by status"
							className="inline-flex rounded-md border border-[#E2E8F0] bg-[#F8FAFC] p-0.5 dark:border-[#1E293B] dark:bg-[#0B1120]"
						>
							{STATUS_TABS.map((tab) => {
								const isActive = status === tab.value;
								return (
									<button
										key={tab.label}
										type="button"
										aria-pressed={isActive}
										onClick={() => apply({ status: tab.value || null })}
										className={cn(
											"h-8 rounded px-3 text-xs font-medium whitespace-nowrap transition-colors",
											isActive
												? "bg-white text-[#0F172A] shadow-2xs dark:bg-[#1E293B] dark:text-white"
												: "text-[#64748B] hover:text-[#0F172A] dark:text-[#94A3B8] dark:hover:text-white",
										)}
									>
										{tab.label}
									</button>
								);
							})}
						</div>
					</div>
					<SearchInput placeholder="Search projects..." />
				</div>

				<DataTable
					columns={columns}
					rows={rows}
					rowKey={(row) => row.id}
					isLoading={isLoading}
					className="rounded-none border-0 shadow-none"
					empty={
						<EmptyState
							icon={FolderKanban}
							title="No projects found"
							description={
								hasFilters
									? "Nothing matches these filters."
									: "Create a project to start assigning tasks."
							}
							action={
								hasFilters ? (
									<Button
										variant="outline"
										className="h-9 border-[#E2E8F0] text-sm text-[#334155] dark:border-[#1E293B] dark:text-[#CBD5E1]"
										onClick={() => apply({ search: null, status: null })}
									>
										Clear filters
									</Button>
								) : can("project.create") ? (
									<Button
										onClick={openCreate}
										className="h-9 bg-[#2563EB] text-sm font-semibold text-white shadow-none hover:bg-[#1D4ED8]"
									>
										<Plus className="size-4" />
										New project
									</Button>
								) : null
							}
						/>
					}
				/>

				<div className="border-t border-[#E2E8F0] px-4 py-1 dark:border-[#1E293B]">
					<TablePagination
						page={page}
						totalPages={meta?.totalPages ?? 1}
						total={meta?.total}
						isLoading={isLoading}
					/>
				</div>
			</section>

			<ProjectFormDialog open={formOpen} onOpenChange={setFormOpen} project={editing} />

			<Dialog
				open={pendingDelete !== null}
				onOpenChange={(open) => {
					if (!open) setPendingDelete(null);
				}}
			>
				<DialogContent className="border-[#E2E8F0] bg-white dark:border-[#1E293B] dark:bg-[#0F172A]">
					<DialogHeader>
						<DialogTitle className="text-[#0F172A] dark:text-white">Delete project?</DialogTitle>
						<DialogDescription>
							{pendingDelete
								? `${pendingDelete.name} will be removed. Projects that still have tasks can't be deleted — remove the tasks first.`
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
							disabled={deleteProject.isPending}
							onClick={() => {
								if (!pendingDelete) return;
								deleteProject.mutate(pendingDelete.id, {
									onSettled: () => setPendingDelete(null),
								});
							}}
						>
							{deleteProject.isPending ? "Deleting..." : "Delete"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
