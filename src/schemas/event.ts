import { z } from "zod";

export const createEventRequestSchema = z.object({
	name: z
		.string()
		.min(3, "Минимум 3 символа")
		.max(100, "Максимум 100 символов"),
	gender: z.string().min(1, "Выберите пол"),
	minAge: z
		.number()
		.min(0, "Минимальный возраст не может быть отрицательным")
		.max(150, "Некорректный возраст"),
	maxAge: z
		.number()
		.min(0, "Максимальный возраст не может быть отрицательным")
		.max(150, "Некорректный возраст"),
	location: z
		.string()
		.min(3, "Минимум 3 символа")
		.max(200, "Максимум 200 символов"),
	disciplines: z.array(z.number()).min(1, "Выберите хотя бы одну дисциплину"),
	startDate: z.string().min(1, "Укажите дату начала"),
	endDate: z.string().min(1, "Укажите дату окончания"),
	maxParticipants: z
		.number()
		.min(1, "Минимум 1 участник")
		.max(1000, "Максимум 1000 участников"),
	regionId: z.number().min(1, "Выберите регион"),
});
