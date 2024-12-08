import { baseApi } from "../baseApi";
import { PageableRequest, RegionApplication, PageResponse } from "./types";

export const regionApplicationApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		getMyApplications: builder.query<
			PageResponse<RegionApplication>,
			PageableRequest
		>({
			query: (params) => ({
				url: "/region-applications/my",
				method: "GET",
				params: {
					page: params.page,
					size: params.size,
					sort: params.sort?.join(","),
				},
			}),
			providesTags: ["Region"],
		}),

		getRegionApplications: builder.query<
			PageResponse<RegionApplication>,
			PageableRequest
		>({
			query: (params) => ({
				url: "/region-applications/region",
				method: "GET",
				params: {
					page: params.page,
					size: params.size,
					sort: params.sort?.join(","),
				},
			}),
			providesTags: ["Region"],
		}),

		getApplicationById: builder.query<RegionApplication, number>({
			query: (id) => `/region-applications/${id}`,
			providesTags: ["Region"],
		}),

		createApplication: builder.mutation<
			void,
			{ regionId: number; title: string; description: string }
		>({
			query: (body) => ({
				url: "/region-applications",
				method: "POST",
				body,
			}),
			invalidatesTags: ["Region"],
		}),

		processApplication: builder.mutation<
			void,
			{
				applicationId: number;
				status: "PENDING" | "APPROVED" | "REJECTED";
				responseMessage: string;
			}
		>({
			query: ({ applicationId, ...body }) => ({
				url: `/region-applications/${applicationId}/process`,
				method: "PUT",
				body,
			}),
			invalidatesTags: ["Region"],
		}),
	}),
});

export const {
	useGetMyApplicationsQuery,
	useGetRegionApplicationsQuery,
	useGetApplicationByIdQuery,
	useCreateApplicationMutation,
	useProcessApplicationMutation,
} = regionApplicationApi;
