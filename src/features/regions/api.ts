import { baseApi } from "../baseApi";
import {
	RegionResponse,
	PaginatedRegionResponse,
	CreateRegionRequest,
	UpdateRegionRequest,
	RegionParams,
} from "./types";

export const regionApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		getRegions: builder.query<PaginatedRegionResponse, RegionParams>({
			query: (params) => ({
				url: "/regions",
				params: {
					page: params.page ?? 0,
					size: params.size ?? 30,
					direction: params.direction ?? "desc",
					...(params.search && { search: params.search }),
				},
			}),
			serializeQueryArgs: ({ queryArgs }) => {
				return {
					direction: queryArgs.direction,
					search: queryArgs.search,
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
			providesTags: ["Region"],
		}),

		getRegion: builder.query<RegionResponse, number>({
			query: (id) => `/regions/${id}`,
			providesTags: ["Region"],
		}),

		createRegion: builder.mutation<RegionResponse, CreateRegionRequest>({
			query: (data) => ({
				url: "/regions",
				method: "POST",
				body: data,
			}),
			invalidatesTags: ["Region"],
		}),

		updateRegion: builder.mutation<
			RegionResponse,
			{ id: number; data: UpdateRegionRequest }
		>({
			query: ({ id, data }) => ({
				url: `/regions/${id}`,
				method: "PUT",
				body: data,
			}),
			invalidatesTags: ["Region"],
		}),

		deleteRegion: builder.mutation<void, number>({
			query: (id) => ({
				url: `/regions/${id}`,
				method: "DELETE",
			}),
			invalidatesTags: ["Region"],
		}),
	}),
});

export const {
	useGetRegionsQuery,
	useGetRegionQuery,
	useCreateRegionMutation,
	useUpdateRegionMutation,
	useDeleteRegionMutation,
} = regionApi;
