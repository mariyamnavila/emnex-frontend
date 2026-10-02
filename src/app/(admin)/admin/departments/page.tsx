import { Suspense } from "react";
import type { Metadata } from "next";
import { Skeleton } from "@/components/ui/skeleton";
import { DepartmentsView } from "./departments-view";

export const metadata: Metadata = { title: "Departments" };

const bone = "bg-[#F1F5F9] dark:bg-[#1E293B]";

function DepartmentsSkeleton() {
	return (
		<div className="space-y-6">
			<div className="space-y-2 border-b border-[#E2E8F0] pb-5 dark:border-[#1E293B]">
				<Skeleton className={`h-8 w-44 ${bone}`} />
				<Skeleton className={`h-4 w-64 ${bone}`} />
			</div>
			<Skeleton className={`h-9 w-64 ${bone}`} />
			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
				{Array.from({ length: 6 }).map((_, i) => (
					<Skeleton key={`dept-${i}`} className={`h-40 rounded-lg ${bone}`} />
				))}
			</div>
		</div>
	);
}

// SearchInput reads the URL, which needs a Suspense boundary
export default function DepartmentsPage() {
	return (
		<Suspense fallback={<DepartmentsSkeleton />}>
			<DepartmentsView />
		</Suspense>
	);
}
