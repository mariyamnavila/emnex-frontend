import type { Metadata } from "next";
import { ManagerOverview } from "./manager-overview";

export const metadata: Metadata = { title: "Overview" };

export default function ManagerOverviewPage() {
	return <ManagerOverview />;
}
