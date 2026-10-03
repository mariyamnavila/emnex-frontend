import { Suspense } from "react";
import type { Metadata } from "next";
import { Loader2 } from "lucide-react";
import { PaymentCard } from "../payment-card";
import { SuccessView } from "./success-view";

export const metadata: Metadata = {
	title: "Payment successful",
	robots: { index: false },
};

// Reads ?session_id from the URL, which needs a Suspense boundary
export default function PaymentSuccessPage() {
	return (
		<Suspense
			fallback={
				<PaymentCard icon={Loader2} spin tone="info" title="Confirming your payment" description="Checking with Stripe…" />
			}
		>
			<SuccessView />
		</Suspense>
	);
}
