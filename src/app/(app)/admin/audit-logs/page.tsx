import { Suspense } from "react";
import type { Metadata } from "next";
import { PageSkeleton } from "@/components/shared";
import { AuditLogsView } from "./audit-logs-view";

export const metadata: Metadata = { title: "Audit Logs" };

// URL filters (useSearchParams) need a Suspense boundary
export default function AuditLogsPage() {
	return (
		<Suspense
			fallback={<PageSkeleton />}
		>
			<AuditLogsView />
		</Suspense>
	);
}
