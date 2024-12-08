import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	Button,
	Box,
	Alert,
} from "@mui/material";
import {
	RegionResponse,
	CreateRegionRequest,
	UpdateRegionRequest,
} from "../features/regions/types";
import { useState } from "react";
import { UserSelect } from "./UserSelect";
import { useCurrentUserRole } from "../features/auth/hooks";

const baseSchema = z.object({
	description: z
		.string()
		.min(1, "Описание обязательно")
		.max(500, "Максимальная длина описания - 500 символов"),
});

const createSchema = z.object({
	description: z
		.string()
		.min(1, "Описание обязательно")
		.max(500, "Максимальная длина описания - 500 символов"),
	name: z
		.string()
		.min(1, "Название обязательно")
		.max(100, "Максимальная длина названия - 100 символов"),
	contactEmail: z
		.string()
		.email("Некорректный email")
		.min(1, "Email обязателен"),
	userId: z
		.number({
			required_error: "ID пользователя обязателен",
			invalid_type_error: "ID должен быть числом",
		})
		.int()
		.positive("ID должен быть положительным числом"),
});

const updateSchema = z.object({
	description: z
		.string()
		.min(1, "Описание обязательно")
		.max(500, "Максимальная длина описания - 500 символов"),
	name: z
		.string()
		.min(1, "Название обязательно")
		.max(100, "Максимальная длина названия - 100 символов")
		.optional(),
	contactEmail: z
		.string()
		.email("Некорректный email")
		.min(1, "Email обязателен")
		.optional(),
	userId: z
		.number()
		.int()
		.positive("ID должен быть положительным числом")
		.optional(),
});

type FormData =
	| z.infer<typeof createSchema>
	| z.infer<typeof updateSchema>
	| z.infer<typeof baseSchema>;

interface RegionFormProps {
	open: boolean;
	onClose: () => void;
	onSubmit: (
		data: CreateRegionRequest | Omit<UpdateRegionRequest, "id">
	) => Promise<void>;
	initialData?: RegionResponse | null;
}

export const RegionForm = ({
	open,
	onClose,
	onSubmit,
	initialData,
}: RegionFormProps) => {
	const [error, setError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [userSelectOpen, setUserSelectOpen] = useState(false);

	const userRole = useCurrentUserRole();

	const isEditing = !!initialData;
	const schema =
		userRole === "FSP_ADMIN"
			? isEditing
				? updateSchema
				: createSchema
			: baseSchema;

	const { control, handleSubmit, reset } = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: {
			description: initialData?.description || "",
			...(userRole === "FSP_ADMIN" && {
				name: initialData?.name || "",
				contactEmail: initialData?.contactEmail || "",
				userId: initialData?.user?.id,
			}),
		},
	});

	console.log("Current user role:", userRole);

	const handleFormSubmit = async (formData: FormData) => {
		setError(null);
		setIsSubmitting(true);

		try {
			if (userRole === "REGION_ADMIN") {
				await onSubmit({ description: formData.description });
			} else if (userRole === "FSP_ADMIN") {
				if (isEditing) {
					const updateData: Omit<UpdateRegionRequest, "id"> = {
						...(formData as z.infer<typeof updateSchema>),
					};
					await onSubmit(updateData);
				} else {
					await onSubmit(formData as CreateRegionRequest);
				}
			}
			reset();
			onClose();
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Произошла ошибка при сохранении"
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
			<DialogTitle>
				{isEditing ? "Редактирование региона" : "Создание нового региона"}
			</DialogTitle>

			<form onSubmit={handleSubmit(handleFormSubmit)}>
				<DialogContent>
					<Box display="flex" flexDirection="column" gap={2}>
						{error && (
							<Alert severity="error" sx={{ mb: 2 }}>
								{error}
							</Alert>
						)}
						{userRole === "FSP_ADMIN" && (
							<>
								<Controller
									name="name"
									control={control}
									render={({ field, fieldState }) => (
										<TextField
											{...field}
											label="Название региона"
											error={!!fieldState.error}
											helperText={fieldState.error?.message}
											fullWidth
											required={!isEditing}
										/>
									)}
								/>

								<Controller
									name="contactEmail"
									control={control}
									render={({ field, fieldState }) => (
										<TextField
											{...field}
											label="Контактный email"
											error={!!fieldState.error}
											helperText={fieldState.error?.message}
											fullWidth
											required={!isEditing}
											type="email"
										/>
									)}
								/>

								<Controller
									name="userId"
									control={control}
									render={({ field: { value, onChange }, fieldState }) => (
										<Box>
											<TextField
												value={value || ""}
												onClick={() => setUserSelectOpen(true)}
												label="ID пользователя"
												error={!!fieldState.error}
												helperText={fieldState.error?.message}
												fullWidth
												required={!isEditing}
												InputProps={{
													readOnly: true,
													style: { cursor: "pointer" },
												}}
											/>
											<UserSelect
												open={userSelectOpen}
												onClose={() => setUserSelectOpen(false)}
												onSelect={onChange}
												selectedUserId={value}
											/>
										</Box>
									)}
								/>
							</>
						)}
						<Controller
							name="description"
							control={control}
							render={({ field, fieldState }) => (
								<TextField
									{...field}
									label="Описание"
									multiline
									rows={4}
									error={!!fieldState.error}
									helperText={fieldState.error?.message}
									fullWidth
									required
								/>
							)}
						/>
					</Box>
				</DialogContent>

				<DialogActions>
					<Button
						onClick={() => {
							reset();
							onClose();
						}}
						color="inherit"
					>
						Отмена
					</Button>
					<Button
						type="submit"
						variant="contained"
						color="primary"
						disabled={isSubmitting}
					>
						{isSubmitting
							? "Сохранение..."
							: isEditing
							? "Сохранить"
							: "Создать"}
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
};
