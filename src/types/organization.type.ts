export interface Organization {
	id: string;
	name: string;
	slug: string;
	createdAt: string;
	_count: {
		users: number;
		departments: number;
		employees: number;
		projects: number;
	};
}
