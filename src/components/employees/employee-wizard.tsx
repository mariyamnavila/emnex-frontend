"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	ChevronLeft,
	ChevronRight,
	Check,
	Loader2,
	Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
	useCreateEmployee,
	useDepartments,
	useRoles,
} from "@/hooks/employee.hook";

const STEPS = [
	{ number: 1, label: "Personal" },
	{ number: 2, label: "Job" },
	{ number: 3, label: "Salary" },
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
	const [step, setStep] = useState(1);
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

	const salaryType = watch("salaryType");

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

	function onSubmit(values: EmployeeCreateValues) {
		createEmployee.mutate({
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
		});
	}

	return (
		<div className="mx-auto max-w-2xl">
			{/* Stepper */}
			<ol className="flex items-center gap-2">
				{STEPS.map((item, index) => {
					const isDone = step > item.number;
					const isCurrent = step === item.number;
					return (
						<li
							key={item.number}
							className={`flex flex-1 items-center gap-2 ${index < STEPS.length - 1 ? "" : ""}`}
						>
							<span
								className={`flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold ${
									isDone
										? "border-[#16A34A] bg-[#16A34A] text-white"
										: isCurrent
											? "border-[#2563EB] bg-[#2563EB] text-white"
											: "border-[#CBD5E1] bg-white text-[#64748B] dark:border-[#1E293B] dark:bg-[#0F172A] dark:text-[#94A3B8]"
								}`}
							>
								{isDone ? <Check className="size-3.5" /> : item.number}
							</span>
							<span
								className={`text-xs font-medium ${
									isCurrent || isDone
										? "text-[#0F172A] dark:text-white"
										: "text-[#94A3B8]"
								}`}
							>
								{item.label}
							</span>
							{index < STEPS.length - 1 ? (
								<span
									className={`h-px flex-1 ${step > item.number ? "bg-[#16A34A]" : "bg-[#E2E8F0] dark:bg-[#1E293B]"}`}
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
								The employee's identity and login email.
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
								Job details
							</h2>
							<p className="mt-1 text-xs text-[#64748B] dark:text-[#94A3B8]">
								Role, department and start date.
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
									value={watch("roleId") || undefined}
									onValueChange={(value) =>
										setValue("roleId", value, { shouldValidate: true })
									}
								>
									<SelectTrigger className={inputClass}>
										<SelectValue placeholder="Select a role" />
									</SelectTrigger>
									<SelectContent className="border-[#E2E8F0] bg-white dark:border-[#1E293B] dark:bg-[#0F172A]">
										{roles.map((role) => (
											<SelectItem key={role.id} value={role.id}>
												{role.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<FieldError message={errors.roleId?.message} />
							</div>
							<div className="space-y-1.5">
								<Label className="text-xs font-semibold">Department</Label>
								<Select
									value={watch("departmentId") || NO_DEPARTMENT}
									onValueChange={(value) =>
										setValue("departmentId", value, { shouldValidate: true })
									}
								>
									<SelectTrigger className={inputClass}>
										<SelectValue placeholder="Select a department" />
									</SelectTrigger>
									<SelectContent className="border-[#E2E8F0] bg-white dark:border-[#1E293B] dark:bg-[#0F172A]">
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
								Salary & review
							</h2>
							<p className="mt-1 text-xs text-[#64748B] dark:text-[#94A3B8]">
								Choose a pay structure, then review everything.
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
								{ value: "MONTHLY", label: "Monthly salary", hint: "Fixed monthly pay" },
								{ value: "HOURLY", label: "Hourly rate", hint: "Paid per hour worked" },
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

						{salaryType === "MONTHLY" ? (
							<div className="space-y-1.5">
								<Label htmlFor="salary" className="text-xs font-semibold">
									Monthly salary (USD)
								</Label>
								<Input
									id="salary"
									type="number"
									min="1"
									step="0.01"
									placeholder="5000"
									{...register("salary")}
									className={inputClass}
								/>
								<FieldError message={errors.salary?.message} />
							</div>
						) : (
							<div className="space-y-1.5">
								<Label htmlFor="hourlyRate" className="text-xs font-semibold">
									Hourly rate (USD)
								</Label>
								<Input
									id="hourlyRate"
									type="number"
									min="1"
									step="0.01"
									placeholder="45"
									{...register("hourlyRate")}
									className={inputClass}
								/>
								<FieldError message={errors.hourlyRate?.message} />
							</div>
						)}

						<div className="rounded-md border border-[#E2E8F0] bg-[#F8FAFC] p-4 dark:border-[#1E293B] dark:bg-[#0B1120]">
							<h3 className="text-xs font-semibold tracking-wider text-[#64748B] uppercase dark:text-[#94A3B8]">
								Review
							</h3>
							<dl className="mt-2 space-y-1.5 text-sm">
								<div className="flex justify-between gap-4">
									<dt className="text-[#64748B] dark:text-[#94A3B8]">Name</dt>
									<dd className="font-medium text-[#0F172A] dark:text-white">
										{getValues("name") || "—"}
									</dd>
								</div>
								<div className="flex justify-between gap-4">
									<dt className="text-[#64748B] dark:text-[#94A3B8]">Email</dt>
									<dd className="truncate font-medium text-[#0F172A] dark:text-white">
										{getValues("email") || "—"}
									</dd>
								</div>
								<div className="flex justify-between gap-4">
									<dt className="text-[#64748B] dark:text-[#94A3B8]">
										Job title
									</dt>
									<dd className="font-medium text-[#0F172A] dark:text-white">
										{getValues("jobTitle") || "—"}
									</dd>
								</div>
								<div className="flex justify-between gap-4">
									<dt className="text-[#64748B] dark:text-[#94A3B8]">Pay</dt>
									<dd className="font-medium text-[#0F172A] dark:text-white">
										{salaryType === "MONTHLY"
											? `$${Number(getValues("salary") || 0).toLocaleString()} / month`
											: `$${Number(getValues("hourlyRate") || 0).toFixed(2)} / hour`}
									</dd>
								</div>
							</dl>
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
		</div>
	);
}
