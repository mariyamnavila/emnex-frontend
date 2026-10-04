"use client";

import { useSyncExternalStore } from "react";
import { preconnect } from "react-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, ApiError, toQuery } from "@/lib/api";
import { toAmount } from "@/lib/pay";
import type {
	ApiMyPayment,
	ApiPayment,
	CheckoutVerification,
	MyPayment,
	Payment,
	PaymentStatus,
	PendingCheckout,
} from "@/types/payment.type";

const PENDING_CHECKOUT_KEY = "emnex:pending-checkout";

const readRaw = () => {
	try {
		return sessionStorage.getItem(PENDING_CHECKOUT_KEY);
	} catch {
		return null;
	}
};
const noSubscribe = () => () => {};

// Remembered across the Stripe redirect so the cancel page can offer "Try again".
// Server render sees null; the browser reads sessionStorage (no hydration mismatch).
export function usePendingCheckout(): PendingCheckout | null {
	const raw = useSyncExternalStore(noSubscribe, readRaw, () => null);
	if (!raw) return null;
	try {
		return JSON.parse(raw) as PendingCheckout;
	} catch {
		return null;
	}
}

export function clearPendingCheckout() {
	try {
		sessionStorage.removeItem(PENDING_CHECKOUT_KEY);
	} catch {
		// storage unavailable (private mode) — nothing to clear
	}
}

const STRIPE_HOSTS = [
	"https://checkout.stripe.com",
	"https://js.stripe.com",
	"https://api.stripe.com",
	"https://merchant-ui-api.stripe.com",
	"https://r.stripe.com",
];

// Opens DNS + TLS connections to Stripe early, so Checkout loads faster after the redirect
export function warmUpStripe() {
	for (const host of STRIPE_HOSTS) {
		preconnect(host);
		preconnect(host, { crossOrigin: "anonymous" });
	}
}

// Creates a Stripe Checkout session and sends the browser to it
export function useStartCheckout() {
	return useMutation({
		mutationFn: async (checkout: PendingCheckout) => {
			const { data } = await api.post<{ checkoutUrl: string | null }>("/payments", {
				payrollId: checkout.payrollId,
				currency: "usd",
			});
			if (!data.checkoutUrl) throw new Error("Stripe didn't return a checkout page");
			return { checkoutUrl: data.checkoutUrl, checkout };
		},
		onSuccess: ({ checkoutUrl, checkout }) => {
			try {
				sessionStorage.setItem(PENDING_CHECKOUT_KEY, JSON.stringify(checkout));
			} catch {
				// storage unavailable — cancel page just won't offer a direct retry
			}
			toast.loading("Redirecting to Stripe...");
			window.location.assign(checkoutUrl);
		},
		onError: (error) =>
			toast.error(error instanceof ApiError || error instanceof Error ? error.message : "Couldn't start payment"),
	});
}

export function useVerifyCheckout(sessionId: string | null) {
	return useQuery({
		queryKey: ["payments", "verify", sessionId],
		queryFn: async () => {
			const { data } = await api.get<CheckoutVerification>(`/payments/verify/${sessionId}`);
			return data;
		},
		enabled: Boolean(sessionId),
		retry: false,
		// Asynchronous payment methods can take a moment: re-check while unpaid
		refetchInterval: (query) => (query.state.data?.status === "unpaid" ? 4000 : false),
	});
}

// The nested payroll's money arrives as Decimal strings
const normalizePayment = <T extends Pick<ApiPayment, "payroll">>(payment: T) => ({
	...payment,
	payroll: {
		...payment.payroll,
		grossAmount: toAmount(payment.payroll.grossAmount) ?? 0,
		deductions: toAmount(payment.payroll.deductions) ?? 0,
		netAmount: toAmount(payment.payroll.netAmount) ?? 0,
	},
});

export interface PaymentListParams {
	page?: number;
	limit?: number;
	status?: PaymentStatus;
	employeeId?: string;
}

export function usePayments(params: PaymentListParams) {
	return useQuery({
		queryKey: ["payments", "list", params],
		queryFn: async () => {
			const res = await api.get<ApiPayment[]>(`/payments${toQuery({ ...params })}`);
			return { rows: res.data.map((payment): Payment => normalizePayment(payment)), meta: res.meta };
		},
		placeholderData: (prev) => prev,
	});
}

// The signed-in employee's payments, newest first
export function useMyPayments() {
	return useQuery({
		queryKey: ["payments", "my"],
		queryFn: async () => {
			const { data } = await api.get<ApiMyPayment[]>("/payments/my");
			return data.map((payment): MyPayment => normalizePayment(payment));
		},
	});
}
