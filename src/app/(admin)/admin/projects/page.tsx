import { Suspense } from "react";
import type { Metadata } from "next";
import { PageSkeleton } from "@/components/shared";
import { ProjectsView } from "./projects-view";

export const metadata: Metadata = { title: "Projects" };

// URL filters (useSearchParams) need a Suspense boundary
export default function ProjectsPage() {
	return (
		<Suspense fallback={<PageSkeleton stats />}>
			<ProjectsView />
		</Suspense>
	);
}
