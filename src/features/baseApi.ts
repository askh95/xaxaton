import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
	reducerPath: "api",
	baseQuery: fetchBaseQuery({
		baseUrl: "http://213.171.12.10:8080/api",
		prepareHeaders: (headers) => {
			const token = localStorage.getItem("token");
			console.log("Current token:", token);
			if (token) {
				headers.set("Authorization", `Bearer ${token}`);
			}
			headers.set("Content-Type", "application/json");
			console.log("Final headers:", Object.fromEntries(headers.entries()));
			return headers;
		},
		credentials: "omit",
	}),
	tagTypes: ["User", "Event", "Region", "Notification", "Team"],
	endpoints: () => ({}),
});
