"use client";
import { focusNextOnEnter } from "@/lib/form";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { fieldClass, FormField } from "@/components/shared";
import { useDepartments } from "@/hooks/department.hook";
import { useUpdateEmployee } from "@/hooks/employee.hook";
import { useRoles } from "@/hooks/role.hook";
import { useCan, useCurrentUser } from "@/hooks/auth.hook";
import { ESTIMATED_HOURS_PER_MONTH, formatCurrency, getPaySummary, toAmount } from "@/lib/pay";
import { cn, formatRoleName } from "@/lib/utils";
import { employeeEditSchema, type EmployeeEditValues } from "@/validation/employee.validation";
import type { Employee } from "@/types/employee.type";

const NO_DEPARTMENT = "__none__";

interface EmployeeEditDialogProps {
	employee: Employee | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function EmployeeEditDialog({ employee, open, onOpenChange }: EmployeeEditDialogProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="border-[#E2E8F0] bg-white sm:max-w-lg dark:border-[#1E293B] dark:bg-[#0F172A]">
				{/* key: a fresh form whenever a different employee is edited */}
				{employee ? (
					<EditForm key={employee.id} employee={employee} onDone={() => onOpenChange(false)} />
				) : null}
			</DialogContent>
		</Dialog>
	);
}

function EditForm({ employee, onDone }: { employee: Employee; onDone: () => void }) {
	const { data: departments = [] } = useDepartments();
	// You can't reassign your own role (the backend rejects it), so don't offer it
	const isSelf = useCurrentUser().id === employee.user.id;
	const canEditRole = useCan()("role.update") && !isSelf;
	const { data: roles = [] } = useRoles(canEditRole);
	const update = useUpdateEmployee();

	const {
		register,
		handleSubmit,
		control,
		setValue,
		formState: { errors, isDirty },
	} = useForm<EmployeeEditValues>({
		resolver: zodResolver(employeeEditSchema),
		defaultValues: {
			jobTitle: employee.jobTitle,
			departmentId: employee.department?.id ?? NO_DEPARTMENT,
			roleId: employee.user.roleId,
			salaryType: employee.salaryType,
			salary: employee.salary != null ? String(employee.salary) : "",
			hourlyRate: employee.hourlyRate != null ? String(employee.hourlyRate) : "",
		},
	});

	const [salaryType, salary, hourlyRate, departmentId, roleId] = useWatch({
		control,
		name: ["salaryType", "salary", "hourlyRate", "departmentId", "roleId"],
	});
	const pay = getPaySummary(salaryType, toAmount(salary), toAmount(hourlyRate));

	function onSubmit(values: EmployeeEditValues) {
		update.mutate(
			{
				id: employee.id,
				jobTitle: values.jobTitle,
				departmentId:
					values.departmentId && values.departmentId !== NO_DEPARTMENT ? values.departmentId : undefined,
				roleId: canEditRole ? values.roleId : undefined,
				salaryType: values.salaryType,
				salary: values.salaryType === "MONTHLY" ? Number(values.salary) : undefined,
				hourlyRate: values.salaryType === "HOURLY" ? Number(values.hourlyRate) : undefined,
			},
			{ onSuccess: onDone },
		);
	}

	return (
		<form onKeyDown={focusNextOnEnter} onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
			<DialogHeader>
				<DialogTitle className="text-[#0F172A] dark:text-white">Edit employee</DialogTitle>
				<DialogDescription>
					{employee.user.name} ({employee.employeeCode}). Name and email can&apos;t be changed here.
				</DialogDescription>
			</DialogHeader>

			<FormField id="edit-job-title" label="Job title" error={errors.jobTitle?.message}>
				<Input
					id="edit-job-title"
					placeholder="Frontend Developer"
					aria-invalid={Boolean(errors.jobTitle)}
					{...register("jobTitle")}
					className={cn("h-10", fieldClass)}
				/>
			</FormField>

			<FormField id="edit-department" label="Department" error={errors.departmentId?.message}>
				<Select
					value={departmentId || NO_DEPARTMENT}
					onValueChange={(value) => setValue("departmentId", value, { shouldValidate: true, shouldDirty: true })}
				>
					<SelectTrigger id="edit-department" className={cn("h-10 w-full", fieldClass)}>
						<SelectValue placeholder="Select a department" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value={NO_DEPARTMENT}>No department</SelectItem>
						{departments.map((department) => (
							<SelectItem key={department.id} value={department.id}>
								{department.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</FormField>

			{canEditRole ? (
				<FormField id="edit-role" label="Role" error={errors.roleId?.message} hint="Changing the role takes effect without the employee re-logging in">
					<Select
						value={roleId}
						onValueChange={(value) => setValue("roleId", value, { shouldValidate: true, shouldDirty: true })}
					>
						<SelectTrigger id="edit-role" className={cn("h-10 w-full", fieldClass)}>
							<SelectValue placeholder="Select a role" />
						</SelectTrigger>
						<SelectContent>
							{roles.map((role) => (
								<SelectItem key={role.id} value={role.id}>
									{formatRoleName(role.name)}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</FormField>
			) : null}

			<RadioGroup
				value={salaryType}
				onValueChange={(value) => setValue("salaryType", value as "MONTHLY" | "HOURLY", { shouldValidate: true, shouldDirty: true })}
				className="grid gap-3 sm:grid-cols-2"
			>
				{[
					{ value: "MONTHLY", label: "Monthly salary", hint: "Same fixed amount every month" },
					{ value: "HOURLY", label: "Hourly rate", hint: "Approved work hours × rate" },
				].map((option) => (
					<label
						key={option.value}
						htmlFor={`edit-salary-${option.value}`}
						className={cn(
							"flex cursor-pointer items-start gap-3 rounded-md border p-4 transition-colors",
							salaryType === option.value
								? "border-[#2563EB] bg-[#EFF6FF] dark:bg-[#1E293B]"
								: "border-[#E2E8F0] hover:border-[#CBD5E1] dark:border-[#1E293B]",
						)}
					>
						<RadioGroupItem
							value={option.value}
							id={`edit-salary-${option.value}`}
							className="mt-0.5 border-[#2563EB] text-[#2563EB]"
						/>
						<div>
							<p className="text-sm font-medium text-[#0F172A] dark:text-white">{option.label}</p>
							<p className="text-xs text-[#64748B] dark:text-[#94A3B8]">{option.hint}</p>
						</div>
					</label>
				))}
			</RadioGroup>

			<FormField
				id={salaryType === "MONTHLY" ? "edit-salary" : "edit-hourly-rate"}
				label={salaryType === "MONTHLY" ? "Monthly salary" : "Hourly rate"}
				error={salaryType === "MONTHLY" ? errors.salary?.message : errors.hourlyRate?.message}
			>
				<div className="relative">
					<span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-[#64748B] dark:text-[#94A3B8]">
						$
					</span>
					{salaryType === "MONTHLY" ? (
						<Input
							key="edit-salary"
							id="edit-salary"
							type="number"
							inputMode="decimal"
							min="1"
							step="0.01"
							placeholder="5,000.00"
							aria-invalid={Boolean(errors.salary)}
							{...register("salary")}
							className={cn("h-10 pr-20 pl-7 tabular-nums", fieldClass)}
						/>
					) : (
						<Input
							key="edit-hourly-rate"
							id="edit-hourly-rate"
							type="number"
							inputMode="decimal"
							min="1"
							step="0.01"
							placeholder="45.00"
							aria-invalid={Boolean(errors.hourlyRate)}
							{...register("hourlyRate")}
							className={cn("h-10 pr-20 pl-7 tabular-nums", fieldClass)}
						/>
					)}
					<span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-[#64748B] dark:text-[#94A3B8]">
						USD / {salaryType === "MONTHLY" ? "month" : "hour"}
					</span>
				</div>
			</FormField>

			{pay ? (
				<div className="rounded-md border border-[#DBEAFE] bg-[#EFF6FF] p-3 text-sm dark:border-[#1E3A5F] dark:bg-[#0B1120]">
					<span className="text-[#64748B] dark:text-[#94A3B8]">
						{pay.isEstimate ? "Est. monthly" : "Monthly"}:{" "}
					</span>
					<span className="font-semibold text-[#0F172A] tabular-nums dark:text-white">
						{formatCurrency(pay.monthly)}
					</span>
					{pay.isEstimate ? (
						<span className="text-[#64748B] dark:text-[#94A3B8]">
							{" "}
							({formatCurrency(pay.rate)} × {ESTIMATED_HOURS_PER_MONTH} h)
						</span>
					) : null}
				</div>
			) : null}

			<DialogFooter>
				<Button
					type="button"
					variant="outline"
					onClick={onDone}
					disabled={update.isPending}
					className="border-[#E2E8F0] text-[#334155] dark:border-[#1E293B] dark:text-[#CBD5E1]"
				>
					Cancel
				</Button>
				<Button
					type="submit"
					disabled={update.isPending || !isDirty}
					className="bg-[#2563EB] text-white shadow-none hover:bg-[#1D4ED8]"
				>
					{update.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
					Save changes
				</Button>
			</DialogFooter>
		</form>
	);
}
