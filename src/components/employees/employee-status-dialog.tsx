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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { StatusBadge } from "@/components/shared";
import { useUpdateEmployeeStatus } from "@/hooks/employee.hook";
import { cn } from "@/lib/utils";
import type { Employee, EmployeeStatus } from "@/types/employee.type";

// Matches what the backend enforces for each status
const STATUS_OPTIONS: { value: EmployeeStatus; effect: string }[] = [
	{ value: "ACTIVE", effect: "Full access: gets tasks, submits work, receives payroll." },
	{
		value: "INACTIVE",
		effect: "Can log in and see their tasks, but can't get new tasks or submit work.",
	},
	{
		value: "SUSPENDED",
		effect: "Can log in, but can't see tasks, get new tasks or submit work.",
	},
	{
		value: "TERMINATED",
		effect: "Loses all access and is excluded from payroll. Records are kept.",
	},
];

interface EmployeeStatusDialogProps {
	employee: Employee | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function EmployeeStatusDialog({ employee, open, onOpenChange }: EmployeeStatusDialogProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="border-[#E2E8F0] bg-white sm:max-w-lg dark:border-[#1E293B] dark:bg-[#0F172A]">
				{employee ? (
					<StatusForm employee={employee} onDone={() => onOpenChange(false)} />
				) : null}
			</DialogContent>
		</Dialog>
	);
}

function StatusForm({ employee, onDone }: { employee: Employee; onDone: () => void }) {
	const [status, setStatus] = useState<EmployeeStatus>(employee.status);
	const updateStatus = useUpdateEmployeeStatus();
	const unchanged = status === employee.status;
	const isTerminating = status === "TERMINATED";

	return (
		<>
			<DialogHeader>
				<DialogTitle className="text-[#0F172A] dark:text-white">Change status</DialogTitle>
				<DialogDescription>
					{employee.user.name} ({employee.employeeCode}) is currently{" "}
					{employee.status.toLowerCase()}.
				</DialogDescription>
			</DialogHeader>

			<RadioGroup
				value={status}
				onValueChange={(value) => setStatus(value as EmployeeStatus)}
				className="gap-2"
			>
				{STATUS_OPTIONS.map((option) => {
					const isCurrent = option.value === employee.status;
					const isSelected = option.value === status;
					return (
						<label
							key={option.value}
							htmlFor={`status-${option.value}`}
							className={cn(
								"flex cursor-pointer items-start gap-3 rounded-md border p-3 transition-colors",
								isSelected
									? "border-[#2563EB] bg-[#EFF6FF] dark:bg-[#1E293B]"
									: "border-[#E2E8F0] hover:border-[#CBD5E1] dark:border-[#1E293B]",
								isCurrent && "cursor-default opacity-60",
							)}
						>
							<RadioGroupItem
								id={`status-${option.value}`}
								value={option.value}
								disabled={isCurrent}
								className="mt-0.5 border-[#2563EB] text-[#2563EB]"
							/>
							<div className="min-w-0 flex-1">
								<div className="flex items-center gap-2">
									<StatusBadge status={option.value} />
									{isCurrent ? (
										<span className="text-xs text-[#64748B] dark:text-[#94A3B8]">Current</span>
									) : null}
								</div>
								<p className="mt-1 text-xs text-[#334155] dark:text-[#CBD5E1]">
									{option.effect}
								</p>
							</div>
						</label>
					);
				})}
			</RadioGroup>

			<DialogFooter>
				<Button
					type="button"
					variant="outline"
					onClick={onDone}
					disabled={updateStatus.isPending}
					className="border-[#E2E8F0] text-[#334155] dark:border-[#1E293B] dark:text-[#CBD5E1]"
				>
					Cancel
				</Button>
				<Button
					type="button"
					variant={isTerminating ? "destructive" : "default"}
					disabled={unchanged || updateStatus.isPending}
					onClick={() =>
						updateStatus.mutate({ id: employee.id, status }, { onSuccess: onDone })
					}
					className={isTerminating ? undefined : "bg-[#2563EB] text-white shadow-none hover:bg-[#1D4ED8]"}
				>
					{updateStatus.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
					{unchanged ? "Choose a new status" : `Set to ${status.toLowerCase()}`}
				</Button>
			</DialogFooter>
		</>
	);
}
