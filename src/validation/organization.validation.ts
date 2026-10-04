import { z } from "zod";

// Mirrors backend UpdateOrganizationZodSchema
export const organizationEditSchema = z.object({
	name: z
		.string()
		.trim()
		.min(2, "Name must be at least 2 characters")
		.max(100, "Name must be at most 100 characters"),
	slug: z
		.string()
		.trim()
		.min(2, "Slug must be at least 2 characters")
		.max(100, "Slug must be at most 100 characters")
		.regex(/^[a-z0-9-]+$/, "Only lowercase letters, numbers and hyphens"),
});

export type OrganizationEditValues = z.infer<typeof organizationEditSchema>;
