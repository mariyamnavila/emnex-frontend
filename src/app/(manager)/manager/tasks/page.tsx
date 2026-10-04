import { Suspense } from "react";
import type { Metadata } from "next";
import { Skeleton } from "@/components/ui/skeleton";
import { TasksView } from "./tasks-view";

export const metadata: Metadata = { title: "Tasks" };

const bone = "bg-[#F1F5F9] dark:bg-[#1E293B]";

// URL filters (useSearchParams) need a Suspense boundary
export default function TasksPage() {
	return (
		<Suspense
			fallback={
				<div className="space-y-6">
					<div className="space-y-2 border-b border-[#E2E8F0] pb-5 dark:border-[#1E293B]">
						<Skeleton className={`h-8 w-32 ${bone}`} />
						<Skeleton className={`h-4 w-96 max-w-full ${bone}`} />
					</div>
					<Skeleton className={`h-20 rounded-lg ${bone}`} />
					<Skeleton className={`h-96 rounded-lg ${bone}`} />
				</div>
			}
		>
			<TasksView />
		</Suspense>
	);
}
