import { z } from "zod";

// Mirrors backend Create/UpdateDepartmentZodSchema
export const departmentSchema = z.object({
	name: z
		.string()
		.trim()
		.min(2, "Department name must be at least 2 characters")
		.max(100, "Department name must be at most 100 characters"),
	description: z
		.string()
		.trim()
		.max(500, "Description must be at most 500 characters"),
});

export type DepartmentFormValues = z.infer<typeof departmentSchema>;
