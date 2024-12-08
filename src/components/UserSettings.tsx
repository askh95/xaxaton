// src/components/UserSettings.tsx
import { useState, useEffect } from "react";
import {
	Box,
	Card,
	CardContent,
	TextField,
	Button,
	Typography,
	Alert,
	Container,
} from "@mui/material";
import { useAppSelector } from "../store/hooks";
import { selectCurrentUser } from "../features/auth/slice";
import { useUpdateUserMutation } from "../features/auth/api";
import { useGetMeQuery } from "../features/auth/api";
import { useNavigate } from "react-router-dom";

interface FormData {
	firstname: string;
	lastname: string;
	patronymic: string;
}

export const UserSettings = () => {
	const { data: me } = useGetMeQuery();
	console.log(me);
	const currentUser = useAppSelector(selectCurrentUser);
	const [updateUser, { isLoading }] = useUpdateUserMutation();
	const navigate = useNavigate();

	const [formData, setFormData] = useState<FormData>({
		firstname: "",
		lastname: "",
		patronymic: "",
	});
	const [submitError, setSubmitError] = useState("");
	const [submitSuccess, setSubmitSuccess] = useState(false);

	useEffect(() => {
		if (currentUser) {
			setFormData({
				firstname: me?.firstname || "",
				lastname: me?.lastname || "",
				patronymic: me?.patronymic || "",
			});
		}
	}, [currentUser]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
		setSubmitError("");
		setSubmitSuccess(false);
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!currentUser?.id) return;

		try {
			await updateUser({
				id: currentUser.id,
				firstname: formData.firstname,
				lastname: formData.lastname,
				patronymic: formData.patronymic,
			}).unwrap();

			setSubmitSuccess(true);
		} catch (err) {
			setSubmitError("Произошла ошибка при обновлении профиля");
		}
	};

	if (!currentUser) {
		navigate("/login");
		return null;
	}

	return (
		<Container maxWidth="md">
			<Box sx={{ mt: 4, mb: 4 }}>
				<Typography variant="h4" component="h1" gutterBottom>
					Настройки профиля
				</Typography>
				<Card>
					<CardContent>
						<Box component="form" onSubmit={handleSubmit} noValidate>
							<TextField
								margin="normal"
								required
								fullWidth
								label="Имя"
								name="firstname"
								value={formData.firstname}
								onChange={handleChange}
								sx={{ mb: 2 }}
							/>
							<TextField
								margin="normal"
								required
								fullWidth
								label="Фамилия"
								name="lastname"
								value={formData.lastname}
								onChange={handleChange}
								sx={{ mb: 2 }}
							/>
							<TextField
								margin="normal"
								fullWidth
								label="Отчество"
								name="patronymic"
								value={formData.patronymic}
								onChange={handleChange}
								sx={{ mb: 3 }}
							/>

							{submitError && (
								<Alert severity="error" sx={{ mb: 2 }}>
									{submitError}
								</Alert>
							)}

							{submitSuccess && (
								<Alert severity="success" sx={{ mb: 2 }}>
									Профиль успешно обновлен!
								</Alert>
							)}

							<Button
								type="submit"
								fullWidth
								variant="contained"
								disabled={isLoading}
								sx={{ mt: 2 }}
							>
								{isLoading ? "Сохранение..." : "Сохранить изменения"}
							</Button>
						</Box>
					</CardContent>
				</Card>
			</Box>
		</Container>
	);
};
