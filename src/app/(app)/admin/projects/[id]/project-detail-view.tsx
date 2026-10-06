"use client";

import { useState } from "react";
import Link from "next/link";
import { differenceInCalendarDays } from "date-fns";
import {
	ArrowLeft,
	ArrowRight,
	CalendarRange,
	CircleDollarSign,
	Clock,
	FolderX,
	ListTodo,
	MoreHorizontal,
	Pencil,
	Plus,
	Target,
	Trash2,
	UserRoundCog,
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
import {
	DataTable,
	type DataTableColumn,
	EmptyState,
	FilterTabs,
	formatStatus,
	StatCard,
	StatusBadge,
	UserAvatar,
} from "@/components/shared";
import { AssignTaskDialog } from "@/components/projects/assign-task-dialog";
import { ProjectFormDialog } from "@/components/projects/project-form-dialog";
import { ProjectStatusButton } from "@/components/projects/project-status-menu";
import { TaskFormDialog } from "@/components/projects/task-form-dialog";
import { useCan } from "@/hooks/auth.hook";
import { useProject } from "@/hooks/project.hook";
import { useDeleteTask, useUpdateTaskStatus } from "@/hooks/task.hook";
import { useUrlFilters } from "@/hooks/use-url-filters";
import { ApiError } from "@/lib/api";
import { formatCurrency } from "@/lib/pay";
import { isProjectClosed, isTaskOverdue } from "@/lib/task";
import { formatDay } from "@/lib/utils";
import { type Task, TASK_TRANSITIONS, type TaskStatus } from "@/types/task.type";

const STATUS_TABS: { value: TaskStatus | ""; label: string }[] = [
	{ value: "", label: "All" },
	{ value: "TODO", label: "To do" },
	{ value: "IN_PROGRESS", label: "In progress" },
	{ value: "SUBMITTED", label: "Submitted" },
	{ value: "APPROVED", label: "Approved" },
	{ value: "REJECTED", label: "Rejected" },
	{ value: "COMPLETED", label: "Completed" },
];

const DELETABLE: TaskStatus[] = ["TODO", "COMPLETED"];

function timelineHint(endDate: string | null): string {
	if (!endDate) return "No end date";
	const days = differenceInCalendarDays(new Date(endDate), new Date());
	if (days < 0) return `${Math.abs(days)} days past end date`;
	if (days === 0) return "Ends today";
	return `${days} days left`;
}

export function ProjectDetailView({ id }: { id: string }) {
	const { get, apply } = useUrlFilters();
	const statusFilter = get("status");

	const can = useCan();

	const { data: project, isLoading, error, refetch } = useProject(id);
	const updateStatus = useUpdateTaskStatus();
	const deleteTask = useDeleteTask();

	const [editOpen, setEditOpen] = useState(false);
	const [taskFormOpen, setTaskFormOpen] = useState(false);
	const [editingTask, setEditingTask] = useState<Task | null>(null);
	const [taskEditOpen, setTaskEditOpen] = useState(false);
	const [assigning, setAssigning] = useState<Task | null>(null);
	const [assignOpen, setAssignOpen] = useState(false);
	const [pendingDelete, setPendingDelete] = useState<Task | null>(null);

	if (isLoading) {
		return (
			<div className="space-y-6">
				<Skeleton className="h-5 w-24 bg-[#F1F5F9] dark:bg-[#1E293B]" />
				<Skeleton className="h-16 w-full max-w-xl bg-[#F1F5F9] dark:bg-[#1E293B]" />
				<div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
					{Array.from({ length: 4 }).map((_, i) => (
						<Skeleton key={`stat-${i}`} className="h-32 rounded-lg bg-[#F1F5F9] dark:bg-[#1E293B]" />
					))}
				</div>
				<Skeleton className="h-80 rounded-lg bg-[#F1F5F9] dark:bg-[#1E293B]" />
			</div>
		);
	}

	if (!project) {
		const notFound = error instanceof ApiError && error.statusCode === 404;
		return (
			<EmptyState
				icon={FolderX}
				title={notFound ? "Project not found" : "Couldn't load this project"}
				description={notFound ? "It may have been deleted." : error?.message}
				action={
					<div className="flex gap-2">
						{!notFound ? (
							<Button variant="outline" onClick={() => void refetch()}>
								Try again
							</Button>
						) : null}
						<Button asChild className="bg-[#2563EB] text-white shadow-none hover:bg-[#1D4ED8]">
							<Link href="/admin/projects">Back to projects</Link>
						</Button>
					</div>
				}
			/>
		);
	}

	const tasks = project.tasks;
	const completed = tasks.filter((task) => task.status === "COMPLETED").length;
	const progress = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;
	const estimatedHours = tasks.reduce((sum, task) => sum + (task.estimatedHours ?? 0), 0);
	const countOf = (status: TaskStatus) => tasks.filter((task) => task.status === status).length;
	const visibleTasks = statusFilter ? tasks.filter((task) => task.status === statusFilter) : tasks;
	// Closed projects take no new or reassigned tasks (backend rule)
	const canAddTasks = can("task.create") && !isProjectClosed(project.status);

	const columns: DataTableColumn<Task>[] = [
		{
			key: "task",
			header: "Task",
			cell: (row) => (
				<div className="max-w-sm @lg:min-w-48">
					<p className="font-medium text-[#0F172A] @lg:truncate dark:text-white">{row.title}</p>
					<p className="hidden truncate text-xs text-[#64748B] @lg:block dark:text-[#94A3B8]">
						{row.description || "No description"}
					</p>
					{/* Phones: status + assignee here instead of their own columns */}
					<div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs @3xl:hidden">
						<span className="@lg:hidden">
							<StatusBadge status={row.status} />
						</span>
						<span className="text-[#64748B] dark:text-[#94A3B8]">{row.employee.user.name}</span>
					</div>
				</div>
			),
		},
		{
			key: "assignee",
			header: "Assignee",
			headerClassName: "hidden @3xl:table-cell",
			className: "hidden @3xl:table-cell",
			cell: (row) => (
				<div className="flex items-center gap-2">
					<UserAvatar name={row.employee.user.name} src={row.employee.user.avatar} size="sm" />
					<span className="truncate">{row.employee.user.name}</span>
				</div>
			),
		},
		{
			key: "priority",
			header: "Priority",
			headerClassName: "hidden @xl:table-cell",
			className: "hidden @xl:table-cell",
			cell: (row) => <StatusBadge status={row.priority} showDot={false} />,
		},
		{
			key: "due",
			header: "Due",
			headerClassName: "hidden @4xl:table-cell",
			className: "hidden @4xl:table-cell whitespace-nowrap tabular-nums",
			cell: (row) =>
				row.dueDate ? (
					<span className={isTaskOverdue(row) ? "font-medium text-[#DC2626]" : undefined}>
						{formatDay(row.dueDate)}
					</span>
				) : (
					<span className="text-[#94A3B8]">—</span>
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
			key: "actions",
			header: <span className="sr-only">Actions</span>,
			headerClassName: "w-12",
			className: "w-12 text-right",
			cell: (row) => {
				const canEdit = can("task.update");
				const nextStatuses = canEdit ? TASK_TRANSITIONS[row.status] : [];
				const canAssign = can("task.assign") && row.status !== "COMPLETED" && !isProjectClosed(project.status);
				const canDelete = can("task.delete") && DELETABLE.includes(row.status);
				if (!canEdit && nextStatuses.length === 0 && !canAssign && !canDelete) return null;

				return (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className="size-8 text-[#64748B] hover:text-[#0F172A] dark:text-[#94A3B8] dark:hover:text-white"
								aria-label={`Actions for ${row.title}`}
							>
								<MoreHorizontal className="size-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							align="end"
							className="w-52 border-[#E2E8F0] bg-white dark:border-[#1E293B] dark:bg-[#0F172A]"
						>
							{canEdit ? (
								<DropdownMenuItem
									className="gap-2 text-[#334155] focus:bg-[#F8FAFC] dark:text-[#CBD5E1] dark:focus:bg-[#1E293B]"
									onSelect={() => {
										setEditingTask(row);
										setTaskEditOpen(true);
									}}
								>
									<Pencil className="size-4" />
									Edit task
								</DropdownMenuItem>
							) : null}
							{nextStatuses.map((status) => (
								<DropdownMenuItem
									key={status}
									disabled={updateStatus.isPending}
									className="gap-2 text-[#334155] focus:bg-[#F8FAFC] dark:text-[#CBD5E1] dark:focus:bg-[#1E293B]"
									onSelect={() => updateStatus.mutate({ id: row.id, status })}
								>
									<ArrowRight className="size-4" />
									Move to {formatStatus(status).toLowerCase()}
								</DropdownMenuItem>
							))}
							{canAssign ? (
								<DropdownMenuItem
									className="gap-2 text-[#334155] focus:bg-[#F8FAFC] dark:text-[#CBD5E1] dark:focus:bg-[#1E293B]"
									onSelect={() => {
										setAssigning(row);
										setAssignOpen(true);
									}}
								>
									<UserRoundCog className="size-4" />
									Reassign
								</DropdownMenuItem>
							) : null}
							{canDelete ? (
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
				);
			},
		},
	];

	return (
		<div className="space-y-6">
			<Link
				href="/admin/projects"
				className="inline-flex items-center gap-1.5 text-sm font-medium text-[#64748B] hover:text-[#0F172A] dark:text-[#94A3B8] dark:hover:text-white"
			>
				<ArrowLeft className="size-4" />
				Projects
			</Link>

			<div className="flex flex-col gap-4 border-b border-[#E2E8F0] pb-5 sm:flex-row sm:items-start sm:justify-between dark:border-[#1E293B]">
				<div className="min-w-0 space-y-1.5">
					<div className="flex flex-wrap items-center gap-3">
						<h1 className="text-2xl font-bold tracking-tight text-[#0F172A] dark:text-white">
							{project.name}
						</h1>
						<StatusBadge status={project.status} />
					</div>
					<p className="max-w-2xl text-sm text-[#64748B] dark:text-[#94A3B8]">
						{project.description || "No description"}
					</p>
				</div>
				<div className="flex shrink-0 flex-wrap gap-2.5">
					{can("project.update") ? (
						<>
							<ProjectStatusButton project={project} />
							<Button
								variant="outline"
								onClick={() => setEditOpen(true)}
								className="h-9 border-[#E2E8F0] text-sm text-[#334155] dark:border-[#1E293B] dark:text-[#CBD5E1]"
							>
								<Pencil className="size-4" />
								Edit
							</Button>
						</>
					) : null}
					{canAddTasks ? (
						<Button
							onClick={() => setTaskFormOpen(true)}
							className="h-9 bg-[#2563EB] text-sm font-semibold text-white shadow-none hover:bg-[#1D4ED8]"
						>
							<Plus className="size-4" />
							New task
						</Button>
					) : null}
				</div>
			</div>

			<div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
				<StatCard
					title="Progress"
					value={`${progress}%`}
					icon={Target}
					hint={`${completed} of ${tasks.length} tasks completed`}
				/>
				<StatCard
					title="Budget"
					value={project.budget !== null ? formatCurrency(project.budget) : "Not set"}
					icon={CircleDollarSign}
					hint={project.budget !== null ? "Allocated for this project" : "Add one with Edit"}
				/>
				<StatCard
					title="Timeline"
					value={
						project.endDate
							? formatDay(project.endDate)
							: project.startDate
								? "Open-ended"
								: "Not scheduled"
					}
					icon={CalendarRange}
					hint={
						project.startDate && project.endDate
							? `From ${formatDay(project.startDate)} · ${timelineHint(project.endDate)}`
							: project.startDate
								? `Started ${formatDay(project.startDate)}`
								: project.endDate
									? timelineHint(project.endDate)
									: "No dates set — add them with Edit"
					}
				/>
				<StatCard
					title="Estimated hours"
					value={estimatedHours}
					icon={Clock}
					hint={`${countOf("IN_PROGRESS")} in progress · ${countOf("SUBMITTED")} awaiting review`}
				/>
			</div>

			<section className="@container overflow-hidden rounded-lg border border-[#E2E8F0] bg-white shadow-2xs dark:border-[#1E293B] dark:bg-[#0F172A]">
				<div className="flex flex-col gap-3 border-b border-[#E2E8F0] p-4 dark:border-[#1E293B]">
					<h2 className="text-sm font-semibold text-[#0F172A] dark:text-white">
						Tasks <span className="font-normal text-[#64748B] tabular-nums">({tasks.length})</span>
					</h2>
					<FilterTabs
						label="Filter tasks by status"
						tabs={STATUS_TABS.map((tab) => ({
							...tab,
							count: tab.value ? countOf(tab.value) : tasks.length,
						}))}
						value={statusFilter}
						onChange={(value) => apply({ status: value || null })}
					/>
				</div>

				<DataTable
					columns={columns}
					rows={visibleTasks}
					rowKey={(row) => row.id}
					className="rounded-none border-0 shadow-none"
					empty={
						<EmptyState
							icon={ListTodo}
							title={statusFilter ? "No tasks with this status" : "No tasks yet"}
							description={
								statusFilter
									? "Try another status."
									: "Break the project into tasks and assign them to your team."
							}
							action={
								!statusFilter && canAddTasks ? (
									<Button
										onClick={() => setTaskFormOpen(true)}
										className="h-9 bg-[#2563EB] text-sm font-semibold text-white shadow-none hover:bg-[#1D4ED8]"
									>
										<Plus className="size-4" />
										New task
									</Button>
								) : null
							}
						/>
					}
				/>
			</section>

			<ProjectFormDialog open={editOpen} onOpenChange={setEditOpen} project={project} />
			<TaskFormDialog projectId={project.id} open={taskFormOpen} onOpenChange={setTaskFormOpen} />
			<TaskFormDialog task={editingTask} open={taskEditOpen} onOpenChange={setTaskEditOpen} />
			<AssignTaskDialog task={assigning} open={assignOpen} onOpenChange={setAssignOpen} />

			<Dialog
				open={pendingDelete !== null}
				onOpenChange={(open) => {
					if (!open) setPendingDelete(null);
				}}
			>
				<DialogContent className="border-[#E2E8F0] bg-white dark:border-[#1E293B] dark:bg-[#0F172A]">
					<DialogHeader>
						<DialogTitle className="text-[#0F172A] dark:text-white">Delete task?</DialogTitle>
						<DialogDescription>
							{pendingDelete
								? `"${pendingDelete.title}" will be removed. Tasks with logged work can't be deleted.`
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
							disabled={deleteTask.isPending}
							onClick={() => {
								if (!pendingDelete) return;
								deleteTask.mutate(pendingDelete.id, {
									onSettled: () => setPendingDelete(null),
								});
							}}
						>
							{deleteTask.isPending ? "Deleting..." : "Delete"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
