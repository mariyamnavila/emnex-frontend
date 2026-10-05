import type { Metadata } from "next";
import { EmployeeHome } from "./employee-home";

export const metadata: Metadata = { title: "Overview" };

export default function EmployeeOverviewPage() {
	return <EmployeeHome />;
}
