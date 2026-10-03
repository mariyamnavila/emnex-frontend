export interface Permission {
	id: string;
	name: string;
	description: string | null;
}

// GET /roles
export interface Role {
	id: string;
	name: string;
	description: string | null;
	isSystem: boolean;
	createdAt: string;
	_count: { users: number; permissions: number };
}

// GET /roles/:id
export interface RoleDetail extends Omit<Role, "_count"> {
	permissions: { permission: Permission }[];
	_count: { users: number };
}
