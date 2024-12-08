import React from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	List,
	ListItem,
	ListItemText,
	ListItemSecondaryAction,
	IconButton,
	Box,
	Typography,
	Autocomplete,
	TextField,
} from "@mui/material";
import { Delete, PersonAdd } from "@mui/icons-material";
import {
	useGetTeamQuery,
	useAddTeamMemberMutation,
	useRemoveTeamMemberMutation,
} from "../features/teams/api";
import { useGetUsersQuery } from "../features/auth/api";
import { debounce } from "lodash";
import { useCurrentUserRole } from "../features/auth/hooks";

interface ManageMembersModalProps {
	open: boolean;
	onClose: () => void;
	teamId: number;
}

interface UserOption {
	id: number;
	fullName: string;
	email: string;
	role: string;
}

export const ManageMembersModal: React.FC<ManageMembersModalProps> = ({
	open,
	onClose,
	teamId,
}) => {
	const [search, setSearch] = React.useState("");
	const [selectedUser, setSelectedUser] = React.useState<UserOption | null>(
		null
	);

	const userRole = useCurrentUserRole();

	const { data: team } = useGetTeamQuery(teamId, { skip: !open });
	const [addMember] = useAddTeamMemberMutation();
	const [removeMember] = useRemoveTeamMemberMutation();

	const { data: users } = useGetUsersQuery(
		{
			page: 0,
			size: 10,
			search,
			includeOnlyRole: "USER",
		},
		{ skip: !search }
	);

	const userOptions: UserOption[] = React.useMemo(() => {
		if (!users?.content) return [];
		return users.content.map((user) => ({
			id: user.id,
			fullName: `${user.lastname} ${user.firstname} ${user.patronymic}`,
			email: user.email,
			role: user.role.name,
		}));
	}, [users?.content]);

	const debouncedSetSearch = React.useMemo(
		() => debounce((value: string) => setSearch(value), 300),
		[]
	);

	const handleAddMember = async (e: React.FormEvent) => {
		e.preventDefault();
		if (selectedUser) {
			try {
				await addMember({
					teamId,
					userId: selectedUser.id,
				});
				setSelectedUser(null);
			} catch (error) {
				console.error("Error adding member:", error);
			}
		}
	};

	const handleRemoveMember = async (memberId: number) => {
		try {
			await removeMember({ teamId, userId: memberId });
		} catch (error) {
			console.error("Error removing member:", error);
		}
	};

	return (
		<Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
			<DialogTitle>"{team?.name}"</DialogTitle>
			<DialogContent>
				<Box component="form" onSubmit={handleAddMember} sx={{ mb: 3 }}>
					{userRole === "REGION_ADMIN" && (
						<Box
							sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2 }}
						>
							<Autocomplete
								options={userOptions}
								value={selectedUser}
								onChange={(_, newValue) => setSelectedUser(newValue)}
								onInputChange={(_, value) => debouncedSetSearch(value)}
								getOptionLabel={(option) => option.fullName}
								isOptionEqualToValue={(option, value) => option.id === value.id}
								renderInput={(params) => (
									<TextField
										{...params}
										label="Поиск пользователя"
										placeholder="Введите ФИО пользователя"
										fullWidth
									/>
								)}
								renderOption={(props, option) => (
									<li {...props}>
										<Box>
											<Typography variant="body1">{option.fullName}</Typography>
											<Typography variant="body2" color="text.secondary">
												{option.email}
											</Typography>
										</Box>
									</li>
								)}
								loading={!!search && !users}
								loadingText="Поиск..."
								noOptionsText="Пользователи не найдены"
							/>

							<Button
								type="submit"
								variant="contained"
								startIcon={<PersonAdd />}
								disabled={!selectedUser}
								fullWidth
							>
								Добавить
							</Button>
						</Box>
					)}
				</Box>

				<Typography variant="h6" sx={{ mb: 2 }}>
					Участники команды ({team?.members?.length || 0})
				</Typography>

				{team?.members?.length === 0 ? (
					<Typography
						color="text.secondary"
						sx={{ textAlign: "center", py: 2 }}
					>
						В команде пока нет участников
					</Typography>
				) : (
					<List>
						{team?.members?.map((member) => (
							<ListItem
								key={member.id}
								sx={{
									bgcolor: "background.paper",
									mb: 1,
									borderRadius: 1,
								}}
							>
								<ListItemText
									primary={
										<Typography variant="subtitle1">
											{member.firstname} {member.lastname} {member.patronymic}
										</Typography>
									}
									secondary={
										<>
											<Typography variant="body2" component="span">
												{member.email}
											</Typography>
											<br />

											{member.region && (
												<Typography
													variant="body2"
													component="span"
													color="text.secondary"
													sx={{ ml: 1 }}
												>
													• {member.region.name}
												</Typography>
											)}
										</>
									}
								/>
								{userRole === "REGION_ADMIN" && (
									<ListItemSecondaryAction>
										<IconButton
											edge="end"
											color="error"
											onClick={() => handleRemoveMember(member.id)}
											title="Удалить участника"
										>
											<Delete />
										</IconButton>
									</ListItemSecondaryAction>
								)}
							</ListItem>
						))}
					</List>
				)}
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Закрыть</Button>
			</DialogActions>
		</Dialog>
	);
};
