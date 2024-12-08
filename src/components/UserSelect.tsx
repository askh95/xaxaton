import React, { useState, useCallback } from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	List,
	ListItem,
	ListItemText,
	TextField,
	Box,
	CircularProgress,
	Typography,
	IconButton,
} from "@mui/material";
import { Search, Close } from "@mui/icons-material";
import { useGetUsersQuery } from "../features/auth/api";
import { debounce } from "lodash";
import { UserResponse } from "../features/auth/types";
import { useInView } from "react-intersection-observer";

interface UserSelectProps {
	open: boolean;
	onClose: () => void;
	onSelect: (userId: number) => void;
	selectedUserId?: number;
}

export const UserSelect = ({
	open,
	onClose,
	onSelect,
	selectedUserId,
}: UserSelectProps) => {
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(0);
	const { ref, inView } = useInView();

	const { data, isLoading, isFetching } = useGetUsersQuery({
		page,
		size: 10,
		search,
	});

	React.useEffect(() => {
		if (inView && data && !data.last && !isFetching) {
			setPage((prev) => prev + 1);
		}
	}, [inView, data, isFetching]);

	const debouncedSearch = useCallback(
		debounce((value: string) => {
			setSearch(value);
			setPage(0);
		}, 300),
		[]
	);

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		debouncedSearch(event.target.value);
	};

	const handleSelect = (user: UserResponse) => {
		onSelect(user.id);
		onClose();
	};

	return (
		<Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
			<DialogTitle>
				<Box display="flex" alignItems="center" gap={2}>
					<Typography flex={1}>Выбрать пользователя</Typography>
					<IconButton onClick={onClose} size="small">
						<Close />
					</IconButton>
				</Box>
			</DialogTitle>

			<DialogContent>
				<TextField
					fullWidth
					placeholder="Поиск пользователей..."
					onChange={handleSearchChange}
					InputProps={{
						startAdornment: <Search color="action" sx={{ mr: 1 }} />,
					}}
					sx={{ mb: 2 }}
				/>

				<List sx={{ maxHeight: "400px", overflow: "auto" }}>
					{data?.content.map((user) => (
						<ListItem
							key={user.id}
							onClick={() => handleSelect(user)}
							sx={{
								cursor: "pointer",
								bgcolor:
									user.id === selectedUserId
										? "action.selected"
										: "transparent",
								"&:hover": {
									bgcolor: "action.hover",
								},
							}}
						>
							<ListItemText
								primary={`${user.lastname} ${user.firstname} ${user.patronymic}`}
								secondary={
									<>
										<Typography
											variant="body2"
											component="span"
											color="text.secondary"
										>
											Email: {user.email}
										</Typography>
										<br />
									</>
								}
							/>
						</ListItem>
					))}

					<div ref={ref} style={{ height: 20 }} />

					{(isLoading || isFetching) && (
						<Box display="flex" justifyContent="center" my={2}>
							<CircularProgress size={24} />
						</Box>
					)}
				</List>
			</DialogContent>
		</Dialog>
	);
};
