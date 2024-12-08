import React from "react";
import {
	Container,
	Typography,
	Button,
	Box,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Stack,
	SelectChangeEvent,
} from "@mui/material";
import { useCurrentUserRole } from "../features/auth/hooks";
import { Add } from "@mui/icons-material";
import { Navigate, useSearchParams } from "react-router-dom";
import {
	EVENT_STATUS,
	EVENT_STATUS_LABELS,
} from "../features/events/constants";
import { EventRequestList } from "../components/EventRequestList";
import { EventRequestModal } from "../components/EventRequestModal";
import { EventRequestStatus } from "../features/events/types";

export const EventsPage: React.FC = () => {
	const [isModalOpen, setIsModalOpen] = React.useState(false);
	const userRole = useCurrentUserRole();
	const [searchParams, setSearchParams] = useSearchParams();

	const status = (searchParams.get("status") as EventRequestStatus | "") || "";

	if (userRole === "USER") {
		return <Navigate to="/" />;
	}

	const handleStatusChange = (event: SelectChangeEvent) => {
		const newStatus = event.target.value as EventRequestStatus | "";
		if (newStatus) {
			setSearchParams({ status: newStatus });
		} else {
			searchParams.delete("status");
			setSearchParams(searchParams);
		}
	};

	return (
		<Container maxWidth="md">
			<Box py={4}>
				<Stack spacing={3}>
					<Box
						display="flex"
						justifyContent="space-between"
						alignItems="center"
					>
						<Typography variant="h4" component="h1">
							Заявки на мероприятия
						</Typography>
						{userRole === "REGION_ADMIN" && (
							<Button
								variant="contained"
								startIcon={<Add />}
								onClick={() => setIsModalOpen(true)}
							>
								Создать заявку
							</Button>
						)}
					</Box>

					<Box>
						<FormControl size="small" sx={{ minWidth: 200 }}>
							<InputLabel>Статус</InputLabel>
							<Select
								value={status}
								label="Статус"
								onChange={handleStatusChange}
							>
								<MenuItem value="">Все</MenuItem>
								{Object.entries(EVENT_STATUS).map(([key, value]) => (
									<MenuItem key={key} value={value}>
										{EVENT_STATUS_LABELS[value]}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Box>

					<EventRequestList
						canManage={userRole === "FSP_ADMIN"}
						status={status || null}
					/>
				</Stack>

				<EventRequestModal
					open={isModalOpen}
					onClose={() => setIsModalOpen(false)}
				/>
			</Box>
		</Container>
	);
};
