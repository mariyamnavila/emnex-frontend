"use client";

import Link from "next/link";
import { Loader2, RotateCcw, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetMe } from "@/hooks/auth.hook";
import { usePendingCheckout, useStartCheckout } from "@/hooks/payment.hook";
import { formatCurrency } from "@/lib/pay";
import { PaymentCard, payrollHref } from "../payment-card";

export function CancelView() {
	const { data: me } = useGetMe();
	const pending = usePendingCheckout();
	const startCheckout = useStartCheckout();
	const isRedirecting = startCheckout.isPending || startCheckout.isSuccess;

	return (
		<PaymentCard
			icon={XCircle}
			tone="warning"
			title="Payment cancelled"
			description={
				pending ? (
					<>
						No money was taken. The payroll for{" "}
						<span className="font-medium text-[#0F172A] dark:text-white">{pending.employeeName}</span> (
						<span className="tabular-nums">{formatCurrency(pending.netAmount)}</span>) is still approved and
						can be paid any time.
					</>
				) : (
					"No money was taken. The payroll is still approved and can be paid any time from the payroll page."
				)
			}
		>
			<div className="flex flex-col gap-2 sm:flex-row">
				<Button asChild variant="outline" className="w-full sm:flex-1">
					<Link href={payrollHref(me?.role.name)}>Back to payroll</Link>
				</Button>
				{pending ? (
					<Button
						className="w-full bg-[#2563EB] text-white shadow-none hover:bg-[#1D4ED8] sm:flex-1"
						disabled={isRedirecting}
						onClick={() => startCheckout.mutate(pending)}
					>
						{isRedirecting ? <Loader2 className="size-4 animate-spin" /> : <RotateCcw className="size-4" />}
						{isRedirecting ? "Opening Stripe..." : "Try again"}
					</Button>
				) : null}
			</div>
		</PaymentCard>
	);
}
