import { Suspense } from "react";
import type { Metadata } from "next";
import { PageSkeleton } from "@/components/shared";
import { ProjectDetailView } from "./project-detail-view";

export const metadata: Metadata = { title: "Project" };

export default async function ProjectDetailPage(props: PageProps<"/admin/projects/[id]">) {
	const { id } = await props.params;

	// Task status tabs read the URL, which needs a Suspense boundary
	return (
		<Suspense fallback={<PageSkeleton stats />}>
			<ProjectDetailView id={id} />
		</Suspense>
	);
}
