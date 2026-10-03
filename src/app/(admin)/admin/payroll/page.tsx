import { Suspense } from "react";
import type { Metadata } from "next";
import { Skeleton } from "@/components/ui/skeleton";
import { PayrollView } from "./payroll-view";

export const metadata: Metadata = { title: "Payroll" };

const bone = "bg-[#F1F5F9] dark:bg-[#1E293B]";

function PayrollSkeleton() {
	return (
		<div className="space-y-6">
			<div className="space-y-2 border-b border-[#E2E8F0] pb-5 dark:border-[#1E293B]">
				<Skeleton className={`h-8 w-32 ${bone}`} />
				<Skeleton className={`h-4 w-80 ${bone}`} />
			</div>
			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				{Array.from({ length: 4 }).map((_, i) => (
					<Skeleton key={`card-${i}`} className={`h-32 rounded-lg ${bone}`} />
				))}
			</div>
			<Skeleton className={`h-96 rounded-lg ${bone}`} />
		</div>
	);
}

// URL filters (useSearchParams) need a Suspense boundary
export default function PayrollPage() {
	return (
		<Suspense fallback={<PayrollSkeleton />}>
			<PayrollView />
		</Suspense>
	);
}
