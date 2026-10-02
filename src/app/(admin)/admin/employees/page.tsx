import { Suspense } from "react";
import type { Metadata } from "next";
import { Skeleton } from "@/components/ui/skeleton";
import { EmployeesView } from "./employees-view";

export const metadata: Metadata = { title: "Employees" };

const bone = "bg-[#F1F5F9] dark:bg-[#1E293B]";

// Same shape as EmployeesView (header, 4 stat cards, directory card) to avoid layout jump
function EmployeesSkeleton() {
	return (
		<div className="space-y-6">
			<div className="space-y-2 border-b border-[#E2E8F0] pb-5 dark:border-[#1E293B]">
				<Skeleton className={`h-8 w-40 ${bone}`} />
				<Skeleton className={`h-4 w-72 ${bone}`} />
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

// useSearchParams (URL filters) needs a Suspense boundary
export default function EmployeesPage() {
	return (
		<Suspense fallback={<EmployeesSkeleton />}>
			<EmployeesView />
		</Suspense>
	);
}
