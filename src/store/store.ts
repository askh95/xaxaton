import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { baseApi } from "../features/baseApi";
import authReducer from "../features/auth/slice";
import eventsReducer from "../features/events/slice";
import teamsReducer from "../features/teams/slice";
import notificationsReducer from "../features/notifications/slice";
import protocolsReducer from "../features/protocols/slice";
import { formDataBaseApi } from "../features/formDataBaseApi";

export const store = configureStore({
	reducer: {
		[baseApi.reducerPath]: baseApi.reducer,
		[formDataBaseApi.reducerPath]: formDataBaseApi.reducer,
		auth: authReducer,
		events: eventsReducer,
		teams: teamsReducer,
		notifications: notificationsReducer,
		protocols: protocolsReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(
			baseApi.middleware,
			formDataBaseApi.middleware
		),
	devTools: import.meta.env.DEV,
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
