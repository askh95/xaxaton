export interface LoginRequest {
	email: string;
	password: string;
}

export interface UserResponse extends User {
	email: string;
	emailVerified: boolean;
	role: {
		id: number;
		name: UserRole;
	};
	region: {
		id: number;
		name: string;
		contactEmail: string;
		createdAt: string;
	} | null;
	createdAt: string;
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

export interface PaginatedResponse<T> {
	content: T[];
	pageable: Pageable;
	totalPages: number;
	totalElements: number;
	last: boolean;
	size: number;
	number: number;
	sort: Sort;
	numberOfElements: number;
	first: boolean;
	empty: boolean;
}

export interface UsersParams {
	page?: number;
	size?: number;
	direction?: "asc" | "desc";
	search?: string;
	excludeRole?: UserRole;
	includeOnlyRole?: UserRole; // New filter
}
export interface RegisterRequest {
	firstname: string;
	lastname: string;
	patronymic: string;
	email: string;
	password: string;
}

export interface User {
	id: number;
	firstname: string;
	lastname: string;
	patronymic: string;
}

export interface UserMe {
	id: number;
	firstname: string;
	lastname: string;
	patronymic: string;
}

export interface AuthResponse {
	token: string;
	user: User;
}

export interface UpdateUserRequest {
	id: number;
	firstname: string;
	lastname: string;
	patronymic: string;
}

export interface EmailVerifyRequest {
	token: string;
}

export interface ResetPasswordRequest {
	email: string;
}

export interface ResetPasswordVerifyRequest {
	token: string;
	newPassword: string;
}

export type UserRole = "REGION_ADMIN" | "FSP_ADMIN" | "USER";
