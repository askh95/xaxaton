import { baseApi } from "../baseApi";
import {
	EventRequest,
	CreateEventRequest,
	PaginatedResponse,
	RejectEventRequest,
	EventRequestsParams,
	EventsParams,
} from "./types";

export const eventApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		getAllEventRequests: builder.query<
			PaginatedResponse<EventRequest>,
			EventRequestsParams
		>({
			query: (params) => ({
				url: "/event-requests",
				params: {
					page: params.page ?? 0,
					size: params.size ?? 30,
					direction: params.direction ?? "desc",
					...(params.status && { status: params.status }),
				},
			}),
			serializeQueryArgs: ({ queryArgs }) => {
				return {
					status: queryArgs.status,
					direction: queryArgs.direction,
				};
			},
			merge: (currentCache, newItems, { arg }) => {
				if (arg.page === 0) {
					return newItems;
				}
				return {
					...newItems,
					content: [...currentCache.content, ...newItems.content],
				};
			},
			forceRefetch({ currentArg, previousArg }) {
				return currentArg?.page !== previousArg?.page;
			},
			providesTags: ["Event"],
		}),
		getMyEventRequests: builder.query<
			PaginatedResponse<EventRequest>,
			EventRequestsParams
		>({
			query: (params) => ({
				url: "/event-requests/my",
				params: {
					page: params.page ?? 0,
					size: params.size ?? 30,
					direction: params.direction ?? "desc",
					...(params.status && { status: params.status }),
				},
			}),
			serializeQueryArgs: ({ queryArgs }) => {
				return {
					status: queryArgs.status,
					direction: queryArgs.direction,
				};
			},
			merge: (currentCache, newItems, { arg }) => {
				if (arg.page === 0) {
					return newItems;
				}
				return {
					...newItems,
					content: [...currentCache.content, ...newItems.content],
				};
			},
			forceRefetch({ currentArg, previousArg }) {
				return currentArg?.page !== previousArg?.page;
			},
			providesTags: ["Event"],
		}),
		getEventRequest: builder.query<EventRequest, number>({
			query: (id) => `/event-requests/${id}`,
			providesTags: ["Event"],
		}),
		createEventRequest: builder.mutation<EventRequest, CreateEventRequest>({
			query: (data) => ({
				url: "/event-requests",
				method: "POST",
				body: data,
			}),
			invalidatesTags: ["Event"],
		}),
		approveEventRequest: builder.mutation<void, number>({
			query: (id) => ({
				url: `/event-requests/${id}/approve`,
				method: "POST",
			}),
			invalidatesTags: ["Event"],
		}),
		rejectEventRequest: builder.mutation<void, RejectEventRequest>({
			query: ({ id, comment }) => ({
				url: `/event-requests/${id}/reject`,
				method: "POST",
				body: { comment },
			}),
			invalidatesTags: ["Event"],
		}),
		getAllEvents: builder.query<PaginatedResponse<Event>, EventsParams>({
			query: (params) => ({
				url: "/events",
				params: {
					page: params.page ?? 0,
					size: params.size ?? 30,
					direction: params.direction ?? "desc",
					...(params.name && { name: params.name }),
					...(params.gender && { gender: params.gender }),
					...(params.minAge && { minAge: params.minAge }),
					...(params.maxAge && { maxAge: params.maxAge }),
					...(params.location && { location: params.location }),
					...(params.startDate && { startDate: params.startDate }),
					...(params.endDate && { endDate: params.endDate }),
					...(params.maxParticipants && {
						maxParticipants: params.maxParticipants,
					}),
					...(params.regionId && { regionId: params.regionId }),
				},
			}),
			serializeQueryArgs: ({ queryArgs }) => {
				const { page, size, ...filterParams } = queryArgs;
				return filterParams;
			},
			merge: (currentCache, newItems, { arg }) => {
				if (arg.page === 0) {
					return newItems;
				}
				return {
					...newItems,
					content: [...currentCache.content, ...newItems.content],
				};
			},
			forceRefetch({ currentArg, previousArg }) {
				return currentArg?.page !== previousArg?.page;
			},
		}),
	}),
});

export const {
	useGetAllEventRequestsQuery,
	useGetMyEventRequestsQuery,
	useGetEventRequestQuery,
	useCreateEventRequestMutation,
	useApproveEventRequestMutation,
	useRejectEventRequestMutation,
	useGetAllEventsQuery,
} = eventApi;
