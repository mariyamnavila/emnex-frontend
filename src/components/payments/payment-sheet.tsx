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
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/pay";
import { formatDateTime, formatDay, timeAgo } from "@/lib/utils";
import type { Payment } from "@/types/payment.type";

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

interface PaymentSheetProps {
	payment: Payment | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	/** Not completed, payroll still approved, user may pay, and it isn't their own */
	canRetry: boolean;
	isRetrying: boolean;
	onRetry: (payment: Payment) => void;
}

export function PaymentSheet({ payment, open, onOpenChange, canRetry, isRetrying, onRetry }: PaymentSheetProps) {
	const footer =
		payment && canRetry ? (
			<div className="space-y-2">
				<p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
					Test mode: card 4242 4242 4242 4242, any future date and any CVC.
				</p>
				<Button
					disabled={isRetrying}
					onClick={() => onRetry(payment)}
					className="w-full bg-[#2563EB] text-white shadow-none hover:bg-[#1D4ED8]"
				>
					{isRetrying ? <Loader2 className="size-4 animate-spin" /> : <CreditCard className="size-4" />}
					{isRetrying ? "Opening Stripe..." : "Retry with Stripe"}
				</Button>
			</div>
		) : null;

	return (
		<DetailSheet
			open={open}
			onOpenChange={onOpenChange}
			title="Payment"
			description="The Stripe payment and the payroll it settles"
			footer={footer}
		>
			{payment ? (
				<>
					<PersonLine
						name={payment.employee.user.name}
						avatar={payment.employee.user.avatar}
						subtitle={payment.employee.employeeCode}
						monoSubtitle
						trailing={<StatusBadge status={payment.status} />}
					/>

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
						<div className="rounded-lg border border-[#E2E8F0] p-3 text-sm dark:border-[#1E293B]">
							<div className="flex items-center justify-between gap-3">
								<span className="text-[#334155] tabular-nums dark:text-[#CBD5E1]">
									{formatDay(payment.payroll.periodStart)} – {formatDay(payment.payroll.periodEnd)}
								</span>
								<StatusBadge status={payment.payroll.status} />
							</div>
							<dl className="mt-3 space-y-1.5 tabular-nums">
								<div className="flex justify-between">
									<dt className="text-[#64748B] dark:text-[#94A3B8]">Gross</dt>
									<dd className="text-[#0F172A] dark:text-white">{formatCurrency(payment.payroll.grossAmount)}</dd>
								</div>
								<div className="flex justify-between">
									<dt className="text-[#64748B] dark:text-[#94A3B8]">Deductions</dt>
									<dd className="text-[#64748B] dark:text-[#94A3B8]">
										{payment.payroll.deductions > 0 ? `− ${formatCurrency(payment.payroll.deductions)}` : "—"}
									</dd>
								</div>
								<div className="flex justify-between border-t border-[#F1F5F9] pt-1.5 font-semibold dark:border-[#1E293B]">
									<dt className="text-[#0F172A] dark:text-white">Net pay</dt>
									<dd className="text-[#0F172A] dark:text-white">{formatCurrency(payment.payroll.netAmount)}</dd>
								</div>
							</dl>
						</div>
					</div>
				</>
			) : null}
		</DetailSheet>
	);
}
