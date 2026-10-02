import { z } from "zod";

// Mirrors backend CreateEmployeeZodSchema (src/app/module/employee/employee.validation.ts)
export const employeeBasicSchema = z.object({
	name: z.string().min(2, "Name must be at least 2 characters").max(100),
	email: z.string().email("Invalid email address"),
});

export const employeeJobSchema = z.object({
	jobTitle: z
		.string()
		.min(2, "Job title must be at least 2 characters")
		.max(100),
	roleId: z.string().min(1, "Select a role"),
	departmentId: z.string().optional(),
	joiningDate: z.string().min(1, "Select a joining date"),
});

const salaryBaseSchema = z.object({
	salaryType: z.enum(["MONTHLY", "HOURLY"]),
	salary: z.string().optional(),
	hourlyRate: z.string().optional(),
});

const salaryRefine = (
	values: z.infer<typeof salaryBaseSchema>,
	ctx: z.RefinementCtx,
) => {
	if (values.salaryType === "MONTHLY") {
		const parsed = Number(values.salary);
		if (!values.salary || Number.isNaN(parsed) || parsed <= 0) {
			ctx.addIssue({
				code: "custom",
				path: ["salary"],
				message: "Salary must be a positive number",
			});
		}
	}
	const parsedRate = Number(values.hourlyRate);
	if (
		values.salaryType === "HOURLY" &&
		(!values.hourlyRate || Number.isNaN(parsedRate) || parsedRate <= 0)
	) {
		ctx.addIssue({
			code: "custom",
			path: ["hourlyRate"],
			message: "Hourly rate must be a positive number",
		});
	}
};

export const employeeSalarySchema = salaryBaseSchema.superRefine(salaryRefine);

export const employeeCreateSchema = employeeBasicSchema
	.merge(employeeJobSchema)
	.merge(salaryBaseSchema)
	.superRefine(salaryRefine);

export type EmployeeBasicValues = z.infer<typeof employeeBasicSchema>;
export type EmployeeJobValues = z.infer<typeof employeeJobSchema>;
export type EmployeeSalaryValues = z.infer<typeof employeeSalarySchema>;
export type EmployeeCreateValues = z.infer<typeof employeeCreateSchema>;
