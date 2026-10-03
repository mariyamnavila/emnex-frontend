// GET /audit-logs and /audit-logs/:id
export interface AuditLog {
	id: string;
	action: string;
	entity: string;
	entityId: string | null;
	metadata: Record<string, unknown> | null;
	ipAddress: string | null;
	createdAt: string;
	user: { id: string; name: string; email: string };
}
