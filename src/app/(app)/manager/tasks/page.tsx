import { Suspense } from "react";
import type { Metadata } from "next";
import { PageSkeleton } from "@/components/shared";
import { TasksView } from "./tasks-view";

export const metadata: Metadata = { title: "Tasks" };

// URL filters (useSearchParams) need a Suspense boundary
export default function TasksPage() {
	return (
		<Suspense
			fallback={<PageSkeleton toolbar />}
		>
			<TasksView />
		</Suspense>
	);
}
