import { Suspense } from "react";
import type { Metadata } from "next";
import { PayrollSkeleton } from "@/components/payroll/payroll-skeleton";
import { PaymentsView } from "./payments-view";

export const metadata: Metadata = { title: "Payments" };

// URL filters (useSearchParams) need a Suspense boundary
export default function PaymentsPage() {
	return (
		<Suspense fallback={<PayrollSkeleton />}>
			<PaymentsView />
		</Suspense>
	);
}
