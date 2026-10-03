"use client";

import { useSyncExternalStore } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, ApiError } from "@/lib/api";
import type { CheckoutVerification, PendingCheckout } from "@/types/payment.type";

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
