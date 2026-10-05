"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ListTodo } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmployeeFilter, EmptyState, FilterSelect, PageHeader, SearchInput, StatusFilter } from "@/components/shared";
import { TaskCard } from "@/components/tasks/task-card";
import { TaskSheet } from "@/components/tasks/task-sheet";
import { useCan } from "@/hooks/auth.hook";
import { useProjectOptions } from "@/hooks/project.hook";
import { BOARD_LIMIT, useTaskBoard } from "@/hooks/task.hook";
import { useUrlFilters } from "@/hooks/use-url-filters";
import { errorMessage } from "@/lib/api";
import { STATUS_CHART_COLORS } from "@/lib/chart-theme";
import { isTaskOverdue } from "@/lib/task";
import { cn } from "@/lib/utils";
import type { BoardTask, TaskPriority, TaskStatus } from "@/types/task.type";

// Rejected sits next to Submitted as the other outcome of a review
const COLUMNS: { status: TaskStatus; label: string }[] = [
	{ status: "TODO", label: "To do" },
	{ status: "IN_PROGRESS", label: "In progress" },
	{ status: "SUBMITTED", label: "Submitted" },
	{ status: "REJECTED", label: "Rejected" },
	{ status: "APPROVED", label: "Approved" },
	{ status: "COMPLETED", label: "Completed" },
];

const PRIORITIES: { value: TaskPriority; label: string }[] = [
	{ value: "URGENT", label: "Urgent" },
	{ value: "HIGH", label: "High" },
	{ value: "MEDIUM", label: "Medium" },
	{ value: "LOW", label: "Low" },
];

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
	const { data, isLoading, isError, error } = useTaskBoard({ search, projectId, employeeId, priority });
	const { data: projects = [] } = useProjectOptions();
	const can = useCan();
	const canUpdateStatus = can("task.update");

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
	const statusCounts = COLUMNS.map((column) => ({
		value: column.status,
		label: column.label,
		count: isLoading ? undefined : byStatus(column.status).length,
	}));

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
		<div className="min-w-0 max-w-full space-y-6">
			<PageHeader title="Tasks" description="Every task across your projects, grouped by status." />

			{/* Breakpoints below are container queries: they follow the content width, so the
			    layout stays right whether the sidebar is open or not */}
			<section className="@container min-w-0 max-w-full space-y-4">
				<div className="grid grid-cols-1 gap-2 rounded-lg border border-[#E2E8F0] bg-white p-3 shadow-2xs @md:grid-cols-2 @md:p-4 @5xl:grid-cols-[minmax(0,1.5fr)_repeat(3,minmax(0,1fr))] dark:border-[#1E293B] dark:bg-[#0F172A]">
					<SearchInput placeholder="Search tasks..." className="w-full sm:w-full" />
					<FilterSelect
						label="Filter by project"
						allLabel="All projects"
						value={projectId}
						onChange={(value) => apply({ projectId: value })}
						options={projects.map((project) => ({ value: project.id, label: project.name }))}
					/>
					<EmployeeFilter
						label="Filter by assignee"
						allLabel="Everyone"
						value={employeeId}
						onChange={(value) => apply({ employeeId: value })}
					/>
					<FilterSelect
						label="Filter by priority"
						allLabel="Any priority"
						value={priority}
						onChange={(value) => apply({ priority: value })}
						options={PRIORITIES}
					/>
				</div>

				<div className="flex flex-col gap-3 @5xl:flex-row @5xl:items-center @5xl:justify-between">
					{/* Narrow: a dropdown, so no status is ever hidden. Wide: one row of tabs that fits */}
					<StatusFilter
						label="Filter by status"
						value={status}
						onChange={(value) => apply({ status: value })}
						tabs={[{ value: "", label: "All", count: isLoading ? undefined : tasks.length }, ...statusCounts]}
					/>
					{!isLoading && (tasks.length > 0 || hasFilters) ? (
						<div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#64748B] tabular-nums @5xl:shrink-0 dark:text-[#94A3B8]">
							<div className="flex items-center gap-2">
								<p>
									{inReview > 0 ? `${inReview} waiting for review` : "Nothing waiting for review"}
									{overdue > 0 ? <span className="text-[#DC2626]"> · {overdue} overdue</span> : null}
								</p>
								{hasFilters ? (
									<Button
										variant="ghost"
										onClick={clearFilters}
										className="h-7 px-2 text-xs font-medium text-[#2563EB] hover:text-[#1D4ED8] dark:text-[#60A5FA]"
									>
										Clear filters
									</Button>
								) : null}
							</div>
							{!status && (scrollable.left || scrollable.right) ? (
								<div className="hidden shrink-0 gap-1 @md:flex">
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
							title={isError ? "Couldn't load tasks" : hasFilters ? "No tasks match" : "No tasks yet"}
							description={
								isError
									? errorMessage(error, "Please try again in a moment.")
									: hasFilters
										? "Try different filters."
										: "Tasks appear here once they're created inside a project."
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
					// Status board: 1 peeked column on mobile, 2 columns on tablet, 4 on desktop, all 6 on wide screens
					<div className="w-full min-w-0 max-w-full">
						<div
							ref={boardRef}
							onScroll={status ? undefined : updateScrollable}
							role={status ? undefined : "region"}
							aria-label={status ? undefined : "Tasks by status"}
							tabIndex={status ? undefined : 0}
							className={cn(
								status
									? "grid"
									: "flex w-full snap-x snap-mandatory gap-3 overflow-x-auto pb-3 focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:outline-none scrollbar-thin",
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
												"w-[85%] max-w-80 shrink-0 snap-start @md:w-[calc((100%-0.75rem)/2)] @md:max-w-none @4xl:w-[calc((100%-2.25rem)/4)] @[82rem]:w-auto @[82rem]:flex-1",
										)}
									>
										<header className="flex items-center gap-2 px-1.5 pt-1 pb-2.5">
											<span className="size-2 rounded-full" style={{ backgroundColor: STATUS_CHART_COLORS[column.status] }} aria-hidden="true" />
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
												status && "grid-cols-1 @md:grid-cols-2 @4xl:grid-cols-3 @6xl:grid-cols-4",
											)}
										>
											{isLoading ? (
												Array.from({ length: status ? 8 : 2 }).map((_, i) => (
													<Skeleton key={i} className={`h-28 rounded-lg ${bone}`} />
												))
											) : items.length === 0 ? (
												<p
													className={cn(
														"rounded-lg border border-dashed border-[#CBD5E1] px-3 py-4 text-center text-xs text-[#94A3B8] dark:border-[#1E293B]",
														status && "col-span-full",
													)}
												>
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
					</div>
				)}
			</section>

			<TaskSheet task={selected} open={sheetOpen} onOpenChange={setSheetOpen} canUpdateStatus={canUpdateStatus} />
		</div>
	);
}
