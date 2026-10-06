"use client";

import { Check, ChevronDown, RefreshCw } from "lucide-react";
import { StatusBadge } from "@/components/shared";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUpdateProjectStatus } from "@/hooks/project.hook";
import type { ProjectStatus } from "@/types/project.type";

export const PROJECT_STATUSES: ProjectStatus[] = ["PLANNED", "ACTIVE", "ON_HOLD", "COMPLETED", "CANCELLED"];

interface StatusTarget {
	id: string;
	status: ProjectStatus;
}

const itemClass = "gap-2 text-[#334155] focus:bg-[#F8FAFC] dark:text-[#CBD5E1] dark:focus:bg-[#1E293B]";
const menuClass = "w-48 border-[#E2E8F0] bg-white dark:border-[#1E293B] dark:bg-[#0F172A]";

function StatusItems({ project }: { project: StatusTarget }) {
	const update = useUpdateProjectStatus();
	return PROJECT_STATUSES.map((status) => {
		const current = status === project.status;
		return (
			<DropdownMenuItem
				key={status}
				disabled={current || update.isPending}
				className={itemClass}
				onSelect={() => update.mutate({ id: project.id, status })}
			>
				<StatusBadge status={status} />
				{current ? <Check className="ml-auto size-4 text-[#2563EB]" aria-label="Current status" /> : null}
			</DropdownMenuItem>
		);
	});
}

/** "Change status ›" inside an existing row menu */
export function ProjectStatusSubmenu({ project }: { project: StatusTarget }) {
	return (
		<DropdownMenuSub>
			<DropdownMenuSubTrigger className={itemClass}>
				<RefreshCw className="size-4" />
				Change status
			</DropdownMenuSubTrigger>
			<DropdownMenuSubContent className={menuClass}>
				<StatusItems project={project} />
			</DropdownMenuSubContent>
		</DropdownMenuSub>
	);
}

/** Standalone button, e.g. in the project page header */
export function ProjectStatusButton({ project }: { project: StatusTarget }) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="outline"
					className="h-9 border-[#E2E8F0] text-sm text-[#334155] dark:border-[#1E293B] dark:text-[#CBD5E1]"
				>
					<RefreshCw className="size-4" />
					Change status
					<ChevronDown className="size-4 text-[#94A3B8]" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className={menuClass}>
				<StatusItems project={project} />
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
