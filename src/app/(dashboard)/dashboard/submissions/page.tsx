import { Suspense } from "react";
import type { Metadata } from "next";
import { PageSkeleton } from "@/components/shared";
import { MySubmissionsView } from "./my-submissions-view";

export const metadata: Metadata = { title: "My Submissions" };

// Status and page live in the URL, which needs a Suspense boundary
export default function MySubmissionsPage() {
	return (
		<Suspense fallback={<PageSkeleton stats />}>
			<MySubmissionsView />
		</Suspense>
	);
}
