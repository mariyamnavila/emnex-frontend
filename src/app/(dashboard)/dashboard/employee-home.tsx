"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";
import { firstAccessibleHref, hasManagementPermission, sidebarRoutesByRole } from "@/config/sidebar-routes";
import { useCurrentUser } from "@/hooks/auth.hook";
import { EmployeeOverview } from "./employee-overview";

// The employee overview is for employees. A custom management role that lands
// here (its home defaults to /dashboard) is sent to its first allowed page.
export function EmployeeHome() {
	const router = useRouter();
	const { role, permissions } = useCurrentUser();
	const redirectHref =
		role && !sidebarRoutesByRole[role] && hasManagementPermission(permissions)
			? firstAccessibleHref(role, permissions)
			: null;

	useEffect(() => {
		if (redirectHref) router.replace(redirectHref);
	}, [redirectHref, router]);

	if (redirectHref) return <DashboardSkeleton />;
	return <EmployeeOverview />;
}
