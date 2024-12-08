// src/components/ResetPasswordForm.tsx
import { FC, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
	Container,
	Box,
	TextField,
	Button,
	Typography,
	Alert,
	Paper,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useVerifyResetPasswordMutation } from "../features/auth/api";

const resetPasswordSchema = z
	.object({
		code: z.string().length(6, "Код должен состоять из 6 цифр"),
		newPassword: z
			.string()
			.min(8, "Пароль должен содержать минимум 8 символов")
			.regex(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
				"Пароль должен содержать хотя бы одну заглавную букву, одну строчную букву и одну цифру"
			),
		confirmPassword: z.string(),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "Пароли не совпадают",
		path: ["confirmPassword"],
	});

type TResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export const ResetPasswordForm: FC = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const email = location.state?.email || "";
	const [verifyResetPassword, { isLoading }] = useVerifyResetPasswordMutation();
	const [error, setError] = useState("");
	const [isSuccess, setIsSuccess] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors, touchedFields, isValid },
	} = useForm<TResetPasswordFormData>({
		resolver: zodResolver(resetPasswordSchema),
		mode: "onChange",
		defaultValues: {
			code: "",
			newPassword: "",
			confirmPassword: "",
		},
	});

	const onSubmit = async (data: TResetPasswordFormData) => {
		if (!isValid) return;
		setError("");

		try {
			await verifyResetPassword({
				token: data.code,
				newPassword: data.newPassword,
			}).unwrap();
			setIsSuccess(true);
		} catch (err) {
			console.error("Password reset failed:", err);
			setError(
				"Произошла ошибка. Проверьте код подтверждения и попробуйте снова."
			);
		}
	};

	if (isSuccess) {
		return (
			<Container maxWidth="xs">
				<Box sx={{ mt: 8 }}>
					<Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
						<Typography variant="h6" align="center" gutterBottom>
							Пароль успешно изменен
						</Typography>
						<Button
							fullWidth
							variant="contained"
							onClick={() => navigate("/login")}
							sx={{ mt: 3 }}
						>
							Перейти к входу
						</Button>
					</Paper>
				</Box>
			</Container>
		);
	}

	return (
		<Container maxWidth="xs">
			<Box sx={{ mt: 8 }}>
				<Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
					<Typography variant="h5" component="h1" align="center" gutterBottom>
						Введите код подтверждения
					</Typography>

					<Typography color="textSecondary" align="center" sx={{ mb: 3 }}>
						Мы отправили код подтверждения на почту
						{email && ` ${email}`}
					</Typography>

					{error && (
						<Alert severity="error" sx={{ mb: 2 }}>
							{error}
						</Alert>
					)}

					<form onSubmit={handleSubmit(onSubmit)} noValidate>
						<TextField
							fullWidth
							margin="normal"
							label="Код подтверждения"
							type="text"
							inputProps={{ maxLength: 6 }}
							error={touchedFields.code && !!errors.code}
							helperText={touchedFields.code && errors.code?.message}
							{...register("code")}
						/>

						<TextField
							fullWidth
							margin="normal"
							label="Новый пароль"
							type="password"
							error={touchedFields.newPassword && !!errors.newPassword}
							helperText={
								touchedFields.newPassword && errors.newPassword?.message
							}
							{...register("newPassword")}
						/>

						<TextField
							fullWidth
							margin="normal"
							label="Подтвердите пароль"
							type="password"
							error={touchedFields.confirmPassword && !!errors.confirmPassword}
							helperText={
								touchedFields.confirmPassword && errors.confirmPassword?.message
							}
							{...register("confirmPassword")}
						/>

						<Button
							type="submit"
							fullWidth
							variant="contained"
							size="large"
							disabled={isLoading || !isValid}
							sx={{ mt: 3, mb: 2 }}
						>
							{isLoading ? "Сохранение..." : "Подтвердить"}
						</Button>

						<Button
							fullWidth
							color="secondary"
							onClick={() => navigate("/forgot-password")}
						>
							Запросить новый код
						</Button>
					</form>
				</Paper>
			</Box>
		</Container>
	);
};
