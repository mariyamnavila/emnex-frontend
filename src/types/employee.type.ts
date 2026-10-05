export interface EmployeeUser {
	id: string;
	name: string;
	email: string;
	avatar: string | null;
	roleId: string;
}

export interface EmployeeDepartment {
	id: string;
	name: string;
}

export type EmployeeStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED" | "TERMINATED";

// Employee as the UI uses it — pay already converted to numbers (see hooks/employee.hook.ts)
export interface Employee {
	id: string;
	employeeCode: string;
	jobTitle: string;
	salaryType: "MONTHLY" | "HOURLY";
	salary: number | null;
	hourlyRate: number | null;
	joiningDate: string;
	status: EmployeeStatus;
	createdAt: string;
	user: EmployeeUser;
	department: EmployeeDepartment | null;
}

export interface EmployeeDetail extends Employee {
	_count: {
		tasks: number;
		submissions: number;
		payrolls: number;
		payments: number;
	};
}

// Same records as sent by the API: Prisma Decimal money fields arrive as strings
export type ApiEmployee<T extends Employee = Employee> = Omit<
	T,
	"salary" | "hourlyRate"
> & {
	salary: string | number | null;
	hourlyRate: string | number | null;
};

// GET /analytics/employees (only the parts the UI reads)
export interface EmployeeAnalytics {
	byStatus: { status: EmployeeStatus; _count: number }[];
	byDepartment: { department: string; count: number }[];
}

export interface Department {
	id: string;
	name: string;
	description: string | null;
	createdAt: string;
	_count?: { employees: number };
}
