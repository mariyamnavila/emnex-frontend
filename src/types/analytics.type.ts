// GET /analytics/dashboard — ADMIN shape (other roles get different fields)
export interface AdminDashboardStats {
	totalEmployees: number;
	activeEmployees: number;
	activeProjects: number;
	pendingSubmissions: number;
	pendingPayroll: number;
	totalPayroll: number;
	completedPayments: number;
}

export interface StatusCount {
	status: string;
	_count: number;
}

export interface PayrollAnalytics {
	byStatus: (StatusCount & { totalAmount: number })[];
	totals: {
		grossAmount: number;
		deductions: number;
		netAmount: number;
		count: number;
	};
	monthlyTrend: { period: string; total: number; count: number }[];
}

export interface ProjectAnalytics {
	byStatus: StatusCount[];
	totalProjects: number;
	avgTasksPerProject: number;
}


// GET /analytics/dashboard — HR_MANAGER shape
export interface ManagerDashboardStats {
	totalEmployees: number;
	activeEmployees: number;
	totalDepartments: number;
	newEmployeesThisMonth: number;
	employeeByStatus: StatusCount[];
	pendingSubmissions: number;
	pendingHours: number;
	approvedHoursThisMonth: number;
}
