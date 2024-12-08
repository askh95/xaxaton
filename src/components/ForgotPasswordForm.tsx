import { FC } from "react";
import { useNavigate } from "react-router-dom";
import {
	Container,
	Box,
	TextField,
	Button,
	Typography,
	Paper,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	forgotPasswordSchema,
	type TForgotPasswordFormData,
} from "../schemas/auth";
import { useResetPasswordMutation } from "../features/auth/api";

export const ForgotPasswordForm: FC = () => {
	const navigate = useNavigate();
	const [resetPassword, { isLoading }] = useResetPasswordMutation();

	const {
		register,
		handleSubmit,
		formState: { errors, touchedFields, isValid },
	} = useForm<TForgotPasswordFormData>({
		resolver: zodResolver(forgotPasswordSchema),
		mode: "onChange",
		defaultValues: {
			email: "",
		},
	});

	const onSubmit = async (data: TForgotPasswordFormData) => {
		if (!isValid) return;

		try {
			await resetPassword(data).unwrap();
			navigate("/reset-password", { state: { email: data.email } });
		} catch (err) {
			console.error("Password reset request failed:", err);
		}
	};

	return (
		<Container maxWidth="xs">
			<Box sx={{ mt: 8 }}>
				<Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
					<Typography variant="h5" component="h1" align="center" gutterBottom>
						Восстановление пароля
					</Typography>

					<Typography color="textSecondary" align="center" sx={{ mb: 3 }}>
						Введите ваш email для получения инструкций по сбросу пароля
					</Typography>

					<form onSubmit={handleSubmit(onSubmit)} noValidate>
						<TextField
							fullWidth
							margin="normal"
							label="Email"
							type="email"
							error={touchedFields.email && !!errors.email}
							helperText={touchedFields.email && errors.email?.message}
							{...register("email")}
						/>

						<Button
							type="submit"
							fullWidth
							variant="contained"
							size="large"
							disabled={isLoading || !isValid}
							sx={{ mt: 3, mb: 2 }}
						>
							{isLoading ? "Отправка..." : "Отправить"}
						</Button>

						<Button
							fullWidth
							color="secondary"
							onClick={() => navigate("/login")}
						>
							Вернуться к входу
						</Button>
					</form>
				</Paper>
			</Box>
		</Container>
	);
};
