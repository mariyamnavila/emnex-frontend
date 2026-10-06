"use client";

import { ArrowRight, Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCan } from "@/hooks/auth.hook";
import { isProjectClosed, nextAssigneeStep } from "@/lib/task";
import { cn } from "@/lib/utils";
import type { MyTask, TaskStatus } from "@/types/task.type";

/** Same rule as the backend: no logging on completed tasks or closed projects */
export function canLogHours(task: MyTask) {
	return task.status !== "COMPLETED" && !isProjectClosed(task.project.status);
}

interface MyTaskActionsProps {
	task: MyTask;
	onLogHours: (task: MyTask) => void;
	onMove: (task: MyTask, status: TaskStatus) => void;
	/** The status a move is currently saving, if it's this task */
	movingTo?: TaskStatus | null;
	className?: string;
}

// The assignee's buttons: log hours + the one next step for the current status
export function MyTaskActions({ task, onLogHours, onMove, movingTo = null, className }: MyTaskActionsProps) {
	const can = useCan();
	// Logging hours needs submission.create; progressing your task needs task.update_own
	const step = can("task.update_own") ? nextAssigneeStep(task.status) : null;
	const loggable = can("submission.create") && canLogHours(task);
	if (!step && !loggable) return null;

	return (
		<div className={cn("flex flex-wrap gap-2", className)}>
			{loggable ? (
				<Button
					variant="outline"
					size="sm"
					onClick={() => onLogHours(task)}
					className="flex-1 border-[#E2E8F0] text-[#334155] dark:border-[#1E293B] dark:text-[#CBD5E1]"
				>
					<Clock className="size-3.5" />
					Log hours
				</Button>
			) : null}
			{step ? (
				<Button
					size="sm"
					disabled={movingTo !== null}
					onClick={() => onMove(task, step.status)}
					className="flex-1 bg-[#2563EB] text-white shadow-none hover:bg-[#1D4ED8]"
				>
					{movingTo === step.status ? <Loader2 className="size-3.5 animate-spin" /> : <ArrowRight className="size-3.5" />}
					{step.label}
				</Button>
			) : null}
		</div>
	);
}
