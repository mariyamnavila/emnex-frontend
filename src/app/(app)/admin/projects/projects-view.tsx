"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
	CheckCircle2,
	ChevronRight,
	Eye,
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
	FilterTabs,
	PageHeader,
	SearchInput,
	StatCard,
	StatusBadge,
	TablePagination,
} from "@/components/shared";
import { ProjectFormDialog } from "@/components/projects/project-form-dialog";
import { ProjectStatusSubmenu } from "@/components/projects/project-status-menu";
import { useProjectAnalytics } from "@/hooks/analytics.hook";
import { useCan } from "@/hooks/auth.hook";
import { useDeleteProject, useProjects } from "@/hooks/project.hook";
import { useUrlFilters } from "@/hooks/use-url-filters";
import { errorMessage } from "@/lib/api";
import { formatCurrency } from "@/lib/pay";
import { isProjectClosed } from "@/lib/task";
import { formatDay } from "@/lib/utils";
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
	project.endDate !== null && new Date(project.endDate) < new Date() && !isProjectClosed(project.status);

function Timeline({ project }: { project: Project }) {
	if (!project.startDate && !project.endDate) {
		return <span className="text-[#94A3B8]">Not scheduled</span>;
	}
	return (
		<div className="whitespace-nowrap tabular-nums">
			<p className="text-[#0F172A] dark:text-white">
				{project.startDate && project.endDate
					? `${formatDay(project.startDate)} – ${formatDay(project.endDate)}`
					: project.startDate
						? `From ${formatDay(project.startDate)}`
						: project.endDate
							? `Until ${formatDay(project.endDate)}`
							: null}
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

	const can = useCan();

	const { data, isLoading, isError, error } = useProjects({ page, search, status });
	const { data: analytics, isLoading: analyticsLoading } = useProjectAnalytics();
	const deleteProject = useDeleteProject();
	const router = useRouter();

	const [formOpen, setFormOpen] = useState(false);
	const [editing, setEditing] = useState<Project | null>(null);
	const [pendingDelete, setPendingDelete] = useState<Project | null>(null);

	const rows = data?.rows ?? [];
	const meta = data?.meta;

	const countOf = (value: ProjectStatus) =>
		analytics?.byStatus.find((item) => item.status === value)?._count ?? 0;

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
				<div className="max-w-sm @lg:min-w-48">
					<Link
						href={`/admin/projects/${row.id}`}
						onClick={(event) => event.stopPropagation()}
						className="block font-medium text-[#0F172A] underline-offset-4 group-hover:text-[#2563EB] hover:underline @lg:truncate dark:text-white dark:group-hover:text-[#60A5FA]"
					>
						{row.name}
					</Link>
					<p className="hidden truncate text-xs text-[#64748B] @lg:block dark:text-[#94A3B8]">
						{row.description || "No description"}
					</p>
					{/* Phones: status + budget here instead of their own columns */}
					<div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs @lg:hidden">
						<StatusBadge status={row.status} />
						{row.budget !== null ? (
							<span className="font-medium text-[#334155] tabular-nums dark:text-[#CBD5E1]">
								{formatCurrency(row.budget)}
							</span>
						) : null}
					</div>
				</div>
			),
		},
		{
			key: "status",
			header: "Status",
			headerClassName: "hidden @lg:table-cell",
			className: "hidden @lg:table-cell",
			cell: (row) => <StatusBadge status={row.status} />,
		},
		{
			key: "timeline",
			header: "Timeline",
			headerClassName: "hidden @3xl:table-cell",
			className: "hidden @3xl:table-cell",
			cell: (row) => <Timeline project={row} />,
		},
		{
			key: "budget",
			header: "Budget",
			headerClassName: "hidden @lg:table-cell text-right",
			className: "hidden @lg:table-cell text-right tabular-nums whitespace-nowrap",
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
			headerClassName: "hidden @xl:table-cell text-right",
			className: "hidden @xl:table-cell text-right tabular-nums",
			cell: (row) => row._count.tasks,
		},
		{
			key: "actions",
			header: <span className="sr-only">Actions</span>,
			headerClassName: "w-12",
			className: "w-12 text-right",
			cell: (row) => (
				<div onClick={(event) => event.stopPropagation()}>
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
							<DropdownMenuItem
								asChild
								className="gap-2 text-[#334155] focus:bg-[#F8FAFC] dark:text-[#CBD5E1] dark:focus:bg-[#1E293B]"
							>
								<Link href={`/admin/projects/${row.id}`}>
									<Eye className="size-4" />
									View project
								</Link>
							</DropdownMenuItem>
							{can("project.update") ? (
								<>
									<DropdownMenuItem
										className="gap-2 text-[#334155] focus:bg-[#F8FAFC] dark:text-[#CBD5E1] dark:focus:bg-[#1E293B]"
										onSelect={() => openEdit(row)}
									>
										<Pencil className="size-4" />
										Edit
									</DropdownMenuItem>
									<ProjectStatusSubmenu project={row} />
								</>
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
				</div>
			),
		},
		{
			key: "open",
			header: <span className="sr-only">Open</span>,
			headerClassName: "w-8 pl-0",
			className: "w-8 pl-0",
			cell: () => (
				<ChevronRight
					aria-hidden="true"
					className="size-4 text-[#94A3B8] transition-transform group-hover:translate-x-0.5 group-hover:text-[#2563EB]"
				/>
			),
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

			<div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
				<StatCard
					title="Total projects"
					isLoading={analyticsLoading}
					value={analytics?.totalProjects ?? 0}
					icon={FolderKanban}
					hint={analytics ? `~${analytics.avgTasksPerProject} tasks per project` : undefined}
				/>
				<StatCard
					title="Active"
					isLoading={analyticsLoading}
					value={countOf("ACTIVE")}
					icon={PlayCircle}
					hint={`${countOf("PLANNED")} planned`}
				/>
				<StatCard
					title="On hold"
					isLoading={analyticsLoading}
					value={countOf("ON_HOLD")}
					icon={PauseCircle}
					hint="Paused for now"
				/>
				<StatCard
					title="Completed"
					isLoading={analyticsLoading}
					value={countOf("COMPLETED")}
					icon={CheckCircle2}
					hint={`${countOf("CANCELLED")} cancelled`}
				/>
			</div>

			<section className="@container overflow-hidden rounded-lg border border-[#E2E8F0] bg-white shadow-2xs dark:border-[#1E293B] dark:bg-[#0F172A]">
				<div className="flex flex-col gap-3 border-b border-[#E2E8F0] p-4 @3xl:flex-row @3xl:items-center @3xl:justify-between dark:border-[#1E293B]">
					<FilterTabs
						label="Filter by status"
						tabs={STATUS_TABS}
						value={status}
						onChange={(value) => apply({ status: value || null })}
					/>
					<SearchInput placeholder="Search projects..." />
				</div>

				<DataTable
					columns={columns}
					rows={rows}
					rowKey={(row) => row.id}
					isLoading={isLoading}
					onRowClick={(row) => router.push(`/admin/projects/${row.id}`)}
					className="rounded-none border-0 shadow-none"
					empty={
						<EmptyState
							icon={FolderKanban}
							title={isError ? "Couldn't load projects" : "No projects found"}
							description={
								isError
									? errorMessage(error, "Please try again in a moment.")
									: hasFilters
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
