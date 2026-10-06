"use client";

import { StatusBadge } from "@/components/shared";
import type { MyTask } from "@/types/task.type";
import { TaskDue } from "./task-due";

interface MyTaskCardProps {
	task: MyTask;
	approvedHours: number;
	pendingHours: number;
	onOpen: (task: MyTask) => void;
	/** Buttons under the card (log hours, next step) */
	actions: React.ReactNode;
}

const STATUS_NOTE: Partial<Record<MyTask["status"], string>> = {
	SUBMITTED: "Waiting for your manager's review",
	REJECTED: "Sent back — check the feedback and restart",
	APPROVED: "Approved",
	COMPLETED: "Done",
};

export function MyTaskCard({ task, approvedHours, pendingHours, onOpen, actions }: MyTaskCardProps) {
	const estimate = task.estimatedHours ?? 0;
	const note = STATUS_NOTE[task.status];

	return (
		<article className="flex flex-col rounded-lg border border-[#E2E8F0] bg-white p-4 shadow-2xs dark:border-[#1E293B] dark:bg-[#0F172A]">
			<button
				type="button"
				onClick={() => onOpen(task)}
				className="group -m-1 rounded-md p-1 text-left focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:outline-none"
			>
				<div className="flex items-start justify-between gap-3">
					<p className="line-clamp-2 text-sm font-semibold text-[#0F172A] group-hover:text-[#1D4ED8] dark:text-white dark:group-hover:text-[#60A5FA]">
						{task.title}
					</p>
					<StatusBadge status={task.status} className="shrink-0" />
				</div>
				<p className="mt-0.5 truncate text-xs text-[#64748B] dark:text-[#94A3B8]">{task.project.name}</p>

				<div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5">
					<StatusBadge status={task.priority} />
					<TaskDue task={task} verbose />
				</div>

				<div className="mt-3 flex items-center justify-between text-xs tabular-nums">
					<span className="text-[#334155] dark:text-[#CBD5E1]">
						{approvedHours} h approved{estimate > 0 ? ` of ${estimate} h estimated` : ""}
					</span>
					{pendingHours > 0 ? <span className="text-[#D97706]">+{pendingHours} h in review</span> : null}
				</div>
			</button>

			{note ? <p className="mt-3 text-xs text-[#64748B] dark:text-[#94A3B8]">{note}</p> : null}
			<div className="mt-auto pt-4">{actions}</div>
		</article>
	);
}
