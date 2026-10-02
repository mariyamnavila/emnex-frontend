export interface EmployeeUser {
	id: string;
	name: string;
	email: string;
	avatar: string | null;
}

export interface EmployeeDepartment {
	id: string;
	name: string;
}

export interface Employee {
	id: string;
	employeeCode: string;
	jobTitle: string;
	salaryType: "MONTHLY" | "HOURLY";
	salary: number | null;
	hourlyRate: number | null;
	joiningDate: string;
	status: "ACTIVE" | "INACTIVE" | "SUSPENDED" | "TERMINATED";
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

export interface Department {
	id: string;
	name: string;
	description: string | null;
	_count?: { employees: number };
}
