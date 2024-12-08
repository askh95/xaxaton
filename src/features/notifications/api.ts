import { baseApi } from "../baseApi";

import { NotificationsParams, NotificationsResponse } from "./types";

export const notificationApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		getNotifications: build.query<NotificationsResponse, NotificationsParams>({
			query: (params) => ({
				url: "/notifications",
				params: {
					page: params.page ?? 0,
					size: params.size ?? 30,
					...(params.read !== undefined && { read: params.read }),
					...(params.sort && { sort: params.sort }),
				},
			}),
			serializeQueryArgs: ({ queryArgs }) => ({
				read: queryArgs.read,
				sort: queryArgs.sort,
			}),
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
			providesTags: ["Notification"],
		}),

		getUnreadCount: build.query<number, void>({
			query: () => "/notifications/unread-count",
			providesTags: ["Notification"],
		}),

		markAsRead: build.mutation<void, number>({
			query: (id) => ({
				url: `/notifications/${id}/mark-read`,
				method: "PATCH",
			}),
			invalidatesTags: ["Notification"],
		}),

		markAllAsRead: build.mutation<void, void>({
			query: () => ({
				url: "/notifications/mark-all-read",
				method: "PATCH",
			}),
			invalidatesTags: ["Notification"],
		}),
	}),
});

export const {
	useGetNotificationsQuery,
	useGetUnreadCountQuery,
	useMarkAsReadMutation,
	useMarkAllAsReadMutation,
} = notificationApi;
