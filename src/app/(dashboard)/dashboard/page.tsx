import type { Metadata } from "next";
import { EmployeeOverview } from "./employee-overview";

export const metadata: Metadata = { title: "Overview" };

export default function EmployeeOverviewPage() {
	return <EmployeeOverview />;
}
