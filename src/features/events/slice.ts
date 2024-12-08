import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EventRequest } from "./types";

interface EventsState {
	selectedEvent: EventRequest | null;
	filters: {
		status: string | null;
		regionId: number | null;
	};
}

const initialState: EventsState = {
	selectedEvent: null,
	filters: {
		status: null,
		regionId: null,
	},
};

export const eventsSlice = createSlice({
	name: "events",
	initialState,
	reducers: {
		setSelectedEvent: (state, action: PayloadAction<EventRequest | null>) => {
			state.selectedEvent = action.payload;
		},
		setStatusFilter: (state, action: PayloadAction<string | null>) => {
			state.filters.status = action.payload;
		},
		setRegionFilter: (state, action: PayloadAction<number | null>) => {
			state.filters.regionId = action.payload;
		},
		clearFilters: (state) => {
			state.filters = initialState.filters;
		},
	},
});

export const {
	setSelectedEvent,
	setStatusFilter,
	setRegionFilter,
	clearFilters,
} = eventsSlice.actions;

export default eventsSlice.reducer;
