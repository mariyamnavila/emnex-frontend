export type PayrollStatus =
	| "DRAFT"
	| "GENERATED"
	| "APPROVED"
	| "PROCESSING"
	| "PAID"
	| "REJECTED";

export interface PayrollPayment {
	id: string;
	status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | "REFUNDED";
	currency: string;
	createdAt: string;
}

// Money fields arrive as numbers (backend formatPayroll)
export interface Payroll {
	id: string;
	employeeId: string;
	periodStart: string;
	periodEnd: string;
	grossAmount: number;
	deductions: number;
	netAmount: number;
	status: PayrollStatus;
	createdAt: string;
	employee: {
		id: string;
		employeeCode: string;
		jobTitle: string;
		user: { id: string; name: string; email: string; avatar: string | null };
	};
	payment: PayrollPayment | null;
}

// GET /payroll/my
export type MyPayroll = Omit<Payroll, "employee">;
