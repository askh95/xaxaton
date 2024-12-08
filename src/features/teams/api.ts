import { baseApi } from "../baseApi";
import {
	Team,
	CreateTeamRequest,
	UpdateTeamRequest,
	PaginatedResponse,
} from "./types";

export const teamApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		getTeams: builder.query<PaginatedResponse<Team>, void>({
			query: () => "/teams",
			providesTags: (result) =>
				result
					? [
							...result.content.map(({ id }) => ({
								type: "Team" as const,
								id,
							})),
							{ type: "Team" as const, id: "LIST" },
					  ]
					: [{ type: "Team" as const, id: "LIST" }],
		}),

		getTeam: builder.query<Team, number>({
			query: (id) => `/teams/${id}`,
			providesTags: (_, __, id) => [{ type: "Team" as const, id }],
		}),

		createTeam: builder.mutation<Team, CreateTeamRequest>({
			query: (data) => ({
				url: "/teams",
				method: "POST",
				body: data,
			}),
			invalidatesTags: [{ type: "Team", id: "LIST" }],
		}),

		updateTeam: builder.mutation<Team, { id: number; data: UpdateTeamRequest }>(
			{
				query: ({ id, data }) => ({
					url: `/teams/${id}`,
					method: "PUT",
					body: data,
				}),
				invalidatesTags: (_, __, { id }) => [
					{ type: "Team", id },
					{ type: "Team", id: "LIST" },
				],
			}
		),

		addTeamMember: builder.mutation<void, { teamId: number; userId: number }>({
			query: ({ teamId, userId }) => ({
				url: `/teams/${teamId}/members`,
				method: "POST",
				body: { userId },
			}),
			invalidatesTags: (_, __, { teamId }) => [
				{ type: "Team", id: teamId },
				{ type: "Team", id: "LIST" },
			],
		}),

		removeTeamMember: builder.mutation<
			void,
			{ teamId: number; userId: number }
		>({
			query: ({ teamId, userId }) => ({
				url: `/teams/${teamId}/members/${userId}`,
				method: "DELETE",
			}),
			invalidatesTags: (_, __, { teamId }) => [
				{ type: "Team", id: teamId },
				{ type: "Team", id: "LIST" },
			],
		}),
	}),
});

export const {
	useGetTeamsQuery,
	useGetTeamQuery,
	useCreateTeamMutation,
	useUpdateTeamMutation,
	useAddTeamMemberMutation,
	useRemoveTeamMemberMutation,
} = teamApi;
