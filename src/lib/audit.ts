import type { Tone } from "@/components/shared/status-badge";

// Mirrors AuditAction in the backend (src/app/utils/auditLog.ts), grouped by entity
export const AUDIT_ACTION_GROUPS: { entity: string; actions: string[] }[] = [
	{ entity: "User", actions: ["LOGIN", "LOGIN_FAILED", "GOOGLE_LOGIN", "LOGOUT", "PASSWORD_CHANGED"] },
	{
		entity: "Employee",
		actions: ["CREATE_EMPLOYEE", "UPDATE_EMPLOYEE", "DELETE_EMPLOYEE", "CHANGE_EMPLOYEE_ROLE", "CHANGE_EMPLOYEE_STATUS"],
	},
	{ entity: "Department", actions: ["CREATE_DEPARTMENT", "UPDATE_DEPARTMENT", "DELETE_DEPARTMENT"] },
	{ entity: "Role", actions: ["CREATE_ROLE", "UPDATE_ROLE", "DELETE_ROLE", "ASSIGN_PERMISSIONS"] },
	{ entity: "Project", actions: ["CREATE_PROJECT", "UPDATE_PROJECT", "DELETE_PROJECT", "CHANGE_PROJECT_STATUS"] },
	{ entity: "Task", actions: ["CREATE_TASK", "ASSIGN_TASK", "CHANGE_TASK_STATUS", "DELETE_TASK"] },
	{ entity: "WorkSubmission", actions: ["SUBMIT_WORK", "APPROVE_WORK", "REJECT_WORK"] },
	{ entity: "Payroll", actions: ["GENERATE_PAYROLL", "APPROVE_PAYROLL", "REJECT_PAYROLL"] },
	{ entity: "Payment", actions: ["PAYMENT_INITIATED", "PAYMENT_COMPLETED", "PAYMENT_FAILED"] },
];

const ENTITY_LABELS: Record<string, string> = { WorkSubmission: "Work submission" };

export const entityLabel = (entity: string) => ENTITY_LABELS[entity] ?? entity;

const SPECIAL: Record<string, { label: string; tone: Tone }> = {
	LOGIN: { label: "Signed in", tone: "muted" },
	LOGIN_FAILED: { label: "Failed sign-in", tone: "destructive" },
	GOOGLE_LOGIN: { label: "Signed in with Google", tone: "muted" },
	LOGOUT: { label: "Signed out", tone: "muted" },
	PASSWORD_CHANGED: { label: "Changed password", tone: "warning" },
	DELETE_EMPLOYEE: { label: "Terminated employee", tone: "destructive" },
	ASSIGN_PERMISSIONS: { label: "Updated permissions", tone: "warning" },
	SUBMIT_WORK: { label: "Submitted work", tone: "info" },
	PAYMENT_INITIATED: { label: "Started payment", tone: "info" },
	PAYMENT_COMPLETED: { label: "Payment completed", tone: "success" },
	PAYMENT_FAILED: { label: "Payment failed", tone: "destructive" },
};

const VERBS: Record<string, { past: string; tone: Tone }> = {
	CREATE: { past: "Created", tone: "success" },
	UPDATE: { past: "Updated", tone: "info" },
	DELETE: { past: "Deleted", tone: "destructive" },
	CHANGE: { past: "Changed", tone: "info" },
	ASSIGN: { past: "Assigned", tone: "info" },
	GENERATE: { past: "Generated", tone: "info" },
	APPROVE: { past: "Approved", tone: "approved" },
	REJECT: { past: "Rejected", tone: "destructive" },
};

/** "CREATE_EMPLOYEE" → { label: "Created employee", tone: "success" } */
export function describeAction(action: string): { label: string; tone: Tone } {
	if (SPECIAL[action]) return SPECIAL[action];
	const [verb, ...rest] = action.split("_");
	const known = VERBS[verb];
	const object = rest.join(" ").toLowerCase();
	if (known) return { label: `${known.past} ${object}`.trim(), tone: known.tone };
	return { label: action.charAt(0) + action.slice(1).toLowerCase().replace(/_/g, " "), tone: "muted" };
}
