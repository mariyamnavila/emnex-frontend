"use client";

import { useState } from "react";
import { formatDistanceToNowStrict } from "date-fns";
import { Check, Copy, CreditCard, ExternalLink, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { StatusBadge, UserAvatar } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { formatCurrency } from "@/lib/pay";
import { formatDay } from "@/lib/utils";
import type { Payment } from "@/types/payment.type";

const exactTime = (iso: string) =>
	new Date(iso).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });

function Row({ label, children }: { label: string; children: React.ReactNode }) {
	return (
		<div className="grid grid-cols-[110px_minmax(0,1fr)] gap-3 py-2.5 text-sm">
			<dt className="text-[#64748B] dark:text-[#94A3B8]">{label}</dt>
			<dd className="min-w-0 text-[#0F172A] dark:text-white">{children}</dd>
		</div>
	);
}

function TransactionId({ id }: { id: string }) {
	const [copied, setCopied] = useState(false);
	// Real Stripe payment intents can be opened in the (test) dashboard; seeded ids can't
	const isStripe = id.startsWith("pi_");
	return (
		<span className="flex items-center gap-1.5">
			<span className="truncate font-mono text-xs">{id}</span>
			<button
				type="button"
				aria-label="Copy transaction ID"
				onClick={async () => {
					try {
						await navigator.clipboard.writeText(id);
						setCopied(true);
						setTimeout(() => setCopied(false), 1500);
					} catch {
						toast.error("Couldn't copy");
					}
				}}
				className="shrink-0 rounded p-1 text-[#94A3B8] hover:bg-[#F1F5F9] hover:text-[#334155] dark:hover:bg-[#1E293B]"
			>
				{copied ? <Check className="size-3.5 text-[#16A34A]" /> : <Copy className="size-3.5" />}
			</button>
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
	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent
				side="right"
				onOpenAutoFocus={(event) => event.preventDefault()}
				className="w-full gap-0 overflow-y-auto border-[#E2E8F0] bg-white sm:max-w-md dark:border-[#1E293B] dark:bg-[#0F172A]"
			>
				<SheetHeader className="border-b border-[#E2E8F0] pb-4 dark:border-[#1E293B]">
					<SheetTitle className="text-base text-[#0F172A] dark:text-white">Payment</SheetTitle>
					<SheetDescription className="text-xs">The Stripe payment and the payroll it settles</SheetDescription>
				</SheetHeader>

				{payment ? (
					<div className="flex flex-1 flex-col">
						<div className="flex-1 space-y-6 p-5">
							<div className="flex items-center gap-3">
								<UserAvatar name={payment.employee.user.name} src={payment.employee.user.avatar} />
								<div className="min-w-0 flex-1">
									<p className="truncate text-sm font-medium text-[#0F172A] dark:text-white">
										{payment.employee.user.name}
									</p>
									<p className="truncate font-mono text-xs text-[#64748B] dark:text-[#94A3B8]">
										{payment.employee.employeeCode}
									</p>
								</div>
								<StatusBadge status={payment.status} />
							</div>

							<div className="rounded-lg border border-[#E2E8F0] p-4 dark:border-[#1E293B]">
								<p className="text-3xl font-bold text-[#0F172A] tabular-nums dark:text-white">
									{formatCurrency(payment.amount)}
								</p>
								<p className="mt-1 text-xs text-[#64748B] dark:text-[#94A3B8]">
									{payment.gateway === "STRIPE" ? "Stripe" : payment.gateway} · {payment.currency.toUpperCase()}
								</p>
							</div>

							<dl className="divide-y divide-[#F1F5F9] border-y border-[#F1F5F9] dark:divide-[#1E293B] dark:border-[#1E293B]">
								{/* An open checkout stores its session id (cs_…); a finished one, the payment intent (pi_…) */}
								<Row label={payment.transactionId?.startsWith("cs_") ? "Checkout session" : "Transaction"}>
									{payment.transactionId ? (
										<TransactionId id={payment.transactionId} />
									) : (
										<span className="text-[#94A3B8]">Not paid yet</span>
									)}
								</Row>
								<Row label="Started">
									<time dateTime={payment.createdAt} className="tabular-nums">
										{exactTime(payment.createdAt)}
									</time>
								</Row>
								<Row label="Last update">
									<time dateTime={payment.updatedAt} className="tabular-nums">
										{exactTime(payment.updatedAt)}
									</time>
									<span className="block text-xs text-[#64748B] dark:text-[#94A3B8]">
										{formatDistanceToNowStrict(new Date(payment.updatedAt), { addSuffix: true })}
									</span>
								</Row>
							</dl>

							<div className="space-y-2">
								<h3 className="text-xs font-semibold tracking-wider text-[#64748B] uppercase dark:text-[#94A3B8]">
									Payroll
								</h3>
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
						</div>

						{canRetry ? (
							<div className="sticky bottom-0 space-y-2 border-t border-[#E2E8F0] bg-white p-4 dark:border-[#1E293B] dark:bg-[#0F172A]">
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
						) : null}
					</div>
				) : null}
			</SheetContent>
		</Sheet>
	);
}
