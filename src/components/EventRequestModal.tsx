import React from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	TextField,
	Grid,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	FormHelperText,
	CircularProgress,
	IconButton,
	Autocomplete,
	Chip,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createEventRequestSchema } from "../schemas/event";
import { useCreateEventRequestMutation } from "../features/events/api";
import { useGetRegionsQuery } from "../features/regions/api";
import type { CreateEventRequest } from "../features/events/types";
import { useGetDisciplinesQuery } from "../features/disciplines/api";
import type { Discipline } from "../features/disciplines/types";

interface EventRequestModalProps {
	open: boolean;
	onClose: () => void;
}

const GENDERS = [
	{ value: "MALE", label: "Мужской" },
	{ value: "FEMALE", label: "Женский" },
	{ value: "male_female", label: "Мужской и Женский" },
];

export const EventRequestModal: React.FC<EventRequestModalProps> = ({
	open,
	onClose,
}) => {
	const [createEventRequest, { isLoading }] = useCreateEventRequestMutation();
	const { data: regionsData, isLoading: isLoadingRegions } = useGetRegionsQuery(
		{}
	);
	const { data: disciplines, isLoading: isLoadingDisciplines } =
		useGetDisciplinesQuery();

	const {
		control,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<CreateEventRequest>({
		resolver: zodResolver(createEventRequestSchema),
		defaultValues: {
			name: "",
			gender: "",
			minAge: 1,
			maxAge: 100,
			location: "",
			disciplines: [],
			startDate: "",
			endDate: "",
			maxParticipants: 1,
			regionId: 0,
		},
	});

	const onSubmit = async (data: CreateEventRequest) => {
		try {
			const preparedData = {
				...data,
				minAge: Number(data.minAge),
				maxAge: Number(data.maxAge),
				maxParticipants: Number(data.maxParticipants),
				regionId: Number(data.regionId),
			};

			await createEventRequest(preparedData).unwrap();
			reset();
			onClose();
		} catch (error) {
			console.error("Failed to create event request:", error);
		}
	};

	const handleClose = () => {
		reset();
		onClose();
	};

	return (
		<Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
			<DialogTitle
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
				}}
			>
				Создание мероприятия
				<IconButton onClick={handleClose}>
					<Close />
				</IconButton>
			</DialogTitle>

			<form onSubmit={handleSubmit(onSubmit)}>
				<DialogContent dividers>
					<Grid container spacing={3}>
						<Grid item xs={12}>
							<Controller
								name="name"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										fullWidth
										label="Название мероприятия"
										error={!!errors.name}
										helperText={errors.name?.message}
									/>
								)}
							/>
						</Grid>

						<Grid item xs={12} md={6}>
							<Controller
								name="gender"
								control={control}
								render={({ field }) => (
									<FormControl fullWidth error={!!errors.gender}>
										<InputLabel>Пол участников</InputLabel>
										<Select {...field} label="Пол участников">
											{GENDERS.map((gender) => (
												<MenuItem key={gender.value} value={gender.value}>
													{gender.label}
												</MenuItem>
											))}
										</Select>
										<FormHelperText>{errors.gender?.message}</FormHelperText>
									</FormControl>
								)}
							/>
						</Grid>
						<Grid item xs={6} md={3}>
							<Controller
								name="minAge"
								control={control}
								render={({ field: { onChange, ...field } }) => (
									<TextField
										{...field}
										onChange={(e) => {
											const value = e.target.value;
											onChange(Number(value));
										}}
										fullWidth
										type="number"
										label="Мин. возраст"
										error={!!errors.minAge}
										helperText={errors.minAge?.message}
									/>
								)}
							/>
						</Grid>

						<Grid item xs={6} md={3}>
							<Controller
								name="maxAge"
								control={control}
								render={({ field: { onChange, ...field } }) => (
									<TextField
										{...field}
										onChange={(e) => {
											const value = e.target.value;
											onChange(Number(value));
										}}
										fullWidth
										type="number"
										label="Макс. возраст"
										error={!!errors.maxAge}
										helperText={errors.maxAge?.message}
									/>
								)}
							/>
						</Grid>

						<Grid item xs={12}>
							<Controller
								name="disciplines"
								control={control}
								render={({ field }) => (
									<FormControl fullWidth error={!!errors.disciplines}>
										<Autocomplete
											multiple
											options={disciplines || []}
											getOptionLabel={(option: Discipline) => option.name}
											loading={isLoadingDisciplines}
											value={(disciplines || []).filter((d) =>
												field.value.includes(d.id)
											)}
											onChange={(_, newValue) => {
												field.onChange(newValue.map((v) => v.id));
											}}
											renderInput={(params) => (
												<TextField
													{...params}
													label="Дисциплины"
													error={!!errors.disciplines}
													helperText={errors.disciplines?.message}
													InputProps={{
														...params.InputProps,
														endAdornment: (
															<>
																{isLoadingDisciplines ? (
																	<CircularProgress color="inherit" size={20} />
																) : null}
																{params.InputProps.endAdornment}
															</>
														),
													}}
												/>
											)}
											renderTags={(value: Discipline[], getTagProps) =>
												value.map((option, index) => (
													<Chip
														label={option.name}
														{...getTagProps({ index })}
														key={option.id}
													/>
												))
											}
										/>
									</FormControl>
								)}
							/>
						</Grid>

						<Grid item xs={12} md={6}>
							<Controller
								name="startDate"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										fullWidth
										type="datetime-local"
										label="Дата начала"
										InputLabelProps={{ shrink: true }}
										error={!!errors.startDate}
										helperText={errors.startDate?.message}
									/>
								)}
							/>
						</Grid>

						<Grid item xs={12} md={6}>
							<Controller
								name="endDate"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										fullWidth
										type="datetime-local"
										label="Дата окончания"
										InputLabelProps={{ shrink: true }}
										error={!!errors.endDate}
										helperText={errors.endDate?.message}
									/>
								)}
							/>
						</Grid>

						<Grid item xs={12} md={6}>
							<Controller
								name="maxParticipants"
								control={control}
								render={({ field: { onChange, ...field } }) => (
									<TextField
										{...field}
										onChange={(e) => {
											const value = e.target.value;
											onChange(Number(value));
										}}
										fullWidth
										type="number"
										label="Максимум участников"
										error={!!errors.maxParticipants}
										helperText={errors.maxParticipants?.message}
									/>
								)}
							/>
						</Grid>

						<Grid item xs={12} md={6}>
							<Controller
								name="regionId"
								control={control}
								render={({ field: { onChange, ...field } }) => (
									<FormControl fullWidth error={!!errors.regionId}>
										<InputLabel>Регион</InputLabel>
										<Select
											{...field}
											onChange={(e) => {
												const value = e.target.value;
												onChange(Number(value));
											}}
											label="Регион"
											disabled={isLoadingRegions}
										>
											<MenuItem value={0}>Выберите регион</MenuItem>
											{regionsData?.content.map((region) => (
												<MenuItem key={region.id} value={region.id}>
													{region.name}
												</MenuItem>
											))}
										</Select>
										<FormHelperText>{errors.regionId?.message}</FormHelperText>
									</FormControl>
								)}
							/>
						</Grid>

						<Grid item xs={12}>
							<Controller
								name="location"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										fullWidth
										label="Место проведения"
										error={!!errors.location}
										helperText={errors.location?.message}
									/>
								)}
							/>
						</Grid>
					</Grid>
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
						Создать
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
};
