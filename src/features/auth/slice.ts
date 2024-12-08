import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../../store/types";

const authSlice = createSlice({
	name: "auth",
	initialState: {
		user: JSON.parse(localStorage.getItem("user") || "null"),
		token: localStorage.getItem("token"),
		isAuthenticated: !!localStorage.getItem("token"),
	},
	reducers: {
		setCredentials: (state, action) => {
			state.user = action.payload.user;
			state.token = action.payload.token;
			state.isAuthenticated = true;
			localStorage.setItem("token", action.payload.token);
			localStorage.setItem("user", JSON.stringify(action.payload.user));
		},
		logout: (state) => {
			state.user = null;
			state.token = null;
			state.isAuthenticated = false;
			localStorage.removeItem("token");
			localStorage.removeItem("user");
		},
	},
});
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) =>
	state.auth.isAuthenticated;
export const selectToken = (state: RootState) => state.auth.token;

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
