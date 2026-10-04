"use client";

import { CreditCard, ExternalLink, Loader2 } from "lucide-react";
import {
	CopyButton,
	DetailFigure,
	DetailList,
	DetailRow,
	DetailSheet,
	PersonLine,
	SectionHeading,
	StatusBadge,
} from "@/components/shared";
import { PayBreakdown } from "@/components/payroll/pay-breakdown";
import { Button } from "@/components/ui/button";
import { formatCurrency, paymentStatusNote } from "@/lib/pay";
import { formatDateTime, formatDay, timeAgo } from "@/lib/utils";
import type { MyPayment, Payment } from "@/types/payment.type";

function TransactionId({ id }: { id: string }) {
	// Real Stripe payment intents can be opened in the (test) dashboard; seeded ids can't
	const isStripe = id.startsWith("pi_");
	return (
		<span className="flex items-center gap-1.5">
			<span className="truncate font-mono text-xs">{id}</span>
			<CopyButton value={id} label="Copy transaction ID" />
			{isStripe ? (
				<a
					href={`https://dashboard.stripe.com/test/payments/${id}`}
					target="_blank"
					rel="noreferrer"
					aria-label="Open in Stripe dashboard"
					className="shrink-0 rounded p-1 text-[#94A3B8] hover:bg-[#F1F5F9] hover:text-[#2563EB] dark:hover:bg-[#1E293B]"
				>
					<ExternalLink className="size-3.5" />
				</a>
			) : null}
		</span>
	);
}

interface RetryProps {
	/** Not completed, payroll still approved, user may pay, and it isn't their own */
	allowed: boolean;
	isRetrying: boolean;
	onRetry: (payment: Payment) => void;
}

interface PaymentSheetProps {
	/** Anyone's payment (finance) or one of the signed-in employee's own */
	payment: Payment | MyPayment | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	retry?: RetryProps;
}

export function PaymentSheet({ payment, open, onOpenChange, retry }: PaymentSheetProps) {
	const retryable = payment && "employee" in payment && retry?.allowed ? payment : null;
	const footer =
		retryable && retry ? (
			<div className="space-y-2">
				<p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
					Test mode: card 4242 4242 4242 4242, any future date and any CVC.
				</p>
				<Button
					disabled={retry.isRetrying}
					onClick={() => retry.onRetry(retryable)}
					className="w-full bg-[#2563EB] text-white shadow-none hover:bg-[#1D4ED8]"
				>
					{retry.isRetrying ? <Loader2 className="size-4 animate-spin" /> : <CreditCard className="size-4" />}
					{retry.isRetrying ? "Opening Stripe..." : "Retry with Stripe"}
				</Button>
			</div>
		) : null;

	return (
		<DetailSheet
			open={open}
			onOpenChange={onOpenChange}
			title={payment && !("employee" in payment) ? "Your payment" : "Payment"}
			description="The Stripe payment and the payroll it settles"
			footer={footer}
		>
			{payment ? (
				<>
					{"employee" in payment ? (
						<PersonLine
							name={payment.employee.user.name}
							avatar={payment.employee.user.avatar}
							subtitle={payment.employee.employeeCode}
							monoSubtitle
							trailing={<StatusBadge status={payment.status} />}
						/>
					) : (
						<div className="space-y-2">
							<StatusBadge status={payment.status} />
							<p className="text-sm text-[#334155] dark:text-[#CBD5E1]">{paymentStatusNote(payment.status)}</p>
						</div>
					)}

					<DetailFigure
						value={formatCurrency(payment.amount)}
						caption={`${payment.gateway === "STRIPE" ? "Stripe" : payment.gateway} · ${payment.currency.toUpperCase()}`}
					/>

					<DetailList>
						{/* An open checkout stores its session id (cs_…); a finished one, the payment intent (pi_…) */}
						<DetailRow label={payment.transactionId?.startsWith("cs_") ? "Checkout session" : "Transaction"}>
							{payment.transactionId ? (
								<TransactionId id={payment.transactionId} />
							) : (
								<span className="text-[#94A3B8]">Not paid yet</span>
							)}
						</DetailRow>
						<DetailRow label="Started">
							<time dateTime={payment.createdAt} className="tabular-nums">
								{formatDateTime(payment.createdAt)}
							</time>
						</DetailRow>
						<DetailRow label="Last update">
							<time dateTime={payment.updatedAt} className="tabular-nums">
								{formatDateTime(payment.updatedAt)}
							</time>
							<span className="block text-xs text-[#64748B] dark:text-[#94A3B8]">{timeAgo(payment.updatedAt)}</span>
						</DetailRow>
					</DetailList>

					<div className="space-y-2">
						<SectionHeading>Payroll</SectionHeading>
						<div className="rounded-lg border border-[#E2E8F0] p-3 dark:border-[#1E293B]">
							<div className="flex items-center justify-between gap-3">
								<span className="text-[#334155] tabular-nums dark:text-[#CBD5E1]">
									{formatDay(payment.payroll.periodStart)} – {formatDay(payment.payroll.periodEnd)}
								</span>
								<StatusBadge status={payment.payroll.status} />
							</div>
							<PayBreakdown
								grossAmount={payment.payroll.grossAmount}
								deductions={payment.payroll.deductions}
								netAmount={payment.payroll.netAmount}
								className="mt-3"
							/>
						</div>
					</div>
				</>
			) : null}
		</DetailSheet>
	);
}
