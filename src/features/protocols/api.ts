import { baseApi } from "../baseApi";

export const protocolsApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		getProtocol: builder.query<
			string,
			{ eventBaseId: number; regionId: number }
		>({
			query: ({ eventBaseId, regionId }) => ({
				url: `/event-protocols/${eventBaseId}/region/${regionId}`,
				method: "GET",
			}),
		}),

		uploadProtocol: builder.mutation<
			void,
			{ eventBaseId: number; regionId: number; file: File }
		>({
			query: ({ eventBaseId, regionId, file }) => {
				const bodyFormData = new FormData();
				bodyFormData.append("file", file);

				return {
					url: `/event-protocols/${eventBaseId}/region/${regionId}/upload`,
					method: "POST",
					body: bodyFormData,
				};
			},
		}),

		deleteProtocol: builder.mutation<
			void,
			{ eventBaseId: number; regionId: number }
		>({
			query: ({ eventBaseId, regionId }) => ({
				url: `/event-protocols/${eventBaseId}/region/${regionId}`,
				method: "DELETE",
			}),
		}),
	}),
});

export const {
	useGetProtocolQuery,
	useUploadProtocolMutation,
	useDeleteProtocolMutation,
} = protocolsApi;
