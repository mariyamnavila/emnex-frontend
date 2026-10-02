import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { EmployeeWizard } from "@/components/employees/employee-wizard";

export default function NewEmployeePage() {
	return (
		<div className="space-y-6">
			<PageHeader
				title="New employee"
				description="Add a team member — they get login credentials by email."
				actions={
					<Button
						asChild
						variant="outline"
						className="h-9 border-[#E2E8F0] text-sm text-[#334155] hover:bg-[#F8FAFC] dark:border-[#1E293B] dark:text-[#CBD5E1]"
					>
						<Link href="/admin/employees">
							<ArrowLeft className="size-4" />
							Back to list
						</Link>
					</Button>
				}
			/>
			<EmployeeWizard />
		</div>
	);
}
