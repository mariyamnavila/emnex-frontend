import { Suspense } from "react";
import type { Metadata } from "next";
import { PageSkeleton } from "@/components/shared";
import { RolesView } from "./roles-view";

export const metadata: Metadata = { title: "Roles & Permissions" };

// The selected role lives in the URL (?role=), which needs a Suspense boundary
export default function RolesPage() {
	return (
		<Suspense fallback={<PageSkeleton />}>
			<RolesView />
		</Suspense>
	);
}
