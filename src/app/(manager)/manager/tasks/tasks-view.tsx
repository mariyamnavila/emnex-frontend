"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ListTodo } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState, FilterTabs, PageHeader, SearchInput } from "@/components/shared";
import { isTaskOverdue, TaskCard } from "@/components/tasks/task-card";
import { TaskSheet } from "@/components/tasks/task-sheet";
import { useGetMe } from "@/hooks/auth.hook";
import { useEmployeeOptions } from "@/hooks/employee.hook";
import { useProjectOptions } from "@/hooks/project.hook";
import { BOARD_LIMIT, useTaskBoard } from "@/hooks/task.hook";
import { useUrlFilters } from "@/hooks/use-url-filters";
import { cn } from "@/lib/utils";
import type { BoardTask, TaskPriority, TaskStatus } from "@/types/task.type";

// Same colors as StatusBadge; Rejected sits next to Submitted as the other outcome of a review
const COLUMNS: { status: TaskStatus; label: string; color: string }[] = [
	{ status: "TODO", label: "To do", color: "#64748B" },
	{ status: "IN_PROGRESS", label: "In progress", color: "#2563EB" },
	{ status: "SUBMITTED", label: "Submitted", color: "#D97706" },
	{ status: "REJECTED", label: "Rejected", color: "#DC2626" },
	{ status: "APPROVED", label: "Approved", color: "#16A34A" },
	{ status: "COMPLETED", label: "Completed", color: "#16A34A" },
];

const PRIORITIES: { value: TaskPriority; label: string }[] = [
	{ value: "URGENT", label: "Urgent" },
	{ value: "HIGH", label: "High" },
	{ value: "MEDIUM", label: "Medium" },
	{ value: "LOW", label: "Low" },
];

const ALL = "__all__";
const triggerClass =
	"h-9 w-full border-[#CBD5E1] bg-white text-sm text-[#0F172A] dark:border-[#1E293B] dark:bg-[#0F172A] dark:text-white";
const contentClass = "border-[#E2E8F0] bg-white dark:border-[#1E293B] dark:bg-[#0F172A]";
const bone = "bg-[#E2E8F0]/60 dark:bg-[#1E293B]";

export function TasksView() {
	const { get, apply } = useUrlFilters();
	const search = get("search");
	const projectId = get("projectId");
	const employeeId = get("employeeId");
	const priority = get("priority");
	const status = get("status") as TaskStatus | "";
	const hasFilters = Boolean(search || projectId || employeeId || priority);

	// Status is filtered here, not by the API, so every tab can show its count
	const { data, isLoading } = useTaskBoard({ search, projectId, employeeId, priority });
	const { data: projects = [] } = useProjectOptions();
	const { data: employees = [] } = useEmployeeOptions();
	const { data: me } = useGetMe();
	const canUpdateStatus = me?.permissions.includes("task.update") ?? false;

	const [selectedId, setSelectedId] = useState<string | null>(null);
	const [snapshot, setSnapshot] = useState<BoardTask | null>(null);
	const [sheetOpen, setSheetOpen] = useState(false);

	const tasks = data?.tasks ?? [];
	// Read the open task from fresh data so a status change shows up in the sheet
	const selected = tasks.find((task) => task.id === selectedId) ?? snapshot;
	const overdue = tasks.filter(isTaskOverdue).length;
	const inReview = tasks.filter((task) => task.status === "SUBMITTED").length;
	const byStatus = (value: TaskStatus) => tasks.filter((task) => task.status === value);
	const visibleColumns = status ? COLUMNS.filter((column) => column.status === status) : COLUMNS;

	function openTask(task: BoardTask) {
		setSelectedId(task.id);
		setSnapshot(task);
		setSheetOpen(true);
	}

	// ‹ › for tablets and desktops; phones just swipe. They only enable when there's more to see
	const boardRef = useRef<HTMLDivElement>(null);
	const [scrollable, setScrollable] = useState({ left: false, right: false });
	const updateScrollable = useCallback(() => {
		const board = boardRef.current;
		if (!board) return setScrollable({ left: false, right: false });
		setScrollable({
			left: board.scrollLeft > 4,
			right: board.scrollLeft + board.clientWidth < board.scrollWidth - 4,
		});
	}, []);
	useEffect(() => {
		updateScrollable();
		window.addEventListener("resize", updateScrollable);
		return () => window.removeEventListener("resize", updateScrollable);
	}, [updateScrollable, tasks.length, isLoading, status]);
	// One column per click
	const scrollBoard = (direction: 1 | -1) => {
		const board = boardRef.current;
		const column = board?.firstElementChild as HTMLElement | null;
		board?.scrollBy({ left: direction * ((column?.offsetWidth ?? 300) + 12), behavior: "smooth" });
	};

	const clearFilters = () => apply({ search: null, projectId: null, employeeId: null, priority: null });

	return (
		<div className="space-y-6">
			<PageHeader title="Tasks" description="Every task across your projects, grouped by status." />

			<section className="@container space-y-4">
				<div className="grid gap-2 rounded-lg border border-[#E2E8F0] bg-white p-4 shadow-2xs @md:grid-cols-2 @5xl:grid-cols-[minmax(0,1.5fr)_repeat(3,minmax(0,1fr))] dark:border-[#1E293B] dark:bg-[#0F172A]">
					<SearchInput placeholder="Search tasks..." className="sm:w-full" />
					<Select value={projectId || ALL} onValueChange={(value) => apply({ projectId: value === ALL ? null : value })}>
						<SelectTrigger aria-label="Filter by project" className={triggerClass}>
							<SelectValue placeholder="All projects" />
						</SelectTrigger>
						<SelectContent className={contentClass}>
							<SelectItem value={ALL}>All projects</SelectItem>
							{projects.map((project) => (
								<SelectItem key={project.id} value={project.id}>
									{project.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Select value={employeeId || ALL} onValueChange={(value) => apply({ employeeId: value === ALL ? null : value })}>
						<SelectTrigger aria-label="Filter by assignee" className={triggerClass}>
							<SelectValue placeholder="Everyone" />
						</SelectTrigger>
						<SelectContent className={contentClass}>
							<SelectItem value={ALL}>Everyone</SelectItem>
							{employees.map((employee) => (
								<SelectItem key={employee.id} value={employee.id}>
									{employee.user.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Select value={priority || ALL} onValueChange={(value) => apply({ priority: value === ALL ? null : value })}>
						<SelectTrigger aria-label="Filter by priority" className={triggerClass}>
							<SelectValue placeholder="Any priority" />
						</SelectTrigger>
						<SelectContent className={contentClass}>
							<SelectItem value={ALL}>Any priority</SelectItem>
							{PRIORITIES.map((item) => (
								<SelectItem key={item.value} value={item.value}>
									{item.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="flex flex-col gap-3 @3xl:flex-row @3xl:items-center @3xl:justify-between">
					<FilterTabs
						label="Filter by status"
						value={status}
						onChange={(value) => apply({ status: value || null })}
						tabs={[
							{ value: "", label: "All", count: isLoading ? undefined : tasks.length },
							...COLUMNS.map((column) => ({
								value: column.status,
								label: column.label,
								count: isLoading ? undefined : byStatus(column.status).length,
							})),
						]}
					/>
					{!isLoading && (tasks.length > 0 || hasFilters) ? (
						<div className="flex items-center gap-3 text-xs text-[#64748B] tabular-nums @3xl:shrink-0 dark:text-[#94A3B8]">
							<p>
								{inReview > 0 ? `${inReview} waiting for review` : "Nothing waiting for review"}
								{overdue > 0 ? <span className="text-[#DC2626]"> · {overdue} overdue</span> : null}
							</p>
							{hasFilters ? (
								<Button
									variant="ghost"
									onClick={clearFilters}
									className="h-8 px-2 text-xs font-medium text-[#2563EB] hover:text-[#1D4ED8] dark:text-[#60A5FA]"
								>
									Clear filters
								</Button>
							) : null}
							{!status && (scrollable.left || scrollable.right) ? (
								<div className="ml-auto hidden shrink-0 gap-1 @md:flex">
									<Button
										variant="outline"
										size="icon"
										disabled={!scrollable.left}
										onClick={() => scrollBoard(-1)}
										aria-label="Show previous status"
										className="size-8 border-[#E2E8F0] text-[#334155] dark:border-[#1E293B] dark:text-[#CBD5E1]"
									>
										<ChevronLeft className="size-4" />
									</Button>
									<Button
										variant="outline"
										size="icon"
										disabled={!scrollable.right}
										onClick={() => scrollBoard(1)}
										aria-label="Show next status"
										className="size-8 border-[#E2E8F0] text-[#334155] dark:border-[#1E293B] dark:text-[#CBD5E1]"
									>
										<ChevronRight className="size-4" />
									</Button>
								</div>
							) : null}
						</div>
					) : null}
				</div>

				{(data?.total ?? 0) > BOARD_LIMIT ? (
					<p className="text-xs text-[#D97706]">
						Showing the newest {BOARD_LIMIT} of {data?.total} tasks — narrow the filters to see the rest.
					</p>
				) : null}

				{!isLoading && tasks.length === 0 ? (
					<div className="rounded-lg border border-[#E2E8F0] bg-white dark:border-[#1E293B] dark:bg-[#0F172A]">
						<EmptyState
							icon={ListTodo}
							title={hasFilters ? "No tasks match" : "No tasks yet"}
							description={
								hasFilters ? "Try different filters." : "Tasks appear here once they're created inside a project."
							}
							action={
								hasFilters ? (
									<Button variant="outline" onClick={clearFilters}>
										Clear filters
									</Button>
								) : null
							}
						/>
					</div>
				) : (
					// Same status board everywhere, only the number of visible columns changes:
					// phones 1 (+ a peek of the next), tablets 2, desktops 4, wide monitors all 6
					<div
						ref={boardRef}
						onScroll={status ? undefined : updateScrollable}
						role={status ? undefined : "region"}
						aria-label={status ? undefined : "Tasks by status"}
						tabIndex={status ? undefined : 0}
						className={cn(
							status
								? "grid"
								: "-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-3 focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:outline-none sm:mx-0 sm:scroll-px-0 sm:px-0",
						)}
					>
						{visibleColumns.map((column) => {
							const items = byStatus(column.status);
							return (
								<section
									key={column.status}
									aria-label={column.label}
									className={cn(
										"flex min-w-0 flex-col rounded-lg bg-[#F1F5F9] p-2 dark:bg-[#0B1120]",
										!status &&
											"w-[85%] max-w-90 shrink-0 snap-start @md:w-[calc((100%-0.75rem)/2)] @md:max-w-none @4xl:w-[calc((100%-2.25rem)/4)] @[82rem]:w-auto @[82rem]:flex-1",
									)}
								>
									<header className="flex items-center gap-2 px-1.5 pt-1 pb-2.5">
										<span className="size-2 rounded-full" style={{ backgroundColor: column.color }} aria-hidden="true" />
										<h2 className="text-xs font-semibold tracking-wider text-[#334155] uppercase dark:text-[#CBD5E1]">
											{column.label}
										</h2>
										<span className="ml-auto rounded-full bg-white px-2 py-0.5 text-xs font-medium text-[#64748B] tabular-nums dark:bg-[#1E293B] dark:text-[#94A3B8]">
											{isLoading ? "–" : items.length}
										</span>
									</header>
									<div
										className={cn(
											"grid gap-2",
											// One status at a time gets the full width, so spread its cards out
											status && "@xl:grid-cols-2 @4xl:grid-cols-3 @6xl:grid-cols-4",
										)}
									>
										{isLoading ? (
											<>
												<Skeleton className={`h-28 rounded-lg ${bone}`} />
												<Skeleton className={`h-28 rounded-lg ${bone}`} />
											</>
										) : items.length === 0 ? (
											<p className="rounded-lg border border-dashed border-[#CBD5E1] px-3 py-4 text-center text-xs text-[#94A3B8] dark:border-[#1E293B]">
												No tasks
											</p>
										) : (
											items.map((task) => <TaskCard key={task.id} task={task} onOpen={openTask} />)
										)}
									</div>
								</section>
							);
						})}
					</div>
				)}
			</section>

			<TaskSheet task={selected} open={sheetOpen} onOpenChange={setSheetOpen} canUpdateStatus={canUpdateStatus} />
		</div>
	);
}
