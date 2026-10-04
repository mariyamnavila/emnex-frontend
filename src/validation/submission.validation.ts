import { z } from "zod";
import { today } from "@/lib/utils";

// Mirrors backend RejectSubmissionZodSchema
export const rejectSubmissionSchema = z.object({
	reason: z
		.string()
		.trim()
		.min(10, "Tell them what to fix — at least 10 characters")
		.max(500, "Reason must be at most 500 characters"),
});

export type RejectSubmissionValues = z.infer<typeof rejectSubmissionSchema>;

// Mirrors backend CreateSubmissionZodSchema; workDate is "YYYY-MM-DD" from <input type="date">
export const logHoursSchema = z.object({
	taskId: z.string().min(1, "Choose the task you worked on"),
	workDate: z
		.string()
		.min(1, "Pick the day you worked")
		.refine((value) => value <= today(), "You can't log hours for a future date"),
	hoursWorked: z
		.string()
		.min(1, "Enter how many hours you worked")
		.refine((value) => Number(value) > 0, "Hours must be more than 0")
		.refine((value) => Number(value) <= 24, "You can't log more than 24 hours for one day"),
	description: z
		.string()
		.trim()
		.min(10, "Describe what you did — at least 10 characters")
		.max(5000, "Description must be at most 5000 characters"),
});

export type LogHoursValues = z.infer<typeof logHoursSchema>;

/** An existing work log as form values (to edit it, or send a rejected one again) */
export const workLogToForm = (log: {
	taskId: string;
	workDate: string;
	hoursWorked: number;
	description: string;
}): LogHoursValues => ({
	taskId: log.taskId,
	workDate: log.workDate.slice(0, 10),
	hoursWorked: String(log.hoursWorked),
	description: log.description,
});
