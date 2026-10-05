"use client";

import { useState } from "react";
import { Clock, ListTodo } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog, EmptyState, PageHeader, skeletonBone, StatusFilter } from "@/components/shared";
import { LogHoursDialog } from "@/components/tasks/log-hours-dialog";
import { canLogHours, MyTaskActions } from "@/components/tasks/my-task-actions";
import { MyTaskCard } from "@/components/tasks/my-task-card";
import { TaskSheet } from "@/components/tasks/task-sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useMySubmissions } from "@/hooks/submission.hook";
import { useMyTasks, useUpdateTaskStatus } from "@/hooks/task.hook";
import { useUrlFilters } from "@/hooks/use-url-filters";
import { errorMessage } from "@/lib/api";
import { compareByUrgency, hoursByStatus, isTaskOverdue, nextAssigneeStep } from "@/lib/task";
import { plural, round2 } from "@/lib/utils";
import type { MyTask, TaskStatus } from "@/types/task.type";

const STATUS_ORDER: { status: TaskStatus; label: string }[] = [
	{ status: "TODO", label: "To do" },
	{ status: "IN_PROGRESS", label: "In progress" },
	{ status: "REJECTED", label: "Rejected" },
	{ status: "SUBMITTED", label: "Submitted" },
	{ status: "APPROVED", label: "Approved" },
	{ status: "COMPLETED", label: "Completed" },
];

export function MyTasksView() {
	const { get, apply } = useUrlFilters();
	const status = get("status") as TaskStatus | "";

	const tasks = useMyTasks();
	const logs = useMySubmissions();
	const updateStatus = useUpdateTaskStatus();

	const [logOpen, setLogOpen] = useState(false);
	const [logTaskId, setLogTaskId] = useState<string | null>(null);
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const [sheetOpen, setSheetOpen] = useState(false);
	const [submitting, setSubmitting] = useState<MyTask | null>(null);

	const all = [...(tasks.data ?? [])].sort(compareByUrgency);
	const visible = status ? all.filter((task) => task.status === status) : all;
	const selected = all.find((task) => task.id === selectedId) ?? null;
	const loggable = all.filter(canLogHours);
	const overdue = all.filter(isTaskOverdue).length;

	// Approved / in-review hours per task, from the employee's own work logs
	const hours = Object.fromEntries(
		all.map((task) => [task.id, hoursByStatus((logs.data ?? []).filter((log) => log.taskId === task.id))]),
	);
	const loggedHours = Object.fromEntries(
		Object.entries(hours).map(([taskId, entry]) => [taskId, round2(entry.approved + entry.pending)]),
	);

	function openLog(task?: MyTask) {
		setLogTaskId(task?.id ?? null);
		setLogOpen(true);
	}

	function openTask(task: MyTask) {
		setSelectedId(task.id);
		setSheetOpen(true);
	}

	// Submitting hands the task to a reviewer, so confirm it; starting doesn't need to
	function move(task: MyTask, next: TaskStatus) {
		if (next === "SUBMITTED") {
			setSubmitting(task);
			return;
		}
		updateStatus.mutate({ id: task.id, status: next });
	}

	const movingTo = (task: MyTask) =>
		updateStatus.isPending && updateStatus.variables?.id === task.id ? updateStatus.variables.status : null;

	const actionsFor = (task: MyTask, className?: string) => (
		<MyTaskActions task={task} onLogHours={openLog} onMove={move} movingTo={movingTo(task)} className={className} />
	);

	return (
		<div className="space-y-6">
			<PageHeader
				title="My Tasks"
				description="Start your work, log the hours you put in, and submit tasks for review."
				actions={
					<Button
						onClick={() => openLog()}
						disabled={loggable.length === 0}
						className="h-9 bg-[#2563EB] text-sm font-semibold text-white shadow-none hover:bg-[#1D4ED8]"
					>
						<Clock className="size-4" />
						Log hours
					</Button>
				}
			/>

			<section className="@container space-y-4">
				<div className="flex flex-col gap-3 @3xl:flex-row @3xl:items-center @3xl:justify-between">
					<StatusFilter
						label="Filter by status"
						value={status}
						onChange={(value) => apply({ status: value })}
						tabs={[
							{ value: "", label: "All", count: tasks.isLoading ? undefined : all.length },
							...STATUS_ORDER.map((item) => ({
								value: item.status,
								label: item.label,
								count: tasks.isLoading ? undefined : all.filter((task) => task.status === item.status).length,
							})),
						]}
					/>
					{!tasks.isLoading && overdue > 0 ? (
						<p className="text-xs font-medium text-[#DC2626]">
							{plural(overdue, "overdue task")}
						</p>
					) : null}
				</div>

				{tasks.isError ? (
					<div className="rounded-lg border border-[#E2E8F0] bg-white dark:border-[#1E293B] dark:bg-[#0F172A]">
						<EmptyState
							icon={ListTodo}
							title="Your tasks couldn't be loaded"
							description={errorMessage(tasks.error, "Please try again in a moment.")}
						/>
					</div>
				) : tasks.isLoading ? (
					<div className="grid gap-4 @2xl:grid-cols-2 @5xl:grid-cols-3">
						{Array.from({ length: 3 }).map((_, i) => (
							<Skeleton key={`task-${i}`} className={`h-56 rounded-lg ${skeletonBone}`} />
						))}
					</div>
				) : visible.length === 0 ? (
					<div className="rounded-lg border border-[#E2E8F0] bg-white dark:border-[#1E293B] dark:bg-[#0F172A]">
						<EmptyState
							icon={ListTodo}
							title={status ? "No tasks with this status" : "No tasks yet"}
							description={status ? "Try another status." : "Tasks your manager assigns to you will show up here."}
							action={
								status ? (
									<Button variant="outline" onClick={() => apply({ status: null })}>
										Show all tasks
									</Button>
								) : null
							}
						/>
					</div>
				) : (
					<div className="grid gap-4 @2xl:grid-cols-2 @5xl:grid-cols-3">
						{visible.map((task) => (
							<MyTaskCard
								key={task.id}
								task={task}
								approvedHours={hours[task.id]?.approved ?? 0}
								pendingHours={hours[task.id]?.pending ?? 0}
								onOpen={openTask}
								actions={actionsFor(task)}
							/>
						))}
					</div>
				)}
			</section>

			<TaskSheet
				task={selected}
				open={sheetOpen}
				onOpenChange={setSheetOpen}
				actions={selected && (canLogHours(selected) || nextAssigneeStep(selected.status)) ? actionsFor(selected) : null}
			/>
			<LogHoursDialog
				open={logOpen}
				onOpenChange={setLogOpen}
				tasks={loggable}
				initial={logTaskId ? { taskId: logTaskId } : undefined}
				loggedHours={loggedHours}
			/>
			<ConfirmDialog
				open={submitting !== null}
				onOpenChange={(open) => !open && setSubmitting(null)}
				title="Submit for review?"
				description={
					submitting
						? `“${submitting.title}” goes to your manager for approval. You can keep logging hours, but you won't be able to change its status until it's reviewed.`
						: null
				}
				confirmLabel="Submit for review"
				pendingLabel="Submitting..."
				isPending={updateStatus.isPending}
				onConfirm={() =>
					submitting &&
					updateStatus.mutate({ id: submitting.id, status: "SUBMITTED" }, { onSettled: () => setSubmitting(null) })
				}
			/>
		</div>
	);
}
