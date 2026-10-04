import { Suspense } from "react";
import type { Metadata } from "next";
import { PageSkeleton } from "@/components/shared";
import { DepartmentsView } from "./departments-view";

export const metadata: Metadata = { title: "Departments" };

// SearchInput reads the URL, which needs a Suspense boundary
export default function DepartmentsPage() {
	return (
		<Suspense fallback={<PageSkeleton toolbar cards />}>
			<DepartmentsView />
		</Suspense>
	);
}
