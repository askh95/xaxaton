// src/pages/TeamsPage.tsx
import React from "react";
import {
	Box,
	Button,
	Typography,
	CircularProgress,
	Alert,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
	useGetTeamsQuery,
	useCreateTeamMutation,
	useUpdateTeamMutation,
} from "../features/teams/api";
import {
	setCreateModalOpen,
	setEditModalOpen,
	setManageMembersModalOpen,
	selectSelectedTeamId,
	selectIsCreateModalOpen,
	selectIsEditModalOpen,
	selectIsManageMembersModalOpen,
} from "../features/teams/slice";
import { TeamList } from "../components/TeamList";
import { TeamFormModal } from "../components/TeamFormModal";
import { ManageMembersModal } from "../components/ManageMembersModal";
import { CreateTeamRequest, UpdateTeamRequest } from "../features/teams/types";

import { useCurrentUserRole } from "../features/auth/hooks";

export const TeamsPage: React.FC = () => {
	const dispatch = useAppDispatch();

	const selectedTeamId = useAppSelector(selectSelectedTeamId);
	const isCreateModalOpen = useAppSelector(selectIsCreateModalOpen);
	const isEditModalOpen = useAppSelector(selectIsEditModalOpen);
	const isManageMembersModalOpen = useAppSelector(
		selectIsManageMembersModalOpen
	);

	const userRole = useCurrentUserRole();

	const { data, isLoading, error } = useGetTeamsQuery();

	const [createTeam, { isLoading: isCreating, error: createError }] =
		useCreateTeamMutation();

	const [updateTeam, { isLoading: isUpdating, error: updateError }] =
		useUpdateTeamMutation();

	const selectedTeam = React.useMemo(() => {
		if (!data?.content || !selectedTeamId) return undefined;
		return data.content.find((team) => team.id === selectedTeamId);
	}, [data?.content, selectedTeamId]);

	const handleCreateTeam = async (data: CreateTeamRequest) => {
		try {
			await createTeam(data).unwrap();
			dispatch(setCreateModalOpen(false));
		} catch (error) {
			console.error("Error creating team:", error);
		}
	};

	const handleUpdateTeam = async (data: UpdateTeamRequest) => {
		if (!selectedTeamId) return;
		try {
			await updateTeam({ id: selectedTeamId, data }).unwrap();
			dispatch(setEditModalOpen(false));
		} catch (error) {
			console.error("Error updating team:", error);
		}
	};

	const handleCloseModals = () => {
		dispatch(setCreateModalOpen(false));
		dispatch(setEditModalOpen(false));
		dispatch(setManageMembersModalOpen(false));
	};

	return (
		<Box sx={{ p: 3, maxWidth: 1200, mx: "auto" }}>
			{/* Header */}
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					mb: 4,
				}}
			>
				<Typography variant="h4" component="h1">
					Команды
				</Typography>
				{userRole === "REGION_ADMIN" && (
					<Button
						startIcon={<Add />}
						variant="contained"
						onClick={() => dispatch(setCreateModalOpen(true))}
						disabled={isCreating}
					>
						Создать команду
					</Button>
				)}
			</Box>

			{/* Error Handling */}
			{(error || createError || updateError) && (
				<Alert severity="error" sx={{ mb: 3 }}>
					Произошла ошибка при загрузке данных. Пожалуйста, попробуйте позже.
				</Alert>
			)}

			{/* Loading State */}
			{isLoading ? (
				<Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
					<CircularProgress />
				</Box>
			) : (
				/* Teams List */
				<TeamList teams={data?.content || []} />
			)}

			{/* Modals */}
			<TeamFormModal
				open={isCreateModalOpen}
				onClose={handleCloseModals}
				onSubmit={handleCreateTeam}
				mode="create"
				isLoading={isCreating}
			/>

			<TeamFormModal
				open={isEditModalOpen}
				onClose={handleCloseModals}
				onSubmit={handleUpdateTeam}
				mode="edit"
				initialData={
					selectedTeam
						? {
								name: selectedTeam.name,
								description: selectedTeam.description,
						  }
						: undefined
				}
				isLoading={isUpdating}
			/>

			{selectedTeamId && (
				<ManageMembersModal
					open={isManageMembersModalOpen}
					onClose={handleCloseModals}
					teamId={selectedTeamId}
				/>
			)}
		</Box>
	);
};
