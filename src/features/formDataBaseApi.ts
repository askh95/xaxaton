import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const formDataBaseApi = createApi({
	reducerPath: "formDataApi",
	baseQuery: fetchBaseQuery({
		baseUrl: "http://213.171.12.10:8080/api",
		prepareHeaders: (headers) => {
			const token = localStorage.getItem("token");
			console.log("Current token:", token);
			if (token) {
				headers.set("Authorization", `Bearer ${token}`);
			}
			console.log("Final headers:", Object.fromEntries(headers.entries()));
			return headers;
		},
		credentials: "omit",
	}),
	tagTypes: ["Protocol"],
	endpoints: () => ({}),
});
