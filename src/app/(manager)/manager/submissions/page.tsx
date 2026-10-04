import { Suspense } from "react";
import type { Metadata } from "next";
import { PageSkeleton } from "@/components/shared";
import { SubmissionsView } from "./submissions-view";

export const metadata: Metadata = { title: "Submissions" };

// URL filters (useSearchParams) need a Suspense boundary
export default function SubmissionsPage() {
	return (
		<Suspense
			fallback={<PageSkeleton />}
		>
			<SubmissionsView />
		</Suspense>
	);
}
