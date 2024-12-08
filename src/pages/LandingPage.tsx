// src/pages/LandingPage.tsx
import React from "react";
import {
	Box,
	Container,
	Typography,
	Grid,
	Card,
	CardContent,
	Stack,
} from "@mui/material";
import {
	Speed as SpeedIcon,
	Security as SecurityIcon,
	Psychology as PsychologyIcon,
} from "@mui/icons-material";

import image from "../assets/home.webp";

const features = [
	{
		icon: <SpeedIcon sx={{ fontSize: 40 }} />,
		title: "Управление заявками",
		description:
			"Подача и отслеживание заявок на проведение соревнований. Быстрое рассмотрение и обратная связь.",
	},
	{
		icon: <SecurityIcon sx={{ fontSize: 40 }} />,
		title: "Единый календарь",
		description:
			"Централизованное управление календарем соревнований с уведомлениями об изменениях",
	},
	{
		icon: <PsychologyIcon sx={{ fontSize: 40 }} />,
		title: "Аналитика результатов",
		description:
			"Загрузка и анализ результатов соревнований, формирование отчетов и статистики",
	},
];

export const LandingPage: React.FC = () => {
	return (
		<Box>
			<Box
				sx={{
					bgcolor: "primary.main",
					color: "primary.contrastText",
					pt: 12,
					pb: 6,
				}}
			>
				<Container maxWidth="lg">
					<Grid container spacing={4} alignItems="center">
						<Grid item xs={12} md={6}>
							<Typography
								variant="h2"
								component="h1"
								gutterBottom
								sx={{ fontWeight: 700 }}
							>
								Платформа взаимодействия с ФСП
							</Typography>
							<Typography variant="h5" paragraph sx={{ mb: 4, opacity: 0.9 }}>
								Эффективное взаимодействие между Федерацией спортивного
								программирования и региональными представителями. Автоматизация
								процессов управления заявками и координация мероприятий.
							</Typography>
						</Grid>
						<Grid item xs={12} md={6}>
							<Box
								component="img"
								src={image}
								alt="Dashboard Preview"
								sx={{
									width: "100%",
									height: "auto",
									borderRadius: 2,
									boxShadow: 3,
								}}
							/>
						</Grid>
					</Grid>
				</Container>
			</Box>

			<Container maxWidth="lg" sx={{ py: 8 }}>
				<Typography
					variant="h3"
					component="h2"
					textAlign="center"
					gutterBottom
					sx={{ mb: 6 }}
				>
					Преимущества платформы
				</Typography>
				<Grid container spacing={4}>
					{features.map((feature, index) => (
						<Grid item xs={12} md={4} key={index}>
							<Card
								sx={{
									height: "100%",
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
									textAlign: "center",
									p: 3,
								}}
								elevation={2}
							>
								<Box sx={{ color: "primary.main", mb: 2 }}>{feature.icon}</Box>
								<CardContent>
									<Typography variant="h5" component="h3" gutterBottom>
										{feature.title}
									</Typography>
									<Typography variant="body1" color="text.secondary">
										{feature.description}
									</Typography>
								</CardContent>
							</Card>
						</Grid>
					))}
				</Grid>
			</Container>

			{/* CTA Section */}
			<Box
				sx={{ bgcolor: "primary.main", color: "primary.contrastText", py: 8 }}
			>
				<Container maxWidth="md">
					<Stack spacing={4} alignItems="center" textAlign="center">
						<Typography variant="h3" component="h2">
							Присоединяйтесь к ФСП
						</Typography>
						<Typography variant="h6" sx={{ opacity: 0.9 }}>
							Улучшайте координацию соревнований и эффективность взаимодействия
							с регионами
						</Typography>
					</Stack>
				</Container>
			</Box>
		</Box>
	);
};
