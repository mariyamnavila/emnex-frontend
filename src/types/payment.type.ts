// Saved before redirecting to Stripe (sessionStorage)
export interface PendingCheckout {
	payrollId: string;
	employeeName: string;
	netAmount: number;
}

// GET /payments/verify/:sessionId
export interface CheckoutVerification {
	status: "paid" | "unpaid" | "expired";
	payment: {
		id: string;
		amount: number;
		currency: string;
		status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | "REFUNDED";
		transactionId: string | null;
		updatedAt: string;
		employee: {
			employeeCode: string;
			user: { name: string; email: string };
		};
		payroll: {
			id: string;
			periodStart: string;
			periodEnd: string;
			grossAmount: number;
			deductions: number;
			netAmount: number;
		};
	};
}

export type PaymentStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | "REFUNDED";

// GET /payments row (amount is already a number — backend formatPayment)
export interface Payment {
	id: string;
	payrollId: string;
	amount: number;
	currency: string;
	transactionId: string | null;
	gateway: string;
	status: PaymentStatus;
	createdAt: string;
	updatedAt: string;
	employee: {
		id: string;
		employeeCode: string;
		user: { id: string; name: string; email: string; avatar: string | null };
	};
	payroll: { id: string; periodStart: string; periodEnd: string; status: string };
}
