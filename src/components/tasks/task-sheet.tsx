"use client";

import type { ReactNode } from "react";

import { ArrowRight, Loader2 } from "lucide-react";
import {
	DetailList,
	DetailRow,
	DetailSheet,
	formatStatus,
	SectionHeading,
	skeletonBone,
	StatusBadge,
	UserAvatar,
} from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useTaskSubmissions, useUpdateTaskStatus } from "@/hooks/task.hook";
import { isTaskOverdue } from "@/lib/task";
import { cn, formatDay } from "@/lib/utils";
import { type BoardTask, type MyTask, TASK_TRANSITIONS } from "@/types/task.type";

const sum = (values: number[]) => Math.round(values.reduce((total, value) => total + value, 0) * 100) / 100;

interface TaskSheetProps {
	/** A board task (with assignee) or one of the signed-in employee's own */
	task: BoardTask | MyTask | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	/** Reviewer buttons for the allowed next statuses */
	canUpdateStatus?: boolean;
	/** Replaces the footer, e.g. the assignee's own actions */
	actions?: ReactNode;
}

export function TaskSheet({ task, open, onOpenChange, canUpdateStatus = false, actions }: TaskSheetProps) {
	const { data: logs = [], isLoading: logsLoading } = useTaskSubmissions(open && task ? task.id : null);
	const updateStatus = useUpdateTaskStatus();

	const approvedHours = sum(logs.filter((log) => log.status === "APPROVED").map((log) => log.hoursWorked));
	const pendingHours = sum(logs.filter((log) => log.status === "PENDING").map((log) => log.hoursWorked));
	const nextStatuses = task && canUpdateStatus ? TASK_TRANSITIONS[task.status] : [];

	const footer =
		actions ??
		(task && nextStatuses.length > 0 ? (
			<div className="flex flex-wrap gap-2">
				{nextStatuses.map((status) => {
					const isMoving = updateStatus.isPending && updateStatus.variables?.status === status;
					return (
						<Button
							key={status}
							variant={status === "REJECTED" ? "outline" : "default"}
							disabled={updateStatus.isPending}
							onClick={() => updateStatus.mutate({ id: task.id, status })}
							className={cn(
								"flex-1",
								status === "REJECTED"
									? "border-[#E2E8F0] text-[#B91C1C] hover:bg-[#FEF2F2] hover:text-[#B91C1C] dark:border-[#1E293B]"
									: "bg-[#2563EB] text-white shadow-none hover:bg-[#1D4ED8]",
							)}
						>
							{isMoving ? <Loader2 className="size-4 animate-spin" /> : <ArrowRight className="size-4" />}
							Move to {formatStatus(status).toLowerCase()}
						</Button>
					);
				})}
			</div>
		) : null);

	return (
		<DetailSheet
			open={open}
			onOpenChange={onOpenChange}
			title="Task"
			description={
				task && !("employee" in task)
					? "How far along it is, and the hours you've logged"
					: "Who's on it, how far along it is, and the hours logged"
			}
			footer={footer}
		>
			{task ? (
				<>
					<div className="space-y-2">
						<div className="flex flex-wrap items-center gap-2">
							<StatusBadge status={task.status} />
							<StatusBadge status={task.priority} label={`${formatStatus(task.priority)} priority`} />
						</div>
						<h2 className="text-lg leading-snug font-semibold text-[#0F172A] dark:text-white">{task.title}</h2>
					</div>

					<DetailList>
						<DetailRow label="Project">{task.project.name}</DetailRow>
						{"employee" in task ? (
							<DetailRow label="Assignee">
								<span className="flex items-center gap-2">
									<UserAvatar name={task.employee.user.name} src={task.employee.user.avatar} size="sm" />
									<span className="truncate">{task.employee.user.name}</span>
								</span>
							</DetailRow>
						) : null}
						<DetailRow label="Due">
							{task.dueDate ? (
								<span className={cn("tabular-nums", isTaskOverdue(task) && "font-medium text-[#DC2626]")}>
									{formatDay(task.dueDate)}
									{isTaskOverdue(task) ? " · overdue" : ""}
								</span>
							) : (
								<span className="text-[#94A3B8]">No due date</span>
							)}
						</DetailRow>
						<DetailRow label="Hours">
							{logsLoading ? (
								<Skeleton className={`h-4 w-32 ${skeletonBone}`} />
							) : (
								<span className="tabular-nums">
									{approvedHours} h approved
									{task.estimatedHours ? (
										<span className="text-[#64748B] dark:text-[#94A3B8]"> of {task.estimatedHours} h estimated</span>
									) : null}
									{pendingHours > 0 ? (
										<span className="block text-xs text-[#D97706]">{pendingHours} h waiting for review</span>
									) : null}
								</span>
							)}
						</DetailRow>
					</DetailList>

					{task.description ? (
						<div className="space-y-2">
							<SectionHeading>Description</SectionHeading>
							<p className="text-sm whitespace-pre-line text-[#334155] dark:text-[#CBD5E1]">{task.description}</p>
						</div>
					) : null}

					<div className="space-y-2">
						<SectionHeading>Work logs</SectionHeading>
						{logsLoading ? (
							<Skeleton className={`h-16 w-full ${skeletonBone}`} />
						) : logs.length === 0 ? (
							<p className="text-sm text-[#94A3B8]">No hours logged yet.</p>
						) : (
							<ul className="divide-y divide-[#F1F5F9] rounded-lg border border-[#E2E8F0] dark:divide-[#1E293B] dark:border-[#1E293B]">
								{logs.map((log) => (
									<li key={log.id} className="flex items-center gap-3 px-3 py-2.5">
										<div className="min-w-0 flex-1">
											<p className="text-sm text-[#0F172A] tabular-nums dark:text-white">{formatDay(log.workDate)}</p>
											{log.description ? (
												<p className="truncate text-xs text-[#64748B] dark:text-[#94A3B8]">{log.description}</p>
											) : null}
										</div>
										<span className="text-sm font-semibold text-[#0F172A] tabular-nums dark:text-white">
											{log.hoursWorked} h
										</span>
										<StatusBadge status={log.status} />
									</li>
								))}
							</ul>
						)}
					</div>
				</>
			) : null}
		</DetailSheet>
	);
}
