import { Suspense } from "react";
import type { Metadata } from "next";
import { Skeleton } from "@/components/ui/skeleton";
import { ProjectDetailView } from "./project-detail-view";

export const metadata: Metadata = { title: "Project" };

export default async function ProjectDetailPage(props: PageProps<"/admin/projects/[id]">) {
	const { id } = await props.params;

	// Task status tabs read the URL, which needs a Suspense boundary
	return (
		<Suspense fallback={<Skeleton className="h-96 rounded-lg bg-[#F1F5F9] dark:bg-[#1E293B]" />}>
			<ProjectDetailView id={id} />
		</Suspense>
	);
}
