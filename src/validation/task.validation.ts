import { z } from "zod";

// Mirrors backend CreateTaskZodSchema; dueDate is "YYYY-MM-DD" from <input type="date">
export const taskSchema = z.object({
	title: z
		.string()
		.trim()
		.min(2, "Title must be at least 2 characters")
		.max(200, "Title must be at most 200 characters"),
	description: z.string().trim().max(5000, "Description must be at most 5000 characters"),
	employeeId: z.string().min(1, "Choose who will do this task"),
	priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
	estimatedHours: z.string().refine((value) => value === "" || Number(value) > 0, {
		message: "Estimated hours must be a positive number",
	}),
	dueDate: z.string(),
});

export type TaskFormValues = z.infer<typeof taskSchema>;
