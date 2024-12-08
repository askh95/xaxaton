import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RegionResponse } from "./types";

interface RegionsState {
	selectedRegion: RegionResponse | null;
}

const initialState: RegionsState = {
	selectedRegion: null,
};

export const regionsSlice = createSlice({
	name: "regions",
	initialState,
	reducers: {
		setSelectedRegion: (
			state,
			action: PayloadAction<RegionResponse | null>
		) => {
			state.selectedRegion = action.payload;
		},
	},
});

export const { setSelectedRegion } = regionsSlice.actions;
export default regionsSlice.reducer;
