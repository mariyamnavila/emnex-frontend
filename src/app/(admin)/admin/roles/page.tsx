import { Suspense } from "react";
import type { Metadata } from "next";
import { Skeleton } from "@/components/ui/skeleton";
import { RolesView } from "./roles-view";

export const metadata: Metadata = { title: "Roles & Permissions" };

// The selected role lives in the URL (?role=), which needs a Suspense boundary
export default function RolesPage() {
	return (
		<Suspense fallback={<Skeleton className="h-96 rounded-lg bg-[#F1F5F9] dark:bg-[#1E293B]" />}>
			<RolesView />
		</Suspense>
	);
}
