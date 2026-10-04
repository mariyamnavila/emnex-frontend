import { Suspense } from "react";
import type { Metadata } from "next";
import { PageSkeleton } from "@/components/shared";
import { MyTasksView } from "./my-tasks-view";

export const metadata: Metadata = { title: "My Tasks" };

// The status filter reads the URL, which needs a Suspense boundary
export default function MyTasksPage() {
	return (
		<Suspense fallback={<PageSkeleton toolbar cards />}>
			<MyTasksView />
		</Suspense>
	);
}
