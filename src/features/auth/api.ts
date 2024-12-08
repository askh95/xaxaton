import { baseApi } from "../baseApi";
import type {
	LoginRequest,
	RegisterRequest,
	AuthResponse,
	User,
	UserMe,
	UpdateUserRequest,
	ResetPasswordRequest,
	ResetPasswordVerifyRequest,
	UserResponse,
	PaginatedResponse,
	UsersParams,
} from "./types";

export const authApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		getUsers: builder.query<PaginatedResponse<UserResponse>, UsersParams>({
			query: (params) => ({
				url: "/users",
				params: {
					page: params.page ?? 0,
					size: params.size ?? 30,
					direction: params.direction ?? "desc",
					includeOnlyRole: "USER",
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
			providesTags: ["User"],
		}),
		login: builder.mutation<AuthResponse, LoginRequest>({
			query: (credentials) => ({
				url: "/auth/login",
				method: "POST",
				body: credentials,
			}),
		}),
		register: builder.mutation<AuthResponse, RegisterRequest>({
			query: (data) => ({
				url: "/auth/register",
				method: "POST",
				body: data,
			}),
		}),
		updateUser: builder.mutation<User, UpdateUserRequest>({
			query: ({ id, ...data }) => ({
				url: `/users/${id}`,
				method: "PUT",
				body: data,
			}),
			invalidatesTags: ["User"],
		}),
		getMe: builder.query<UserMe, void>({
			query: () => ({
				url: "/users/me",
				method: "GET",
			}),
			providesTags: ["User"],
		}),
		verifyEmail: builder.mutation<void, string>({
			query: (token) => ({
				url: `/email/verify`,
				method: "POST",
				params: { token },
			}),
		}),

		resetPassword: builder.mutation<void, ResetPasswordRequest>({
			query: (data) => ({
				url: "/email/reset-password",
				method: "POST",
				body: data,
			}),
		}),
		verifyResetPassword: builder.mutation<void, ResetPasswordVerifyRequest>({
			query: (data) => ({
				url: "/email/reset-password/verify",
				method: "POST",
				body: data,
			}),
		}),
		resendEmail: builder.mutation<void, { email: string }>({
			query: (data) => ({
				url: "/email/resend",
				method: "POST",
				body: data,
			}),
		}),
	}),
});

export const {
	useLoginMutation,
	useRegisterMutation,
	useUpdateUserMutation,
	useGetMeQuery,
	useVerifyEmailMutation,
	useResetPasswordMutation,
	useVerifyResetPasswordMutation,
	useResendEmailMutation,
	useGetUsersQuery,
} = authApi;
