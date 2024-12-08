import { baseApi } from "../baseApi";
import { Discipline } from "./types";

export const disciplinesApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		getDisciplines: builder.query<Discipline[], void>({
			query: () => "/disciplines",
		}),
	}),
});

export const { useGetDisciplinesQuery } = disciplinesApi;
