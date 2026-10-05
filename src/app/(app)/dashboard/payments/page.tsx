import { Suspense } from "react";
import type { Metadata } from "next";
import { PageSkeleton } from "@/components/shared";
import { MyPaymentsView } from "./my-payments-view";

export const metadata: Metadata = { title: "My Payments" };

// Status and page live in the URL, which needs a Suspense boundary
export default function MyPaymentsPage() {
	return (
		<Suspense fallback={<PageSkeleton stats />}>
			<MyPaymentsView />
		</Suspense>
	);
}
