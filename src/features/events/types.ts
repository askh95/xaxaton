// src/features/events/types.ts
export type EventRequestStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface EventRequestsParams {
	page: number;
	size: number;
	direction: string;
	status?: EventRequestStatus | null;
}

export interface EventRequest {
	id: number;
	moderationComment: string | null;
	status: "PENDING" | "APPROVED" | "REJECTED";
	name: string;
	gender: "MALE" | "FEMALE" | "ANY";
	minAge: number;
	maxAge: number;
	location: string;
	disciplines: Array<{
		id: number;
		name: string;
	}>;
	startDate: string;
	endDate: string;
	maxParticipants: number;
	region: {
		id: number;
		name: string;
		contactEmail: string;
		createdAt: string;
		user: {
			id: number;
			firstname: string;
			lastname: string;
			patronymic: string;
			email: string;
			emailVerified: boolean | null;
			role: {
				id: number;
				name: string;
			};
			region: null | any;
			createdAt: string;
		};
	};
	baseId: number;
}

export interface Pageable {
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
}

export interface CreateEventRequest {
	name: string;
	gender: string;
	minAge: number;
	maxAge: number;
	location: string;
	disciplines: number[];
	startDate: string;
	endDate: string;
	maxParticipants: number;
	regionId: number;
}
export interface Region {
	id: number;
	name: string;
	contactEmail: string;
	createdAt: string;
	user?: {
		id: number;
		firstname: string;
		lastname: string;
		email: string;
	};
}

export interface RegionsResponse {
	content: Region[];
	totalElements: number;
	totalPages: number;
	size: number;
	number: number;
}

export interface PaginatedResponse<T> {
	content: T[];
	pageable: Pageable;
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

export interface RejectEventRequest {
	id: number;
	comment: string;
}

export interface EventsParams {
	page?: number;
	size?: number;
	direction?: "asc" | "desc";
	name?: string;
	gender?: string;
	minAge?: number;
	maxAge?: number;
	location?: string;
	startDate?: string;
	endDate?: string;
	maxParticipants?: number;
	regionId?: number;
}

export interface Event {
	id: number;
	name: string;
	gender: string;
	minAge: number;
	maxAge: number;
	location: string;
	disciplines: Array<{
		id: number;
		name: string;
	}>;
	startDate: string;
	endDate: string;
	maxParticipants: number;
	region: {
		id: number;
		name: string;
		contactEmail: string;
		createdAt: string;
	};
	eventProtocol?: {
		id: number;
		originalFileName: string;
		storedFileName: string;
		contentType: string;
		fileSize: number;
		createdAt: string;
	};
}
