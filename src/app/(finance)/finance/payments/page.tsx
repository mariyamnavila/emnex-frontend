import { Suspense } from "react";
import type { Metadata } from "next";
import { PageSkeleton } from "@/components/shared";
import { PaymentsView } from "./payments-view";

export const metadata: Metadata = { title: "Payments" };

// URL filters (useSearchParams) need a Suspense boundary
export default function PaymentsPage() {
	return (
		<Suspense fallback={<PageSkeleton stats />}>
			<PaymentsView />
		</Suspense>
	);
}
