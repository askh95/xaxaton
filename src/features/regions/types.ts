import { UserRole } from "../auth/types";

export interface Region {
	id: number;
	name: string;
	contactEmail: string;
	description: string;
	createdAt: string;
}

export interface RegionUser {
	id: number;
	firstname: string;
	lastname: string;
	patronymic: string;
	email: string;
	emailVerified: boolean;
	role: {
		id: number;
		name: UserRole;
	};
	region: Region;
	createdAt: string;
}

export interface RegionResponse extends Region {
	user: RegionUser;
}

export interface CreateRegionRequest {
	name: string;
	description: string;
	contactEmail: string;
	userId: number;
}

export interface UpdateRegionRequest {
	name?: string;
	description: string;
	contactEmail?: string;
	userId?: number;
}

export interface PaginatedRegionResponse {
	content: RegionResponse[];
	totalPages: number;
	totalElements: number;
	last: boolean;
	size: number;
	number: number;
	first: boolean;
	numberOfElements: number;
	empty: boolean;
	pageable: {
		pageNumber: number;
		pageSize: number;
		sort: {
			sorted: boolean;
			unsorted: boolean;
			empty: boolean;
		};
	};
}

export interface RegionParams {
	page?: number;
	size?: number;
	direction?: "asc" | "desc";
	search?: string;
}
