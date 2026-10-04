"use client";

import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, Loader2 } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useCurrentUser } from "@/hooks/auth.hook";
import { useEmployeeOptions } from "@/hooks/employee.hook";
import { monthToRange, useGeneratePayroll } from "@/hooks/payroll.hook";
import { useApprovedSubmissions } from "@/hooks/submission.hook";
import { formatCurrency, toAmount } from "@/lib/pay";
import {
	generatePayrollSchema,
	type GeneratePayrollValues,
} from "@/validation/payroll.validation";
import { currentMonth, round2 } from "@/lib/utils";

const fieldClass =
	"border-[#CBD5E1] bg-white text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus-visible:border-[#2563EB] focus-visible:ring-1 focus-visible:ring-[#2563EB] dark:border-[#1E293B] dark:bg-[#0B1120] dark:text-white";

const isMonth = (value: string) => /^\d{4}-\d{2}$/.test(value);

const monthLabel = (period: string) => {
	if (!isMonth(period)) return "this period";
	const [year, month] = period.split("-").map(Number);
	return new Date(Date.UTC(year, month - 1, 1)).toLocaleDateString("en-US", {
		month: "long",
		year: "numeric",
		timeZone: "UTC",
	});
};


function FieldError({ message }: { message?: string }) {
	return message ? <p className="text-xs text-[#DC2626]">{message}</p> : null;
}

function PreviewRow({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
	return (
		<div className="flex justify-between gap-4">
			<dt className="text-[#64748B] dark:text-[#94A3B8]">{label}</dt>
			<dd
				className={
					strong
						? "font-bold text-[#0F172A] tabular-nums dark:text-white"
						: "text-[#334155] tabular-nums dark:text-[#CBD5E1]"
				}
			>
				{value}
			</dd>
		</div>
	);
}

interface GeneratePayrollDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function GeneratePayrollDialog({ open, onOpenChange }: GeneratePayrollDialogProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="border-[#E2E8F0] bg-white sm:max-w-lg dark:border-[#1E293B] dark:bg-[#0F172A]">
				<GenerateForm onDone={() => onOpenChange(false)} />
			</DialogContent>
		</Dialog>
	);
}

function GenerateForm({ onDone }: { onDone: () => void }) {
	const generate = useGeneratePayroll();
	const { data: allEmployees = [], isLoading } = useEmployeeOptions();
	const currentUser = useCurrentUser();
	// The backend refuses payroll for yourself, so don't offer it
	const employees = allEmployees.filter(
		(employee) => employee.status !== "TERMINATED" && employee.user.id !== currentUser.id,
	);

	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm<GeneratePayrollValues>({
		resolver: zodResolver(generatePayrollSchema),
		defaultValues: { employeeId: "", period: currentMonth(), deductions: "" },
	});

	const [employeeId, period, deductionsInput] = useWatch({
		control,
		name: ["employeeId", "period", "deductions"],
	});
	const selected = employees.find((employee) => employee.id === employeeId);
	const isHourly = selected?.salaryType === "HOURLY";
	const deductions = toAmount(deductionsInput) ?? 0;
	const isFuture = isMonth(period) && period > currentMonth();

	// Same rule as the backend: approved hours with a work date inside the month
	const approved = useApprovedSubmissions(isHourly ? employeeId : null);
	let hours: number | null = null;
	if (isHourly && approved.data && isMonth(period)) {
		const { periodStart, periodEnd } = monthToRange(period);
		hours = approved.data
			.filter((submission) => submission.workDate >= periodStart && submission.workDate <= periodEnd)
			.reduce((sum, submission) => sum + submission.hoursWorked, 0);
	}

	let gross: number | null = null;
	if (selected && !isHourly) gross = round2(selected.salary ?? 0);
	if (selected && isHourly && hours !== null) gross = round2(hours * (selected.hourlyRate ?? 0));
	const net = gross !== null ? round2(gross - deductions) : null;

	let blockReason: string | null = null;
	if (isFuture) {
		blockReason = `${monthLabel(period)} hasn't started yet.`;
	} else if (selected && isHourly && hours === 0) {
		blockReason = `${selected.user.name} has no approved work hours in ${monthLabel(period)}.${
			selected.status !== "ACTIVE" ? ` Their status is ${selected.status.toLowerCase()}, so they can't log work.` : ""
		}`;
	} else if (selected && gross === 0) {
		blockReason = `${selected.user.name} has no ${isHourly ? "hourly rate" : "monthly salary"} set.`;
	} else if (net !== null && net < 0) {
		blockReason = "Deductions are higher than the gross pay.";
	}

	let preview;
	if (!selected) {
		preview = (
			<p className="text-sm text-[#64748B] dark:text-[#94A3B8]">
				Choose an employee to preview the amount.
			</p>
		);
	} else if (isHourly && approved.isLoading) {
		preview = (
			<p className="flex items-center gap-2 text-sm text-[#64748B] dark:text-[#94A3B8]">
				<Loader2 className="size-4 animate-spin" />
				Checking approved hours...
			</p>
		);
	} else if (isHourly && approved.isError) {
		// e.g. Finance Manager has no submission.view permission
		preview = (
			<p className="text-sm text-[#334155] dark:text-[#CBD5E1]">
				Gross = approved work hours in {monthLabel(period)} ×{" "}
				<span className="font-semibold tabular-nums">
					{formatCurrency(selected.hourlyRate ?? 0)}/h
				</span>
				, minus deductions. Calculated when you generate.
			</p>
		);
	} else if (gross !== null && net !== null) {
		preview = (
			<dl className="space-y-1.5 text-sm">
				{isHourly ? (
					<PreviewRow
						label={`Approved hours (${monthLabel(period)})`}
						value={`${hours} h × ${formatCurrency(selected.hourlyRate ?? 0)}`}
					/>
				) : null}
				<PreviewRow
					label={isHourly ? "Gross" : "Gross (monthly salary)"}
					value={formatCurrency(gross)}
				/>
				<PreviewRow label="Deductions" value={`− ${formatCurrency(deductions)}`} />
				<div className="border-t border-[#DBEAFE] pt-1.5 dark:border-[#1E3A5F]">
					<PreviewRow label="Net pay" value={formatCurrency(net)} strong />
				</div>
			</dl>
		);
	}

	return (
		<form
			onSubmit={handleSubmit((values) => generate.mutate(values, { onSuccess: onDone }))}
			className="space-y-5"
			noValidate
		>
			<DialogHeader>
				<DialogTitle className="text-[#0F172A] dark:text-white">Generate payroll</DialogTitle>
				<DialogDescription>
					Creates a draft for one employee and month. Approve it before paying.
				</DialogDescription>
			</DialogHeader>

			<div className="space-y-1.5">
				<Label className="text-xs font-semibold">Employee</Label>
				<Controller
					control={control}
					name="employeeId"
					render={({ field }) => (
						<Select value={field.value || undefined} onValueChange={field.onChange}>
							<SelectTrigger
								aria-invalid={Boolean(errors.employeeId)}
								className={`h-10 w-full ${fieldClass}`}
							>
								<SelectValue placeholder={isLoading ? "Loading..." : "Choose an employee"} />
							</SelectTrigger>
							<SelectContent>
								{employees.map((employee) => (
									<SelectItem key={employee.id} value={employee.id}>
										{employee.user.name}
										<span className="text-[#94A3B8]">
											· {employee.employeeCode} · {employee.salaryType === "HOURLY" ? "Hourly" : "Monthly"}
										</span>
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					)}
				/>
				<FieldError message={errors.employeeId?.message} />
			</div>

			<div className="grid gap-4 sm:grid-cols-2">
				<div className="space-y-1.5">
					<Label htmlFor="payroll-period" className="text-xs font-semibold">
						Pay period
					</Label>
					<Input
						id="payroll-period"
						type="month"
						max={currentMonth()}
						aria-invalid={Boolean(errors.period)}
						{...register("period")}
						className={`h-10 ${fieldClass}`}
					/>
					<FieldError message={errors.period?.message} />
				</div>
				<div className="space-y-1.5">
					<Label htmlFor="payroll-deductions" className="text-xs font-semibold">
						Deductions <span className="font-normal text-[#94A3B8]">(optional)</span>
					</Label>
					<div className="relative">
						<span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-[#64748B]">
							$
						</span>
						<Input
							id="payroll-deductions"
							type="number"
							inputMode="decimal"
							min="0"
							step="0.01"
							placeholder="0.00"
							aria-invalid={Boolean(errors.deductions)}
							{...register("deductions")}
							className={`h-10 pl-7 tabular-nums ${fieldClass}`}
						/>
					</div>
					<FieldError message={errors.deductions?.message} />
				</div>
			</div>

			<div
				aria-live="polite"
				className="space-y-3 rounded-md border border-[#DBEAFE] bg-[#EFF6FF] p-4 dark:border-[#1E3A5F] dark:bg-[#0B1120]"
			>
				{preview}
				{blockReason ? (
					<p className="flex items-start gap-2 text-sm font-medium text-[#DC2626]">
						<AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
						{blockReason}
					</p>
				) : null}
			</div>

			<DialogFooter>
				<Button
					type="button"
					variant="outline"
					onClick={onDone}
					disabled={generate.isPending}
					className="border-[#E2E8F0] text-[#334155] dark:border-[#1E293B] dark:text-[#CBD5E1]"
				>
					Cancel
				</Button>
				<Button
					type="submit"
					disabled={generate.isPending || blockReason !== null}
					className="bg-[#2563EB] text-white shadow-none hover:bg-[#1D4ED8]"
				>
					{generate.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
					Generate draft
				</Button>
			</DialogFooter>
		</form>
	);
}
