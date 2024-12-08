import { useState } from "react";
import {
	Box,
	Button,
	Typography,
	CircularProgress,
	Pagination,
	Alert,
	Snackbar,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { RegionList } from "../components/RegionList";
import { RegionForm } from "../components/RegionForm";
import {
	useGetRegionsQuery,
	useCreateRegionMutation,
	useDeleteRegionMutation,
} from "../features/regions/api";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import {
	CreateRegionRequest,
	UpdateRegionRequest,
} from "../features/regions/types";

export const RegionsPage = () => {
	const [page, setPage] = useState(0);
	const [formOpen, setFormOpen] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);

	const userRole = useSelector(
		(state: RootState) => state.auth.user?.role?.name ?? "USER"
	);

	const { data, isLoading, refetch } = useGetRegionsQuery({
		page,
		size: 10,
	});

	const [createRegion] = useCreateRegionMutation();
	const [deleteRegion] = useDeleteRegionMutation();

	const handleCreate = async (
		data: CreateRegionRequest | Omit<UpdateRegionRequest, "id">
	) => {
		try {
			await createRegion(data as CreateRegionRequest).unwrap();
			setSuccessMessage("Регион успешно создан");
			setFormOpen(false);
			refetch();
		} catch (error) {
			setErrorMessage("Ошибка при создании региона");
			console.error("Error:", error);
		}
	};

	const handleDelete = async (id: number) => {
		if (window.confirm("Вы уверены, что хотите удалить этот регион?")) {
			try {
				await deleteRegion(id).unwrap();
				setSuccessMessage("Регион успешно удален");
				refetch();
			} catch (error) {
				setErrorMessage("Ошибка при удалении региона");
				console.error("Error:", error);
			}
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

	return (
		<Box p={3}>
			<Box
				display="flex"
				justifyContent="space-between"
				alignItems="center"
				mb={3}
			>
				<Typography variant="h4">Регионы</Typography>
				{userRole === "FSP_ADMIN" && (
					<Button
						variant="contained"
						color="primary"
						startIcon={<Add />}
						onClick={() => setFormOpen(true)}
					>
						Создать регион
					</Button>
				)}
			</Box>

			{data && (
				<>
					<RegionList
						regions={data.content}
						onDelete={userRole === "FSP_ADMIN" ? handleDelete : undefined}
						userRole={userRole}
					/>

					<Box display="flex" justifyContent="center" mt={3}>
						<Pagination
							count={data.totalPages}
							page={page + 1}
							onChange={(_, newPage) => setPage(newPage - 1)}
						/>
					</Box>
				</>
			)}

			<RegionForm
				open={formOpen}
				onClose={() => setFormOpen(false)}
				onSubmit={handleCreate}
			/>

			<Snackbar
				open={!!errorMessage}
				autoHideDuration={6000}
				onClose={() => setErrorMessage(null)}
			>
				<Alert severity="error" onClose={() => setErrorMessage(null)}>
					{errorMessage}
				</Alert>
			</Snackbar>

			<Snackbar
				open={!!successMessage}
				autoHideDuration={6000}
				onClose={() => setSuccessMessage(null)}
			>
				<Alert severity="success" onClose={() => setSuccessMessage(null)}>
					{successMessage}
				</Alert>
			</Snackbar>
		</Box>
	);
};
