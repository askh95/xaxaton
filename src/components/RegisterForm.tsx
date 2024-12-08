// src/components/RegisterForm.tsx
import { useNavigate } from "react-router-dom";
import {
	Container,
	Box,
	TextField,
	Button,
	Typography,
	Alert,
	Paper,
	Grid,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type TRegisterFormData } from "../schemas/auth";
import { useRegisterMutation } from "../features/auth/api";
import { useAppDispatch } from "../store/hooks";
import { setCredentials } from "../features/auth/slice";

export const RegisterForm = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const [register, { isLoading, isError }] = useRegisterMutation();

	const {
		register: registerField,
		handleSubmit,
		formState: { errors, touchedFields, isValid },
		watch,
	} = useForm<TRegisterFormData>({
		resolver: zodResolver(registerSchema),
		mode: "onChange",
		criteriaMode: "all",
		defaultValues: {
			firstname: "",
			lastname: "",
			patronymic: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	const password = watch("password");
	const confirmPassword = watch("confirmPassword");

	const onSubmit = async (data: TRegisterFormData) => {
		if (!isValid) return;
		if (password !== confirmPassword) return;

		try {
			const { confirmPassword, ...registerData } = data;
			const response = await register(registerData).unwrap();
			dispatch(setCredentials(response));
			navigate("/");
		} catch (err) {
			console.error("Registration failed:", err);
		}
	};

	return (
		<Container maxWidth="sm">
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
						Регистрация
					</Typography>

					{isError && (
						<Alert severity="error" sx={{ mb: 2 }}>
							Ошибка при регистрации
						</Alert>
					)}

					<form onSubmit={handleSubmit(onSubmit)} noValidate>
						<Grid container spacing={2}>
							<Grid item xs={12} sm={6}>
								<TextField
									fullWidth
									label="Имя"
									error={touchedFields.firstname && !!errors.firstname}
									helperText={
										touchedFields.firstname && errors.firstname?.message
									}
									{...registerField("firstname")}
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField
									fullWidth
									label="Фамилия"
									error={touchedFields.lastname && !!errors.lastname}
									helperText={
										touchedFields.lastname && errors.lastname?.message
									}
									{...registerField("lastname")}
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									fullWidth
									label="Отчество"
									error={touchedFields.patronymic && !!errors.patronymic}
									helperText={
										touchedFields.patronymic && errors.patronymic?.message
									}
									{...registerField("patronymic")}
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									fullWidth
									label="Email"
									type="email"
									error={touchedFields.email && !!errors.email}
									helperText={touchedFields.email && errors.email?.message}
									{...registerField("email")}
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField
									fullWidth
									label="Пароль"
									type="password"
									error={touchedFields.password && !!errors.password}
									helperText={
										touchedFields.password && errors.password?.message
									}
									{...registerField("password")}
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField
									fullWidth
									label="Подтвердите пароль"
									type="password"
									error={
										touchedFields.confirmPassword && !!errors.confirmPassword
									}
									helperText={
										touchedFields.confirmPassword &&
										errors.confirmPassword?.message
									}
									{...registerField("confirmPassword")}
								/>
							</Grid>
						</Grid>

						<Button
							type="submit"
							fullWidth
							variant="contained"
							size="large"
							disabled={isLoading || !isValid}
							sx={{ mt: 3, mb: 2 }}
						>
							{isLoading ? "Регистрация..." : "Зарегистрироваться"}
						</Button>

						<Button
							fullWidth
							color="secondary"
							onClick={() => navigate("/login")}
						>
							Уже есть аккаунт? Войти
						</Button>
					</form>
				</Paper>
			</Box>
		</Container>
	);
};
