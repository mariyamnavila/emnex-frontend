"use client";

import { ClipboardList } from "lucide-react";
import { StatusBadge, UserAvatar } from "@/components/shared";
import type { BoardTask } from "@/types/task.type";
import { TaskDue } from "./task-due";

export function TaskCard({ task, onOpen }: { task: BoardTask; onOpen: (task: BoardTask) => void }) {
	return (
		<button
			type="button"
			onClick={() => onOpen(task)}
			className="group relative w-full rounded-lg border border-[#E2E8F0] bg-white p-3 text-left shadow-2xs transition-colors hover:border-[#93C5FD] focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:outline-none dark:border-[#1E293B] dark:bg-[#0F172A] dark:hover:border-[#1D4ED8]"
		>
			<p className="line-clamp-2 text-sm font-medium text-[#0F172A] group-hover:text-[#1D4ED8] dark:text-white dark:group-hover:text-[#60A5FA]">
				{task.title}
			</p>
			<p className="mt-0.5 truncate text-xs text-[#64748B] dark:text-[#94A3B8]">{task.project.name}</p>

			<div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5">
				<StatusBadge status={task.priority} />
				<TaskDue task={task} />
				{task._count.submissions > 0 ? (
					<span
						className="inline-flex items-center gap-1 text-xs text-[#64748B] tabular-nums dark:text-[#94A3B8]"
						title={`${task._count.submissions} work log${task._count.submissions === 1 ? "" : "s"}`}
					>
						<ClipboardList className="size-3.5" aria-hidden="true" />
						{task._count.submissions}
					</span>
				) : null}
			</div>

			<div className="mt-3 flex items-center gap-2 border-t border-[#F1F5F9] pt-2.5 dark:border-[#1E293B]">
				<UserAvatar name={task.employee.user.name} src={task.employee.user.avatar} size="sm" />
				<span className="truncate text-xs text-[#334155] dark:text-[#CBD5E1]">{task.employee.user.name}</span>
			</div>
		</button>
	);
}
