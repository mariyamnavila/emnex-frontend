import { z } from "zod";

// Mirrors backend RejectSubmissionZodSchema
export const rejectSubmissionSchema = z.object({
	reason: z
		.string()
		.trim()
		.min(10, "Tell them what to fix — at least 10 characters")
		.max(500, "Reason must be at most 500 characters"),
});

export type RejectSubmissionValues = z.infer<typeof rejectSubmissionSchema>;
