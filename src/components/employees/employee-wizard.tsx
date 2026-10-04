"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	ChevronLeft,
	ChevronRight,
	Check,
	Copy,
	Loader2,
	Send,
} from "lucide-react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	employeeBasicSchema,
	employeeCreateSchema,
	employeeJobSchema,
	employeeSalarySchema,
	type EmployeeCreateValues,
} from "@/validation/employee.validation";
import {
	type CreateEmployeeResult,
	useCreateEmployee,
} from "@/hooks/employee.hook";
import { useRoles } from "@/hooks/role.hook";
import { useDepartments } from "@/hooks/department.hook";
import { useCopy } from "@/hooks/use-copy";
import { DetailList, DetailRow, SectionHeading } from "@/components/shared";
import {
	ESTIMATED_HOURS_PER_MONTH,
	formatCurrency,
	getPaySummary,
	toAmount,
} from "@/lib/pay";
import { formatDate, formatRoleName } from "@/lib/utils";

const STEPS = [
	{ number: 1, label: "Personal", hint: "Name & login email" },
	{ number: 2, label: "Position", hint: "Role, team & start date" },
	{ number: 3, label: "Pay & review", hint: "Compensation & summary" },
] as const;

const STEP_FIELDS: Record<number, string[]> = {
	1: ["name", "email"],
	2: ["jobTitle", "roleId", "joiningDate"],
	3: ["salaryType", "salary", "hourlyRate"],
};

const STEP_SCHEMAS = {
	1: employeeBasicSchema,
	2: employeeJobSchema,
	3: employeeSalarySchema,
};

const NO_DEPARTMENT = "__none__";

const inputClass =
	"h-10 border-[#CBD5E1] bg-white text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus-visible:border-[#2563EB] focus-visible:ring-1 focus-visible:ring-[#2563EB] dark:border-[#1E293B] dark:bg-[#0B1120] dark:text-white";

function FieldError({ message }: { message?: unknown }) {
	if (typeof message !== "string" || !message) return null;
	return <p className="text-xs text-[#DC2626]">{message}</p>;
}

export function EmployeeWizard() {
	const router = useRouter();
	const { copy } = useCopy();
	const [step, setStep] = useState(1);
	// Set after a successful create → opens the credentials dialog
	const [created, setCreated] = useState<CreateEmployeeResult | null>(null);
	const createEmployee = useCreateEmployee();
	const { data: departments = [] } = useDepartments();
	const { data: roles = [] } = useRoles();

	const {
		register,
		handleSubmit,
		setValue,
		trigger,
		getValues,
		watch,
		formState: { errors },
	} = useForm<EmployeeCreateValues>({
		resolver: zodResolver(employeeCreateSchema),
		defaultValues: {
			name: "",
			email: "",
			jobTitle: "",
			roleId: "",
			departmentId: "",
			joiningDate: "",
			salaryType: "MONTHLY",
			salary: "",
			hourlyRate: "",
		},
		mode: "onTouched",
	});

	// watch() (no args) re-renders on every keystroke, so the pay preview and
	// review update live. getValues() does NOT re-render — that was the old bug.
	const values = watch();
	const salaryType = values.salaryType;
	const pay = getPaySummary(
		salaryType,
		toAmount(values.salary),
		toAmount(values.hourlyRate),
	);
	const roleName = roles.find((role) => role.id === values.roleId)?.name;
	const departmentName = departments.find(
		(department) => department.id === values.departmentId,
	)?.name;

	async function goTo(nextStep: number) {
		if (nextStep > step) {
			const fields = STEP_FIELDS[step] ?? [];
			const valid = await trigger(fields as never, { shouldFocus: true });
			if (!valid) return;
			// Also confirm the current step data passes its schema
			const parsed = STEP_SCHEMAS[
				step as 1 | 2 | 3
			].safeParse(getValues());
			if (!parsed.success) return;
		}
		setStep(nextStep);
	}

	// Leaving the dialog (Done / Esc / outside click) returns to the list
	function finish() {
		setCreated(null);
		router.push("/admin/employees");
	}

	function onSubmit(values: EmployeeCreateValues) {
		createEmployee.mutate(
			{
				name: values.name,
				email: values.email,
				roleId: values.roleId,
				departmentId:
					values.departmentId && values.departmentId !== NO_DEPARTMENT
						? values.departmentId
						: undefined,
				jobTitle: values.jobTitle,
				salaryType: values.salaryType,
				salary:
					values.salaryType === "MONTHLY"
						? Number(values.salary)
						: undefined,
				hourlyRate:
					values.salaryType === "HOURLY"
						? Number(values.hourlyRate)
						: undefined,
				joiningDate: new Date(values.joiningDate).toISOString(),
			},
			{ onSuccess: ({ data }) => setCreated(data) },
		);
	}

	return (
		<div className="mx-auto max-w-2xl">
			{/* Stepper */}
			<ol className="flex items-start gap-2" aria-label="Progress">
				{STEPS.map((item, index) => {
					const isDone = step > item.number;
					const isCurrent = step === item.number;
					return (
						<li
							key={item.number}
							aria-current={isCurrent ? "step" : undefined}
							className="flex flex-1 items-start gap-2.5"
						>
							<span
								className={`flex size-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition-colors ${
									isDone
										? "border-[#16A34A] bg-[#16A34A] text-white"
										: isCurrent
											? "border-[#2563EB] bg-[#2563EB] text-white ring-4 ring-[#DBEAFE] dark:ring-[#1E3A5F]"
											: "border-[#CBD5E1] bg-white text-[#64748B] dark:border-[#1E293B] dark:bg-[#0F172A] dark:text-[#94A3B8]"
								}`}
							>
								{isDone ? <Check className="size-4" /> : item.number}
							</span>
							<div className="min-w-0 pt-0.5">
								<p
									className={`text-sm font-medium ${
										isCurrent || isDone
											? "text-[#0F172A] dark:text-white"
											: "text-[#94A3B8]"
									}`}
								>
									{item.label}
								</p>
								<p className="hidden text-xs text-[#64748B] sm:block dark:text-[#94A3B8]">
									{item.hint}
								</p>
							</div>
							{index < STEPS.length - 1 ? (
								<span
									aria-hidden="true"
									className={`mt-4 hidden h-px flex-1 sm:block ${step > item.number ? "bg-[#16A34A]" : "bg-[#E2E8F0] dark:bg-[#1E293B]"}`}
								/>
							) : null}
						</li>
					);
				})}
			</ol>

			<form
				onSubmit={handleSubmit(onSubmit)}
				className="mt-6 rounded-lg border border-[#E2E8F0] bg-white p-6 dark:border-[#1E293B] dark:bg-[#0F172A]"
			>
				{step === 1 ? (
					<div className="space-y-4">
						<div>
							<h2 className="text-base font-semibold text-[#0F172A] dark:text-white">
								Personal information
							</h2>
							<p className="mt-1 text-xs text-[#64748B] dark:text-[#94A3B8]">
								The employee&apos;s identity and login email.
							</p>
						</div>
						<div className="space-y-1.5">
							<Label htmlFor="name" className="text-xs font-semibold">
								Full name
							</Label>
							<Input
								id="name"
								placeholder="Jane Doe"
								{...register("name")}
								className={inputClass}
							/>
							<FieldError message={errors.name?.message} />
						</div>
						<div className="space-y-1.5">
							<Label htmlFor="email" className="text-xs font-semibold">
								Email address
							</Label>
							<Input
								id="email"
								type="email"
								placeholder="jane@company.com"
								{...register("email")}
								className={inputClass}
							/>
							<FieldError message={errors.email?.message} />
						</div>
					</div>
				) : null}

				{step === 2 ? (
					<div className="space-y-4">
						<div>
							<h2 className="text-base font-semibold text-[#0F172A] dark:text-white">
								Position
							</h2>
							<p className="mt-1 text-xs text-[#64748B] dark:text-[#94A3B8]">
								Job title, access role, team and start date.
							</p>
						</div>
						<div className="space-y-1.5">
							<Label htmlFor="jobTitle" className="text-xs font-semibold">
								Job title
							</Label>
							<Input
								id="jobTitle"
								placeholder="Frontend Developer"
								{...register("jobTitle")}
								className={inputClass}
							/>
							<FieldError message={errors.jobTitle?.message} />
						</div>
						<div className="grid gap-4 sm:grid-cols-2">
							<div className="space-y-1.5">
								<Label className="text-xs font-semibold">Role</Label>
								<Select
									value={values.roleId || undefined}
									onValueChange={(value) =>
										setValue("roleId", value, { shouldValidate: true })
									}
								>
									<SelectTrigger className={inputClass}>
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
								<FieldError message={errors.roleId?.message} />
							</div>
							<div className="space-y-1.5">
								<Label className="text-xs font-semibold">Department</Label>
								<Select
									value={values.departmentId || NO_DEPARTMENT}
									onValueChange={(value) =>
										setValue("departmentId", value, { shouldValidate: true })
									}
								>
									<SelectTrigger className={inputClass}>
										<SelectValue placeholder="Select a department" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value={NO_DEPARTMENT}>
											No department
										</SelectItem>
										{departments.map((department) => (
											<SelectItem key={department.id} value={department.id}>
												{department.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<FieldError message={errors.departmentId?.message} />
							</div>
						</div>
						<div className="space-y-1.5">
							<Label htmlFor="joiningDate" className="text-xs font-semibold">
								Joining date
							</Label>
							<Input
								id="joiningDate"
								type="date"
								{...register("joiningDate")}
								className={inputClass}
							/>
							<FieldError message={errors.joiningDate?.message} />
						</div>
					</div>
				) : null}

				{step === 3 ? (
					<div className="space-y-4">
						<div>
							<h2 className="text-base font-semibold text-[#0F172A] dark:text-white">
								Pay & review
							</h2>
							<p className="mt-1 text-xs text-[#64748B] dark:text-[#94A3B8]">
								How this person is paid — payroll is generated from it
								automatically. Then check the summary.
							</p>
						</div>

						<RadioGroup
							value={salaryType}
							onValueChange={(value) =>
								setValue(
									"salaryType",
									value as "MONTHLY" | "HOURLY",
									{ shouldValidate: true },
								)
							}
							className="grid gap-3 sm:grid-cols-2"
						>
							{[
								{
									value: "MONTHLY",
									label: "Monthly salary",
									hint: "Same fixed amount every month",
								},
								{
									value: "HOURLY",
									label: "Hourly rate",
									hint: "Approved work hours × rate",
								},
							].map((option) => (
								<label
									key={option.value}
									className={`flex cursor-pointer items-start gap-3 rounded-md border p-4 transition-colors ${
										salaryType === option.value
											? "border-[#2563EB] bg-[#EFF6FF] dark:bg-[#1E293B]"
											: "border-[#E2E8F0] hover:border-[#CBD5E1] dark:border-[#1E293B]"
									}`}
								>
									<RadioGroupItem
										value={option.value}
										id={`salary-${option.value}`}
										className="mt-0.5 border-[#2563EB] text-[#2563EB]"
									/>
									<div>
										<p className="text-sm font-medium text-[#0F172A] dark:text-white">
											{option.label}
										</p>
										<p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
											{option.hint}
										</p>
									</div>
								</label>
							))}
						</RadioGroup>

						{/* Amount — "$" prefix and unit suffix make the expected value obvious */}
						<div className="space-y-1.5">
							<Label
								htmlFor={salaryType === "MONTHLY" ? "salary" : "hourlyRate"}
								className="text-xs font-semibold"
							>
								{salaryType === "MONTHLY" ? "Monthly salary" : "Hourly rate"}
							</Label>
							<div className="relative">
								<span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-[#64748B] dark:text-[#94A3B8]">
									$
								</span>
								{salaryType === "MONTHLY" ? (
									<Input
										key="salary"
										id="salary"
										type="number"
										inputMode="decimal"
										min="1"
										step="0.01"
										placeholder="5,000.00"
										{...register("salary")}
										className={`${inputClass} pr-20 pl-7 tabular-nums`}
									/>
								) : (
									<Input
										key="hourlyRate"
										id="hourlyRate"
										type="number"
										inputMode="decimal"
										min="1"
										step="0.01"
										placeholder="45.00"
										{...register("hourlyRate")}
										className={`${inputClass} pr-20 pl-7 tabular-nums`}
									/>
								)}
								<span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-[#64748B] dark:text-[#94A3B8]">
									USD / {salaryType === "MONTHLY" ? "month" : "hour"}
								</span>
							</div>
							<FieldError
								message={
									salaryType === "MONTHLY"
										? errors.salary?.message
										: errors.hourlyRate?.message
								}
							/>
						</div>

						{/* Live pay breakdown — updates as you type */}
						<div
							aria-live="polite"
							className="rounded-md border border-[#DBEAFE] bg-[#EFF6FF] p-4 dark:border-[#1E3A5F] dark:bg-[#0B1120]"
						>
							{pay ? (
								<>
									<dl className="grid grid-cols-2 gap-4">
										<div>
											<dt className="text-xs font-medium text-[#64748B] dark:text-[#94A3B8]">
												{pay.isEstimate ? "Est. monthly" : "Monthly"}
											</dt>
											<dd className="mt-0.5 text-xl font-bold tracking-tight text-[#0F172A] tabular-nums dark:text-white">
												{formatCurrency(pay.monthly)}
											</dd>
										</div>
										<div>
											<dt className="text-xs font-medium text-[#64748B] dark:text-[#94A3B8]">
												{pay.isEstimate ? "Est. annual" : "Annual"}
											</dt>
											<dd className="mt-0.5 text-xl font-bold tracking-tight text-[#0F172A] tabular-nums dark:text-white">
												{formatCurrency(pay.annual)}
											</dd>
										</div>
									</dl>
									<p className="mt-3 text-xs text-[#334155] dark:text-[#CBD5E1]">
										{pay.isEstimate
											? `${formatCurrency(pay.rate)} × ${ESTIMATED_HOURS_PER_MONTH} h. Actual payroll = approved work hours × rate.`
											: "Payroll pays this fixed amount for each monthly period."}
									</p>
								</>
							) : (
								<p className="text-sm text-[#64748B] dark:text-[#94A3B8]">
									Enter an amount to see the monthly and annual pay.
								</p>
							)}
						</div>

						<div>
							<SectionHeading>Review</SectionHeading>
							<DetailList bordered={false} className="mt-1">
								<DetailRow variant="split" label="Name">{values.name || "—"}</DetailRow>
								<DetailRow variant="split" label="Email">{values.email || "—"}</DetailRow>
								<DetailRow variant="split" label="Job title">{values.jobTitle || "—"}</DetailRow>
								<DetailRow variant="split" label="Role">{roleName ? formatRoleName(roleName) : "—"}</DetailRow>
								<DetailRow variant="split" label="Department">{departmentName ?? "No department"}</DetailRow>
								<DetailRow variant="split" label="Joining date">
									{/* "T00:00:00" = read the picked date as local time, not UTC */}
									{values.joiningDate ? formatDate(`${values.joiningDate}T00:00:00`) : "—"}
								</DetailRow>
								<DetailRow variant="split" label="Pay">
									{pay ? (
										<span className="tabular-nums">
											{formatCurrency(pay.rate)} / {pay.unit}
										</span>
									) : (
										"—"
									)}
								</DetailRow>
							</DetailList>
						</div>
					</div>
				) : null}

				<div className="mt-6 flex items-center justify-between border-t border-[#E2E8F0] pt-4 dark:border-[#1E293B]">
					<Button
						type="button"
						variant="outline"
						className="border-[#E2E8F0] text-[#334155] hover:bg-[#F8FAFC] dark:border-[#1E293B] dark:text-[#CBD5E1]"
						disabled={step === 1 || createEmployee.isPending}
						onClick={() => void goTo(step - 1)}
					>
						<ChevronLeft className="size-4" />
						Back
					</Button>

					{step < 3 ? (
						<Button
							type="button"
							className="h-9 bg-[#2563EB] text-sm font-semibold text-white shadow-none hover:bg-[#1D4ED8]"
							onClick={() => void goTo(step + 1)}
						>
							Next
							<ChevronRight className="size-4" />
						</Button>
					) : (
						<Button
							type="submit"
							className="h-9 bg-[#2563EB] text-sm font-semibold text-white shadow-none hover:bg-[#1D4ED8]"
							disabled={createEmployee.isPending}
						>
							{createEmployee.isPending ? (
								<>
									<Loader2 className="mr-2 size-4 animate-spin" />
									Creating...
								</>
							) : (
								<>
									<Send className="size-4" />
									Create employee
								</>
							)}
						</Button>
					)}
				</div>
			</form>

			<div className="mt-4 text-center">
				<Button
					type="button"
					variant="ghost"
					className="text-xs text-[#64748B] hover:text-[#0F172A] dark:text-[#94A3B8] dark:hover:text-white"
					onClick={() => router.push("/admin/employees")}
				>
					Cancel
				</Button>
			</div>

			{/* Shown once after creation — the password is never retrievable again */}
			<Dialog
				open={created !== null}
				onOpenChange={(open) => {
					if (!open) finish();
				}}
			>
				<DialogContent className="border-[#E2E8F0] bg-white dark:border-[#1E293B] dark:bg-[#0F172A]">
					<DialogHeader>
						<DialogTitle className="text-[#0F172A] dark:text-white">
							Employee created
						</DialogTitle>
						<DialogDescription>
							{created
								? `${created.employee.user.name} (${created.employee.employeeCode}) can now log in. The credentials were also emailed — if it doesn't arrive, share this password securely. It won't be shown again.`
								: null}
						</DialogDescription>
					</DialogHeader>

					{created ? (
						<dl className="space-y-3 text-sm">
							<div className="space-y-1">
								<dt className="text-xs font-semibold text-[#64748B] dark:text-[#94A3B8]">
									Email
								</dt>
								<dd className="font-medium text-[#0F172A] dark:text-white">
									{created.employee.user.email}
								</dd>
							</div>
							<div className="space-y-1">
								<dt className="text-xs font-semibold text-[#64748B] dark:text-[#94A3B8]">
									Temporary password
								</dt>
								<dd className="flex items-center gap-2">
									<code className="flex-1 rounded-md border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 font-mono text-sm text-[#0F172A] select-all dark:border-[#1E293B] dark:bg-[#0B1120] dark:text-white">
										{created.temporaryPassword}
									</code>
									<Button
										type="button"
										variant="outline"
										size="icon"
										aria-label="Copy temporary password"
										className="border-[#E2E8F0] text-[#334155] dark:border-[#1E293B] dark:text-[#CBD5E1]"
										onClick={() => void copy(created.temporaryPassword, "Password copied")}
									>
										<Copy className="size-4" />
									</Button>
								</dd>
							</div>
						</dl>
					) : null}

					<DialogFooter>
						<Button
							type="button"
							className="bg-[#2563EB] text-white shadow-none hover:bg-[#1D4ED8]"
							onClick={finish}
						>
							Done
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
