export interface Sort {
	sorted: boolean;
	empty: boolean;
	unsorted: boolean;
}

export interface Pageable {
	paged: boolean;
	unpaged: boolean;
	pageNumber: number;
	pageSize: number;
	offset: number;
	sort: Sort;
}

export interface Notification {
	id: number;
	recipientId: number;
	content: string;
	type: string;
	read: boolean;
	createdAt: string;
}

export interface NotificationsResponse {
	content: Notification[];
	totalElements: number;
	totalPages: number;
	last: boolean;
	first: boolean;
	empty: boolean;
	number: number;
	numberOfElements: number;
	size: number;
	pageable: Pageable;
	sort: Sort;
}

export interface NotificationsParams {
	page?: number;
	size?: number;
	read?: boolean;
	sort?: string[];
}
