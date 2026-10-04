"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useActiveEmployees } from "@/hooks/employee.hook";
import { useAssignTask } from "@/hooks/task.hook";
import type { Task } from "@/types/task.type";

interface AssignTaskDialogProps {
	task: Task | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function AssignTaskDialog({ task, open, onOpenChange }: AssignTaskDialogProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="border-[#E2E8F0] bg-white sm:max-w-md dark:border-[#1E293B] dark:bg-[#0F172A]">
				{task ? <AssignForm task={task} onDone={() => onOpenChange(false)} /> : null}
			</DialogContent>
		</Dialog>
	);
}

function AssignForm({ task, onDone }: { task: Task; onDone: () => void }) {
	const [employeeId, setEmployeeId] = useState(task.employeeId);
	const assignTask = useAssignTask();
	const { data: employees = [], isLoading } = useActiveEmployees();
	const unchanged = employeeId === task.employeeId;

	return (
		<>
			<DialogHeader>
				<DialogTitle className="text-[#0F172A] dark:text-white">Reassign task</DialogTitle>
				<DialogDescription>
					&ldquo;{task.title}&rdquo; is assigned to {task.employee.user.name}. Only active
					employees can take tasks.
				</DialogDescription>
			</DialogHeader>

			<div className="space-y-1.5">
				<Label className="text-xs font-semibold">New assignee</Label>
				<Select value={employeeId} onValueChange={setEmployeeId}>
					<SelectTrigger className="h-10 w-full border-[#CBD5E1] bg-white text-sm text-[#0F172A] dark:border-[#1E293B] dark:bg-[#0B1120] dark:text-white">
						<SelectValue placeholder={isLoading ? "Loading..." : "Choose an employee"} />
					</SelectTrigger>
					<SelectContent>
						{employees.map((employee) => (
							<SelectItem key={employee.id} value={employee.id}>
								{employee.user.name}
								<span className="text-[#94A3B8]">· {employee.jobTitle}</span>
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<DialogFooter>
				<Button
					type="button"
					variant="outline"
					onClick={onDone}
					disabled={assignTask.isPending}
					className="border-[#E2E8F0] text-[#334155] dark:border-[#1E293B] dark:text-[#CBD5E1]"
				>
					Cancel
				</Button>
				<Button
					type="button"
					disabled={unchanged || assignTask.isPending}
					onClick={() => assignTask.mutate({ id: task.id, employeeId }, { onSuccess: onDone })}
					className="bg-[#2563EB] text-white shadow-none hover:bg-[#1D4ED8]"
				>
					{assignTask.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
					Reassign
				</Button>
			</DialogFooter>
		</>
	);
}
