import { z } from "zod";

/** "2026-10" for the current local month */
export const currentMonth = () => {
	const now = new Date();
	return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
};

// Mirrors backend GeneratePayrollZodSchema; period is "YYYY-MM" from <input type="month">
export const generatePayrollSchema = z.object({
	employeeId: z.string().min(1, "Choose an employee"),
	period: z
		.string()
		.regex(/^\d{4}-\d{2}$/, "Choose a pay period")
		.refine((value) => value <= currentMonth(), "This month hasn't started yet"),
	deductions: z.string().refine((value) => value === "" || Number(value) >= 0, {
		message: "Deductions can't be negative",
	}),
});

export type GeneratePayrollValues = z.infer<typeof generatePayrollSchema>;
