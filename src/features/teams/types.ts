export interface Region {
	id: number;
	name: string;
	contactEmail: string;
	createdAt: string;
}

export interface Role {
	id: number;
	name: string;
}

export interface TeamMember {
	id: number;
	firstname: string;
	lastname: string;
	patronymic: string;
	email: string;
	emailVerified: boolean;
	role: Role;
	region: Region;
	createdAt: string;
}

export interface Team {
	id: number;
	name: string;
	description: string;
	region: Region;
	members: TeamMember[];
	createdAt: string;
	updatedAt: string;
}

export interface CreateTeamRequest {
	name: string;
	description: string;
}

export interface UpdateTeamRequest {
	name: string;
	description: string;
}

export interface PaginatedResponse<T> {
	content: T[];
	pageable: {
		pageNumber: number;
		pageSize: number;
		sort: {
			sorted: boolean;
			empty: boolean;
			unsorted: boolean;
		};
		offset: number;
		paged: boolean;
		unpaged: boolean;
	};
	last: boolean;
	totalElements: number;
	totalPages: number;
	first: boolean;
	size: number;
	number: number;
	sort: {
		sorted: boolean;
		empty: boolean;
		unsorted: boolean;
	};
	numberOfElements: number;
	empty: boolean;
}
