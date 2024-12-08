import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store/store";

interface TeamsState {
	selectedTeamId: number | null;
	isCreateModalOpen: boolean;
	isEditModalOpen: boolean;
	isManageMembersModalOpen: boolean;
}

const initialState: TeamsState = {
	selectedTeamId: null,
	isCreateModalOpen: false,
	isEditModalOpen: false,
	isManageMembersModalOpen: false,
};

export const teamsSlice = createSlice({
	name: "teams",
	initialState,
	reducers: {
		setSelectedTeamId: (state, action: PayloadAction<number | null>) => {
			state.selectedTeamId = action.payload;
		},
		setCreateModalOpen: (state, action: PayloadAction<boolean>) => {
			state.isCreateModalOpen = action.payload;
		},
		setEditModalOpen: (state, action: PayloadAction<boolean>) => {
			state.isEditModalOpen = action.payload;
		},
		setManageMembersModalOpen: (state, action: PayloadAction<boolean>) => {
			state.isManageMembersModalOpen = action.payload;
		},
	},
});

export const {
	setSelectedTeamId,
	setCreateModalOpen,
	setEditModalOpen,
	setManageMembersModalOpen,
} = teamsSlice.actions;

export const selectSelectedTeamId = (state: RootState) =>
	state.teams.selectedTeamId;
export const selectIsCreateModalOpen = (state: RootState) =>
	state.teams.isCreateModalOpen;
export const selectIsEditModalOpen = (state: RootState) =>
	state.teams.isEditModalOpen;
export const selectIsManageMembersModalOpen = (state: RootState) =>
	state.teams.isManageMembersModalOpen;

export default teamsSlice.reducer;
