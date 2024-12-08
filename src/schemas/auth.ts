import { z } from "zod";

export interface RegisterRequest {
	firstname: string;
	lastname: string;
	email: string;
	password: string;
	patronymic: string;
}

export const forgotPasswordSchema = z.object({
	email: z.string().email("Некорректный email адрес"),
});

export const resetPasswordSchema = z
	.object({
		token: z.string().min(1, "Токен обязателен"),
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

export const loginSchema = z.object({
	email: z
		.string()
		.min(1, "Email обязателен")
		.email("Некорректный формат email"),
	password: z
		.string()
		.min(6, "Пароль должен содержать минимум 6 символов")
		.max(50, "Пароль слишком длинный"),
});

export const registerSchema = z
	.object({
		firstname: z
			.string()
			.min(1, "Имя обязательно")
			.max(25, "Имя не должно превышать 25 символов"),
		lastname: z
			.string()
			.min(1, "Фамилия обязательна")
			.max(25, "Фамилия не должна превышать 25 символов"),
		patronymic: z
			.string()
			.min(1, "Отчество обязательно")
			.max(25, "Отчество не должно превышать 25 символов"),
		email: z
			.string()
			.min(1, "Email обязателен")
			.email("Некорректный формат email"),
		password: z
			.string()
			.min(6, "Пароль должен содержать минимум 6 символов")
			.max(50, "Пароль слишком длинный")
			.regex(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
				"Пароль должен содержать заглавные, строчные буквы и цифры"
			),
		confirmPassword: z.string().min(1, "Подтверждение пароля обязательно"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Пароли не совпадают",
		path: ["confirmPassword"],
	});

export const verificationCodeSchema = z.object({
	code: z.string().length(6, "Код должен состоять из 6 цифр"),
});

export type TLoginFormData = z.infer<typeof loginSchema>;
export type TRegisterFormData = z.infer<typeof registerSchema>;
export type TForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type TResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type TVerificationCodeFormData = z.infer<typeof verificationCodeSchema>;
