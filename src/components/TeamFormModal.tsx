// src/components/teams/TeamFormModal.tsx
import React from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	TextField,
	Box,
	CircularProgress,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { CreateTeamRequest, UpdateTeamRequest } from "../features/teams/types";

interface TeamFormModalProps {
	open: boolean;
	onClose: () => void;
	onSubmit: (data: CreateTeamRequest | UpdateTeamRequest) => void;
	initialData?: { name: string; description: string };
	mode: "create" | "edit";
	isLoading?: boolean;
}

export const TeamFormModal: React.FC<TeamFormModalProps> = ({
	open,
	onClose,
	onSubmit,
	initialData,
	mode,
	isLoading = false,
}) => {
	const {
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		defaultValues: initialData || { name: "", description: "" },
	});

	React.useEffect(() => {
		if (open && initialData) {
			reset(initialData);
		}
	}, [open, initialData, reset]);

	const handleClose = () => {
		reset();
		onClose();
	};

	return (
		<Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
			<DialogTitle>
				{mode === "create" ? "Создать команду" : "Редактировать команду"}
			</DialogTitle>
			<Box component="form" onSubmit={handleSubmit(onSubmit)}>
				<DialogContent>
					<Controller
						name="name"
						control={control}
						rules={{ required: "Название команды обязательно" }}
						render={({ field }) => (
							<TextField
								{...field}
								label="Название команды"
								fullWidth
								margin="normal"
								error={!!errors.name}
								helperText={errors.name?.message}
								disabled={isLoading}
							/>
						)}
					/>
					<Controller
						name="description"
						control={control}
						rules={{ required: "Описание команды обязательно" }}
						render={({ field }) => (
							<TextField
								{...field}
								label="Описание"
								fullWidth
								margin="normal"
								multiline
								rows={4}
								error={!!errors.description}
								helperText={errors.description?.message}
								disabled={isLoading}
							/>
						)}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} disabled={isLoading}>
						Отмена
					</Button>
					<Button
						type="submit"
						variant="contained"
						disabled={isLoading}
						startIcon={isLoading ? <CircularProgress size={20} /> : null}
					>
						{mode === "create" ? "Создать" : "Сохранить"}
					</Button>
				</DialogActions>
			</Box>
		</Dialog>
	);
};
