export const EVENT_STATUS = {
	PENDING: "PENDING",
	APPROVED: "APPROVED",
	REJECTED: "REJECTED",
} as const;

export const EVENT_STATUS_LABELS = {
	[EVENT_STATUS.PENDING]: "На рассмотрении",
	[EVENT_STATUS.APPROVED]: "Одобрено",
	[EVENT_STATUS.REJECTED]: "Отклонено",
} as const;
