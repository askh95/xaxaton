export interface Role {
	id: number;
	name: string;
}

export interface User {
	id: number;
	firstname: string;
	lastname: string;
	patronymic: string;
	email: string;
	password: string;
	role: Role;
	createdAt: string;
	region: string;
	emailVerified: boolean;
}

export interface Region {
	id: number;
	name: string;
	contactEmail: string;
	description: string;
	imageUrl: string;
	federalDistrict: string;
	createdAt: string;
	user: User;
}

export interface RegionApplication {
	id: number;
	region: Region;
	applicant: User;
	title: string;
	description: string;
	status: "PENDING" | "APPROVED" | "REJECTED";
	createdAt: string;
	responseMessage: string;
}

export interface PageableRequest {
	page: number;
	size: number;
	sort?: string[];
}

export interface Sort {
	sorted: boolean;
	empty: boolean;
	unsorted: boolean;
}

export interface Pageable {
	paged: boolean;
	pageNumber: number;
	pageSize: number;
	offset: number;
	sort: Sort;
	unpaged: boolean;
}

export interface PageResponse<T> {
	totalElements: number;
	totalPages: number;
	first: boolean;
	last: boolean;
	pageable: Pageable;
	size: number;
	content: T[];
	number: number;
	sort: Sort;
	numberOfElements: number;
	empty: boolean;
}
