import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { EmployeesView } from "./employees-view";

export default function EmployeesPage() {
	return (
		<Suspense
			fallback={
				<div className="space-y-5">
					<Skeleton className="h-9 w-56 bg-[#F1F5F9] dark:bg-[#1E293B]" />
					<Skeleton className="h-9 w-full bg-[#F1F5F9] dark:bg-[#1E293B]" />
					<Skeleton className="h-64 rounded-lg bg-[#F1F5F9] dark:bg-[#1E293B]" />
				</div>
			}
		>
			<EmployeesView />
		</Suspense>
	);
}
