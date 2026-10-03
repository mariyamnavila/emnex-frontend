"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { AlertCircle, CheckCircle2, Clock, Loader2, Printer, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared";
import { useGetMe } from "@/hooks/auth.hook";
import { clearPendingCheckout, useVerifyCheckout } from "@/hooks/payment.hook";
import { ApiError } from "@/lib/api";
import { formatCurrency } from "@/lib/pay";
import { formatDate, formatDay } from "@/lib/utils";
import { PaymentCard, payrollHref } from "../payment-card";

function ReceiptRow({ label, value }: { label: string; value: React.ReactNode }) {
	return (
		<div className="flex items-start justify-between gap-4 py-2.5">
			<dt className="text-sm text-[#64748B] dark:text-[#94A3B8]">{label}</dt>
			<dd className="min-w-0 text-right text-sm font-medium text-[#0F172A] dark:text-white">{value}</dd>
		</div>
	);
}

export function SuccessView() {
	const sessionId = useSearchParams().get("session_id");
	const queryClient = useQueryClient();
	const { data: me } = useGetMe();
	const { data, error, isLoading, refetch, isFetching } = useVerifyCheckout(sessionId);
	const backHref = payrollHref(me?.role.name);
	const isPaid = data?.status === "paid";

	// Payroll lists/analytics now show PAID; the retry info is no longer needed
	useEffect(() => {
		if (!isPaid) return;
		clearPendingCheckout();
		void queryClient.invalidateQueries({ queryKey: ["payroll"] });
		void queryClient.invalidateQueries({ queryKey: ["analytics"] });
	}, [isPaid, queryClient]);

	const backButton = (
		<Button asChild className="w-full bg-[#2563EB] text-white shadow-none hover:bg-[#1D4ED8]">
			<Link href={backHref}>Back to payroll</Link>
		</Button>
	);

	if (!sessionId) {
		return (
			<PaymentCard
				icon={SearchX}
				tone="warning"
				title="Missing payment reference"
				description="This page is opened by Stripe after a checkout. The link you used doesn't include a payment reference."
			>
				{backButton}
			</PaymentCard>
		);
	}

	if (isLoading) {
		return (
			<PaymentCard
				icon={Loader2}
				spin
				tone="info"
				title="Confirming your payment"
				description="Checking with Stripe — this only takes a moment."
			/>
		);
	}

	if (error) {
		const status = error instanceof ApiError ? error.statusCode : 0;
		if (status === 401) {
			const back = `/payment/success?session_id=${sessionId}`;
			return (
				<PaymentCard
					icon={AlertCircle}
					tone="warning"
					title="Sign in to see your receipt"
					description="Your payment was handled by Stripe. Sign in again to confirm it and view the receipt."
				>
					<Button asChild className="w-full bg-[#2563EB] text-white shadow-none hover:bg-[#1D4ED8]">
						<Link href={`/login?redirectTo=${encodeURIComponent(back)}`}>Sign in</Link>
					</Button>
				</PaymentCard>
			);
		}
		return (
			<PaymentCard
				icon={status === 404 ? SearchX : AlertCircle}
				tone="error"
				title={status === 404 ? "Payment not found" : "Couldn't confirm the payment"}
				description={
					status === 404
						? "We couldn't find this checkout for your organization."
						: `${error.message} Your card may still have been charged — check the payroll page before paying again.`
				}
			>
				<div className="flex flex-col gap-2 sm:flex-row">
					{status !== 404 ? (
						<Button variant="outline" className="w-full sm:flex-1" disabled={isFetching} onClick={() => void refetch()}>
							Try again
						</Button>
					) : null}
					<Button asChild className="w-full bg-[#2563EB] text-white shadow-none hover:bg-[#1D4ED8] sm:flex-1">
						<Link href={backHref}>Back to payroll</Link>
					</Button>
				</div>
			</PaymentCard>
		);
	}

	if (!data) return null;

	if (data.status !== "paid") {
		const expired = data.status === "expired";
		return (
			<PaymentCard
				icon={expired ? AlertCircle : Clock}
				tone="warning"
				title={expired ? "This checkout expired" : "Payment is processing"}
				description={
					expired
						? "No payment was taken. Start a new payment from the payroll page."
						: "Stripe hasn't confirmed this payment yet. This page updates automatically."
				}
			>
				{backButton}
			</PaymentCard>
		);
	}

	const { payment } = data;
	return (
		<PaymentCard
			icon={CheckCircle2}
			tone="success"
			title="Payment successful"
			description={
				<>
					<span className="block text-3xl font-bold tracking-tight text-[#0F172A] tabular-nums dark:text-white">
						{formatCurrency(payment.amount)}
					</span>
					paid to {payment.employee.user.name}
				</>
			}
		>
			<dl className="divide-y divide-[#F1F5F9] border-y border-[#F1F5F9] dark:divide-[#1E293B] dark:border-[#1E293B]">
				<ReceiptRow
					label="Employee"
					value={`${payment.employee.user.name} · ${payment.employee.employeeCode}`}
				/>
				<ReceiptRow
					label="Pay period"
					value={
						<span className="tabular-nums">
							{formatDay(payment.payroll.periodStart)} – {formatDay(payment.payroll.periodEnd)}
						</span>
					}
				/>
				<ReceiptRow label="Gross" value={<span className="tabular-nums">{formatCurrency(payment.payroll.grossAmount)}</span>} />
				<ReceiptRow
					label="Deductions"
					value={<span className="tabular-nums">− {formatCurrency(payment.payroll.deductions)}</span>}
				/>
				<ReceiptRow
					label="Net paid"
					value={<span className="font-bold tabular-nums">{formatCurrency(payment.payroll.netAmount)}</span>}
				/>
				<ReceiptRow label="Paid on" value={formatDate(payment.updatedAt)} />
				<ReceiptRow label="Status" value={<StatusBadge status={payment.status} />} />
				{payment.transactionId ? (
					<ReceiptRow
						label="Transaction"
						value={<span className="font-mono text-xs break-all">{payment.transactionId}</span>}
					/>
				) : null}
			</dl>

			<div className="mt-6 flex flex-col gap-2 sm:flex-row print:hidden">
				<Button variant="outline" className="w-full sm:flex-1" onClick={() => window.print()}>
					<Printer className="size-4" />
					Print receipt
				</Button>
				<Button asChild className="w-full bg-[#2563EB] text-white shadow-none hover:bg-[#1D4ED8] sm:flex-1">
					<Link href={backHref}>Back to payroll</Link>
				</Button>
			</div>
		</PaymentCard>
	);
}
