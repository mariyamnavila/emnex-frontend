import { Suspense } from "react";
import type { Metadata } from "next";
import { PageSkeleton } from "@/components/shared";
import { PayrollView } from "@/components/payroll/payroll-view";

export const metadata: Metadata = { title: "Payroll" };

// Same screen as for admins; actions follow the payroll.* / payment.create permissions.
// URL filters (useSearchParams) need a Suspense boundary
export default function PayrollPage() {
	return (
		<Suspense fallback={<PageSkeleton stats />}>
			<PayrollView />
		</Suspense>
	);
}
