import React, { useEffect, useRef, useState } from "react";
import {
	Box,
	CircularProgress,
	Typography,
	Alert,
	Container,
	Fade,
	Paper,
} from "@mui/material";
import { EventRequestCard } from "./EventRequestCard";
import { useCurrentUserRole } from "../features/auth/hooks";
import {
	useGetAllEventRequestsQuery,
	useGetMyEventRequestsQuery,
} from "../features/events/api";
import { EventRequestStatus } from "../features/events/types";

interface EventRequestListProps {
	canManage?: boolean;
	status: EventRequestStatus | null;
}

export const EventRequestList: React.FC<EventRequestListProps> = ({
	canManage = false,
	status,
}) => {
	const userRole = useCurrentUserRole();
	const [page, setPage] = useState(0);
	const loader = useRef<HTMLDivElement>(null);
	const [isIntersecting, setIsIntersecting] = useState(false);

	const params = {
		page,
		size: 10,
		direction: "desc" as const,
		status: status || undefined,
	};

	const query =
		userRole === "FSP_ADMIN"
			? useGetAllEventRequestsQuery(params)
			: useGetMyEventRequestsQuery(params);

	const { data: response, isLoading, error, isFetching } = query;

	useEffect(() => {
		setPage(0);
	}, [status]);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				setIsIntersecting(entries[0].isIntersecting);
			},
			{ threshold: 0.1, rootMargin: "100px" }
		);

		if (loader.current) {
			observer.observe(loader.current);
		}

		return () => {
			if (loader.current) {
				observer.unobserve(loader.current);
			}
		};
	}, []);

	useEffect(() => {
		if (
			isIntersecting &&
			!isLoading &&
			!isFetching &&
			response?.content.length &&
			!response.last
		) {
			setPage((prev) => prev + 1);
		}
	}, [isIntersecting, isLoading, isFetching, response]);

	if (error) {
		return (
			<Container maxWidth="md" sx={{ py: 4 }}>
				<Alert
					severity="error"
					variant="filled"
					sx={{
						borderRadius: 2,
						boxShadow: 2,
					}}
				>
					Произошла ошибка при загрузке заявок
				</Alert>
			</Container>
		);
	}

	if (!response?.content?.length && !isLoading) {
		return (
			<Paper
				elevation={0}
				sx={{
					py: 8,
					px: 3,
					textAlign: "center",
					backgroundColor: "transparent",
				}}
			>
				<Typography
					variant="h6"
					color="text.secondary"
					gutterBottom
					sx={{ fontWeight: 500 }}
				>
					Заявок пока нет
				</Typography>
				<Typography variant="body2" color="text.secondary">
					Здесь появятся новые заявки
				</Typography>
			</Paper>
		);
	}

	return (
		<Container maxWidth="md" sx={{ py: 3 }}>
			<Box sx={{ position: "relative" }}>
				{response?.content.map((request, index) => (
					<Fade key={request.id} in={true} timeout={300 + index * 100}>
						<div>
							<EventRequestCard request={request} canManage={canManage} />
						</div>
					</Fade>
				))}

				{(isLoading || isFetching) && (
					<Box display="flex" justifyContent="center" p={4}>
						<CircularProgress />
					</Box>
				)}

				<div ref={loader} style={{ height: 20 }} />
			</Box>
		</Container>
	);
};
