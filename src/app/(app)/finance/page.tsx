import type { Metadata } from "next";
import { FinanceOverview } from "./finance-overview";

export const metadata: Metadata = { title: "Overview" };

export default function FinanceOverviewPage() {
	return <FinanceOverview />;
}
