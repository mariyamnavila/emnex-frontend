import { z } from "zod";
import { currentMonth } from "@/lib/utils";

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
	// Optional extra added on top of the calculated pay (bonus, PTO, 0-hours)
	extraAmount: z.string().refine((value) => value === "" || Number(value) > 0, {
		message: "Extra amount must be positive",
	}),
});

export type GeneratePayrollValues = z.infer<typeof generatePayrollSchema>;
