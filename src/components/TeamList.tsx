// src/components/teams/TeamList.tsx
import React from "react";
import {
	List,
	ListItem,
	ListItemText,
	ListItemSecondaryAction,
	IconButton,
	Paper,
	Typography,
} from "@mui/material";
import { Edit, Group, Delete } from "@mui/icons-material";
import { Team } from "../features/teams/types";
import { useAppDispatch } from "../store/hooks";
import {
	setSelectedTeamId,
	setEditModalOpen,
	setManageMembersModalOpen,
} from "../features/teams/slice";

interface TeamListProps {
	teams: Team[];
	onDelete?: (teamId: number) => void;
}

export const TeamList: React.FC<TeamListProps> = ({ teams, onDelete }) => {
	const dispatch = useAppDispatch();

	const handleEditClick = (team: Team) => {
		dispatch(setSelectedTeamId(team.id));
		dispatch(setEditModalOpen(true));
	};

	const handleManageMembersClick = (team: Team) => {
		dispatch(setSelectedTeamId(team.id));
		dispatch(setManageMembersModalOpen(true));
	};

	if (!teams.length) {
		return (
			<Typography variant="body1" sx={{ textAlign: "center", mt: 4 }}>
				Команды не найдены
			</Typography>
		);
	}

	return (
		<List>
			{teams.map((team) => (
				<ListItem
					key={team.id}
					component={Paper}
					sx={{
						mb: 2,
						p: 2,
						transition: "all 0.2s",
						"&:hover": {
							transform: "translateY(-2px)",
							boxShadow: 2,
						},
					}}
				>
					<ListItemText
						primary={
							<Typography variant="h6" component="div">
								{team.name}
							</Typography>
						}
						secondary={
							<Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
								{team.description}
							</Typography>
						}
					/>

					<ListItemSecondaryAction>
						<IconButton
							onClick={() => handleEditClick(team)}
							color="primary"
							size="large"
						>
							<Edit />
						</IconButton>
						<IconButton
							onClick={() => handleManageMembersClick(team)}
							color="primary"
							size="large"
						>
							<Group />
						</IconButton>
						{onDelete && (
							<IconButton
								onClick={() => onDelete(team.id)}
								color="error"
								size="large"
							>
								<Delete />
							</IconButton>
						)}
					</ListItemSecondaryAction>
				</ListItem>
			))}
		</List>
	);
};
