import { z } from "zod";

// Mirrors backend Create/UpdateRoleZodSchema
export const roleSchema = z.object({
	name: z
		.string()
		.trim()
		.min(2, "Role name must be at least 2 characters")
		.max(50, "Role name must be at most 50 characters"),
	description: z.string().trim().max(200, "Description must be at most 200 characters"),
});

export type RoleFormValues = z.infer<typeof roleSchema>;
