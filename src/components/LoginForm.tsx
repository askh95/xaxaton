// src/components/LoginForm.tsx
import { FC } from "react";
import { useNavigate } from "react-router-dom";
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
import { loginSchema, type TLoginFormData } from "../schemas/auth";
import { useLoginMutation } from "../features/auth/api";
import { useAppDispatch } from "../store/hooks";
import { setCredentials } from "../features/auth/slice";

export const LoginForm: FC = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const [login, { isLoading, isError }] = useLoginMutation();

	const {
		register,
		handleSubmit,
		formState: { errors, touchedFields, isValid },
	} = useForm<TLoginFormData>({
		resolver: zodResolver(loginSchema),
		mode: "onChange",
		criteriaMode: "all",
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onSubmit = async (data: TLoginFormData) => {
		if (!isValid) return;

		try {
			const response = await login(data).unwrap();
			dispatch(setCredentials(response));
			navigate("/");
		} catch (err) {
			console.error("Login failed:", err);
		}
	};

	return (
		<Container maxWidth="xs">
			<Box
				sx={{
					mt: 8,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
				}}
			>
				<Paper elevation={2} sx={{ p: 4, width: "100%", borderRadius: 2 }}>
					<Typography variant="h5" component="h1" align="center" gutterBottom>
						Вход в систему
					</Typography>

					{isError && (
						<Alert severity="error" sx={{ mb: 2 }}>
							Неверный email или пароль
						</Alert>
					)}

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

						<TextField
							fullWidth
							margin="normal"
							label="Пароль"
							type="password"
							error={touchedFields.password && !!errors.password}
							helperText={touchedFields.password && errors.password?.message}
							{...register("password")}
						/>

						<Button
							type="submit"
							fullWidth
							variant="contained"
							size="large"
							disabled={isLoading || !isValid}
							sx={{ mt: 3, mb: 2 }}
						>
							{isLoading ? "Вход..." : "Войти"}
						</Button>

						<Button
							fullWidth
							color="secondary"
							onClick={() => navigate("/forgot-password")}
							sx={{ mb: 1 }}
						>
							Забыли пароль?
						</Button>

						<Button
							fullWidth
							color="secondary"
							onClick={() => navigate("/register")}
						>
							Регистрация
						</Button>
					</form>
				</Paper>
			</Box>
		</Container>
	);
};
