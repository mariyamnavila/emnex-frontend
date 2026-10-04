"use client";

import { DetailFigure, DetailList, DetailRow, DetailSheet, StatusBadge } from "@/components/shared";
import { formatCurrency, payrollStatusNote } from "@/lib/pay";
import { formatDateTime, formatDay, formatMonth } from "@/lib/utils";
import type { MyPayroll } from "@/types/payroll.type";
import { PayBreakdown } from "./pay-breakdown";

interface PayslipSheetProps {
	payroll: MyPayroll | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

// One payslip: net pay, how it was worked out, and whether it's been paid
export function PayslipSheet({ payroll, open, onOpenChange }: PayslipSheetProps) {
	return (
		<DetailSheet
			open={open}
			onOpenChange={onOpenChange}
			title={payroll ? `${formatMonth(payroll.periodStart)} payslip` : "Payslip"}
			description="Your pay for the period, and whether it's been paid"
		>
			{payroll ? (
				<>
					<DetailFigure
						value={formatCurrency(payroll.netAmount)}
						caption={
							<span className="inline-flex items-center gap-2">
								Net pay <StatusBadge status={payroll.status} />
							</span>
						}
					/>

					<PayBreakdown
						grossAmount={payroll.grossAmount}
						deductions={payroll.deductions}
						netAmount={payroll.netAmount}
					/>

					<DetailList>
						<DetailRow label="Period">
							<span className="tabular-nums">
								{formatDay(payroll.periodStart)} – {formatDay(payroll.periodEnd)}
							</span>
						</DetailRow>
						<DetailRow label="Generated">
							<time dateTime={payroll.createdAt} className="tabular-nums">
								{formatDateTime(payroll.createdAt)}
							</time>
						</DetailRow>
						<DetailRow label="Payment">
							{payroll.payment ? (
								<span className="flex flex-wrap items-center gap-2">
									<StatusBadge status={payroll.payment.status} />
									<span className="text-xs text-[#64748B] tabular-nums dark:text-[#94A3B8]">
										Stripe · {payroll.payment.currency.toUpperCase()}
									</span>
								</span>
							) : (
								<span className="text-[#94A3B8]">Not started</span>
							)}
						</DetailRow>
					</DetailList>

					<p className="text-sm text-[#334155] dark:text-[#CBD5E1]">{payrollStatusNote(payroll)}</p>
				</>
			) : null}
		</DetailSheet>
	);
}
