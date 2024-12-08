import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ProtocolsState {
	selectedEventBaseId: number | null;
	selectedRegionId: number | null;
}

const initialState: ProtocolsState = {
	selectedEventBaseId: null,
	selectedRegionId: null,
};

export const protocolsSlice = createSlice({
	name: "protocols",
	initialState,
	reducers: {
		setSelectedProtocol(
			state,
			action: PayloadAction<{ eventBaseId: number; regionId: number }>
		) {
			state.selectedEventBaseId = action.payload.eventBaseId;
			state.selectedRegionId = action.payload.regionId;
		},
		clearSelectedProtocol(state) {
			state.selectedEventBaseId = null;
			state.selectedRegionId = null;
		},
	},
});

export const { setSelectedProtocol, clearSelectedProtocol } =
	protocolsSlice.actions;
export default protocolsSlice.reducer;
