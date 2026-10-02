// Money helpers shared by employees, payroll and payments.
// The backend stores money as Prisma Decimal, which arrives in JSON as a STRING
// ("4000", "45.5") — always run API amounts through toAmount() before math/formatting.

export type SalaryType = "MONTHLY" | "HOURLY";

// Used only for estimates in the UI. Real payroll for hourly staff is
// calculated by the backend from APPROVED work hours × hourly rate.
export const ESTIMATED_HOURS_PER_MONTH = 160;

/** "4000" | 4000 | null → 4000 | null (null when missing or not a number) */
export function toAmount(value: string | number | null | undefined): number | null {
	if (value === null || value === undefined || value === "") return null;
	const parsed = Number(value);
	return Number.isFinite(parsed) ? parsed : null;
}

const usd = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
	minimumFractionDigits: 2,
	maximumFractionDigits: 2,
});

/** 4000 → "$4,000.00" */
export function formatCurrency(amount: number): string {
	return usd.format(amount);
}

const usdCompact = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
	notation: "compact",
	maximumFractionDigits: 1,
});

/** 12500 → "$12.5K" (chart axes) */
export function formatCompactCurrency(amount: number): string {
	return usdCompact.format(amount);
}

export interface PaySummary {
	/** The amount the employee is set up with (salary or hourly rate) */
	rate: number;
	/** "month" for MONTHLY, "hour" for HOURLY */
	unit: "month" | "hour";
	/** Monthly pay (exact for MONTHLY, estimate for HOURLY) */
	monthly: number;
	annual: number;
	/** True when monthly/annual are estimates (hourly staff) */
	isEstimate: boolean;
}

/** Works out display values for an employee's pay. Returns null if the rate is missing. */
export function getPaySummary(
	salaryType: SalaryType,
	salary: number | null,
	hourlyRate: number | null,
): PaySummary | null {
	if (salaryType === "MONTHLY") {
		if (salary === null || salary <= 0) return null;
		return {
			rate: salary,
			unit: "month",
			monthly: salary,
			annual: salary * 12,
			isEstimate: false,
		};
	}

	if (hourlyRate === null || hourlyRate <= 0) return null;
	const monthly = hourlyRate * ESTIMATED_HOURS_PER_MONTH;
	return {
		rate: hourlyRate,
		unit: "hour",
		monthly,
		annual: monthly * 12,
		isEstimate: true,
	};
}
