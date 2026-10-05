import { Suspense } from "react";
import type { Metadata } from "next";
import { PageSkeleton } from "@/components/shared";
import { EmployeesView } from "./employees-view";

export const metadata: Metadata = { title: "Employees" };

// useSearchParams (URL filters) needs a Suspense boundary
export default function EmployeesPage() {
	return (
		<Suspense fallback={<PageSkeleton stats />}>
			<EmployeesView />
		</Suspense>
	);
}
