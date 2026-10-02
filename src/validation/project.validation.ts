import { z } from "zod";

// Mirrors backend Create/UpdateProjectZodSchema; dates are "YYYY-MM-DD" from <input type="date">
export const projectSchema = z
	.object({
		name: z
			.string()
			.trim()
			.min(2, "Project name must be at least 2 characters")
			.max(200, "Project name must be at most 200 characters"),
		description: z.string().trim().max(2000, "Description must be at most 2000 characters"),
		startDate: z.string(),
		endDate: z.string(),
		budget: z.string().refine((value) => value === "" || Number(value) > 0, {
			message: "Budget must be a positive number",
		}),
		status: z.enum(["PLANNED", "ACTIVE", "ON_HOLD", "COMPLETED", "CANCELLED"]),
	})
	.refine((values) => !values.startDate || !values.endDate || values.startDate <= values.endDate, {
		path: ["endDate"],
		message: "End date can't be before the start date",
	});

export type ProjectFormValues = z.infer<typeof projectSchema>;
