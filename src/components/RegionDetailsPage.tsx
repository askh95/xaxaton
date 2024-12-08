import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
	Box,
	Paper,
	Typography,
	Button,
	Grid,
	CircularProgress,
	Alert,
	Snackbar,
} from "@mui/material";
import { ArrowBack, Edit } from "@mui/icons-material";
import {
	useGetRegionQuery,
	useUpdateRegionMutation,
} from "../features/regions/api";
import { RegionForm } from "../components/RegionForm";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { format } from "date-fns";
import { UpdateRegionRequest } from "../features/regions/types";

export const RegionDetailsPage = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [isEditMode, setIsEditMode] = React.useState(false);
	const [successMessage, setSuccessMessage] = React.useState<string | null>(
		null
	);
	const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

	const userRole = useSelector(
		(state: RootState) => state.auth.user?.role?.name ?? "USER"
	);

	const { data: region, isLoading, refetch } = useGetRegionQuery(Number(id));
	const [updateRegion] = useUpdateRegionMutation();

	const handleUpdate = async (formData: UpdateRegionRequest) => {
		try {
			await updateRegion({
				id: Number(id),
				data: formData,
			}).unwrap();
			await refetch();
			setSuccessMessage("Регион успешно обновлен");
			setIsEditMode(false);
		} catch (error) {
			setErrorMessage("Ошибка при обновлении региона");
			console.error("Error:", error);
		}
	};

	if (isLoading) {
		return (
			<Box
				display="flex"
				justifyContent="center"
				alignItems="center"
				minHeight="400px"
			>
				<CircularProgress />
			</Box>
		);
	}

	if (!region) {
		return (
			<Box p={3}>
				<Alert severity="error">Регион не найден</Alert>
			</Box>
		);
	}

	return (
		<Box p={3}>
			<Box display="flex" alignItems="center" gap={2} mb={3}>
				<Button
					startIcon={<ArrowBack />}
					onClick={() => navigate("/regions")}
					variant="outlined"
				>
					Назад
				</Button>
				<Typography variant="h4" flex={1}>
					Информация о регионе
				</Typography>
				{(userRole === "FSP_ADMIN" || userRole === "REGION_ADMIN") && (
					<Button
						startIcon={<Edit />}
						onClick={() => setIsEditMode(true)}
						variant="contained"
					>
						Редактировать
					</Button>
				)}
			</Box>

			<Paper sx={{ p: 3 }}>
				<Grid container spacing={3}>
					<Grid item xs={12} md={6}>
						<Typography variant="subtitle2" color="text.secondary">
							Название
						</Typography>
						<Typography variant="body1" mb={2}>
							{region.name}
						</Typography>

						<Typography variant="subtitle2" color="text.secondary">
							Описание
						</Typography>
						<Typography variant="body1" mb={2}>
							{region.description || "Нет описания"}
						</Typography>

						<Typography variant="subtitle2" color="text.secondary">
							Контактный email
						</Typography>
						<Typography variant="body1" mb={2}>
							{region.contactEmail}
						</Typography>
					</Grid>

					<Grid item xs={12} md={6}>
						<Typography variant="subtitle2" color="text.secondary">
							Администратор
						</Typography>
						<Typography variant="body1" mb={2}>
							{`${region.user?.lastname || "Нет администратора"} ${
								region.user?.firstname || ""
							} ${region.user?.patronymic || ""}`}
						</Typography>

						<Typography variant="subtitle2" color="text.secondary">
							Дата создания
						</Typography>
						<Typography variant="body1">
							{format(new Date(region.createdAt), "dd.MM.yyyy HH:mm")}
						</Typography>
					</Grid>
				</Grid>
			</Paper>

			{isEditMode && (
				<RegionForm
					open={isEditMode}
					onClose={() => setIsEditMode(false)}
					initialData={region}
					onSubmit={handleUpdate}
				/>
			)}

			<Snackbar
				open={!!successMessage}
				autoHideDuration={6000}
				onClose={() => setSuccessMessage(null)}
			>
				<Alert severity="success" onClose={() => setSuccessMessage(null)}>
					{successMessage}
				</Alert>
			</Snackbar>

			<Snackbar
				open={!!errorMessage}
				autoHideDuration={6000}
				onClose={() => setErrorMessage(null)}
			>
				<Alert severity="error" onClose={() => setErrorMessage(null)}>
					{errorMessage}
				</Alert>
			</Snackbar>
		</Box>
	);
};
