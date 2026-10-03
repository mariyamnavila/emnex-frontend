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
