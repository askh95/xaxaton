import React, { useState } from "react";
import {
	Card,
	CardContent,
	Typography,
	Chip,
	Button,
	Box,
	Stack,
	IconButton,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	Divider,
	Tooltip,
	useTheme,
	alpha,
	Zoom,
} from "@mui/material";
import {
	ThumbUp,
	ThumbDown,
	Place,
	CalendarMonth,
	Person,
	EmojiEvents,
	LocationCity,
	Email,
	Comment,
} from "@mui/icons-material";
import { EventRequest } from "../features/events/types";
import { format } from "date-fns";
import {
	useApproveEventRequestMutation,
	useRejectEventRequestMutation,
} from "../features/events/api";
import { useCurrentUserRole } from "../features/auth/hooks";
import { ProtocolCard } from "./ProtocolCard";

interface EventRequestCardProps {
	request: EventRequest;
	canManage?: boolean;
}

export const EventRequestCard: React.FC<EventRequestCardProps> = ({
	request,
	canManage = false,
}) => {
	const theme = useTheme();
	const userRole = useCurrentUserRole();
	const [approveRequest] = useApproveEventRequestMutation();
	const [rejectRequest] = useRejectEventRequestMutation();
	const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
	const [rejectComment, setRejectComment] = useState("");

	const handleApprove = async () => {
		try {
			await approveRequest(request.id);
		} catch (error) {
			console.error("Failed to approve request:", error);
		}
	};

	const handleReject = async () => {
		try {
			await rejectRequest({ id: request.id, comment: rejectComment });
			setRejectDialogOpen(false);
			setRejectComment("");
		} catch (error) {
			console.error("Failed to reject request:", error);
		}
	};

	const canManageRequest = canManage && userRole === "FSP_ADMIN";
	const shouldShowStatus =
		userRole === "REGION_ADMIN" || userRole === "FSP_ADMIN";

	const formatDateTime = (dateString: string) => {
		try {
			return format(new Date(dateString), "dd.MM.yyyy HH:mm");
		} catch (error) {
			return dateString;
		}
	};

	const getGenderLabel = (gender: string) => {
		switch (gender) {
			case "MALE":
				return "Мужской";
			case "FEMALE":
				return "Женский";
			default:
				return "Любой";
		}
	};

	const getStatusStyles = (status: EventRequest["status"]) => {
		switch (status) {
			case "APPROVED":
				return {
					bgcolor: alpha(theme.palette.success.main, 0.1),
					color: theme.palette.success.main,
					borderColor: theme.palette.success.main,
					icon: "✓",
					label: "Одобрено",
				};
			case "REJECTED":
				return {
					bgcolor: alpha(theme.palette.error.main, 0.1),
					color: theme.palette.error.main,
					borderColor: theme.palette.error.main,
					icon: "×",
					label: "Отклонено",
				};
			default:
				return {
					bgcolor: alpha(theme.palette.warning.main, 0.1),
					color: theme.palette.warning.main,
					borderColor: theme.palette.warning.main,
					icon: "⋯",
					label: "На рассмотрении",
				};
		}
	};

	return (
		<Card
			sx={{
				mb: 2,
				borderRadius: 2,
				boxShadow: theme.shadows[2],
				transition: "all 0.2s ease-in-out",
				"&:hover": {
					transform: "translateY(-2px)",
					boxShadow: theme.shadows[4],
				},
				border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
			}}
		>
			<CardContent>
				<Stack spacing={2}>
					{/* Header and Status */}
					<Box
						display="flex"
						justifyContent="space-between"
						alignItems="center"
					>
						<Typography
							variant="h6"
							component="h2"
							sx={{
								fontWeight: 600,
								color: theme.palette.text.primary,
							}}
						>
							{request.name}
						</Typography>

						{shouldShowStatus && (
							<Stack direction="row" spacing={1} alignItems="center">
								{request.moderationComment && (
									<Tooltip title={request.moderationComment}>
										<Comment
											sx={{
												color: theme.palette.text.secondary,
												cursor: "help",
											}}
										/>
									</Tooltip>
								)}
								{shouldShowStatus && (
									<Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
										<Chip
											label={getStatusStyles(request.status).label}
											size="small"
											sx={{
												fontWeight: 600,
												bgcolor: getStatusStyles(request.status).bgcolor,
												color: getStatusStyles(request.status).color,
												border: `1px solid ${
													getStatusStyles(request.status).borderColor
												}`,
												"& .MuiChip-label": {
													px: 1,
												},
											}}
											icon={
												<Typography
													component="span"
													sx={{
														fontSize: "1.2rem",
														color: getStatusStyles(request.status).color,
														pl: 1,
													}}
												>
													{getStatusStyles(request.status).icon}
												</Typography>
											}
										/>
									</Box>
								)}
							</Stack>
						)}
					</Box>

					<Divider />

					<Stack spacing={2}>
						<InfoRow
							icon={
								<CalendarMonth sx={{ color: theme.palette.primary.main }} />
							}
							text={`${formatDateTime(request.startDate)} - ${formatDateTime(
								request.endDate
							)}`}
						/>

						<InfoRow
							icon={<Place sx={{ color: theme.palette.secondary.main }} />}
							text={request.location}
						/>

						<InfoRow
							icon={<Person sx={{ color: theme.palette.info.main }} />}
							text={`${getGenderLabel(request.gender)} | ${request.minAge}-${
								request.maxAge
							} лет | До ${request.maxParticipants} участников`}
						/>

						<Box display="flex" alignItems="flex-start" gap={1}>
							<EmojiEvents
								sx={{
									mt: 0.5,
									color: theme.palette.warning.main,
								}}
							/>
							<Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
								{request.disciplines.map((discipline) => (
									<Chip
										key={discipline.id}
										label={discipline.name}
										size="small"
										variant="outlined"
										sx={{
											borderColor: alpha(theme.palette.primary.main, 0.3),
											bgcolor: alpha(theme.palette.primary.main, 0.05),
										}}
									/>
								))}
							</Stack>
						</Box>

						{request.region && (
							<>
								<InfoRow
									icon={
										<LocationCity sx={{ color: theme.palette.error.main }} />
									}
									text={request.region.name}
								/>
								<InfoRow
									icon={<Email sx={{ color: theme.palette.success.main }} />}
									text={request.region.contactEmail}
								/>
							</>
						)}
					</Stack>

					{new Date() > new Date(request.endDate) && (
						<Box
							sx={{
								mt: 2,
								pt: 2,
								borderTop: `1px solid ${theme.palette.divider}`,
							}}
						>
							<ProtocolCard
								eventBaseId={request.id}
								regionId={request.region?.id}
								canManage={canManageRequest}
							/>
						</Box>
					)}

					{canManageRequest && request.status === "PENDING" && (
						<Box
							display="flex"
							justifyContent="flex-end"
							gap={1}
							sx={{ mt: 2 }}
						>
							<Tooltip title="Одобрить">
								<Zoom in={true}>
									<IconButton
										onClick={handleApprove}
										sx={{
											color: theme.palette.success.main,
											"&:hover": {
												bgcolor: alpha(theme.palette.success.main, 0.1),
											},
										}}
									>
										<ThumbUp />
									</IconButton>
								</Zoom>
							</Tooltip>
							<Tooltip title="Отклонить">
								<Zoom in={true}>
									<IconButton
										onClick={() => setRejectDialogOpen(true)}
										sx={{
											color: theme.palette.error.main,
											"&:hover": {
												bgcolor: alpha(theme.palette.error.main, 0.1),
											},
										}}
									>
										<ThumbDown />
									</IconButton>
								</Zoom>
							</Tooltip>
						</Box>
					)}
				</Stack>
			</CardContent>

			<Dialog
				open={rejectDialogOpen}
				onClose={() => setRejectDialogOpen(false)}
				maxWidth="sm"
				fullWidth
			>
				<DialogTitle>Отклонение заявки</DialogTitle>
				<DialogContent>
					<TextField
						fullWidth
						multiline
						rows={4}
						label="Причина отклонения"
						value={rejectComment}
						onChange={(e) => setRejectComment(e.target.value)}
						margin="normal"
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setRejectDialogOpen(false)} color="inherit">
						Отмена
					</Button>
					<Button onClick={handleReject} color="error" variant="contained">
						Отклонить
					</Button>
				</DialogActions>
			</Dialog>
		</Card>
	);
};

const InfoRow: React.FC<{
	icon: React.ReactNode;
	text: string;
}> = ({ icon, text }) => (
	<Box display="flex" alignItems="center" gap={1}>
		{icon}
		<Typography variant="body2">{text}</Typography>
	</Box>
);
