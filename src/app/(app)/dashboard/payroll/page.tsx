import type { Metadata } from "next";
import { MyPayrollView } from "./my-payroll-view";

export const metadata: Metadata = { title: "My Payroll" };

export default function MyPayrollPage() {
	return <MyPayrollView />;
}
