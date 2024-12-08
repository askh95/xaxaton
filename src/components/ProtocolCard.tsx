import React, { useState } from "react";
import {
	Card,
	CardContent,
	Typography,
	Button,
	Box,
	Stack,
	IconButton,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Tooltip,
} from "@mui/material";
import { Download, Upload, Delete, Warning } from "@mui/icons-material";
import { useProtocol } from "../features/protocols/hooks";

interface ProtocolCardProps {
	eventBaseId: number;
	regionId: number;
	canManage?: boolean;
}

export const ProtocolCard: React.FC<ProtocolCardProps> = ({
	eventBaseId,
	regionId,
	canManage = false,
}) => {
	const { protocol, isLoading, uploadProtocol, deleteProtocol } = useProtocol(
		eventBaseId,
		regionId
	);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [uploadError, setUploadError] = useState<string | null>(null);

	const handleFileUpload = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const file = event.target.files?.[0];
		if (!file) return;

		try {
			await uploadProtocol(file);
			setUploadError(null);
		} catch (error) {
			console.error("Failed to upload protocol:", error);
			setUploadError("Не удалось загрузить протокол");
		}
	};

	const handleDelete = async () => {
		try {
			await deleteProtocol();
			setDeleteDialogOpen(false);
		} catch (error) {
			console.error("Failed to delete protocol:", error);
		}
	};

	const handleDownload = () => {
		if (!protocol) return;

		const blob = new Blob([atob(protocol)], { type: "application/pdf" });
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `protocol-${eventBaseId}-${regionId}.pdf`;
		document.body.appendChild(a);
		a.click();
		window.URL.revokeObjectURL(url);
		document.body.removeChild(a);
	};

	if (isLoading) {
		return (
			<Card variant="outlined" sx={{ mb: 2 }}>
				<CardContent>
					<Typography>Загрузка протокола...</Typography>
				</CardContent>
			</Card>
		);
	}

	return (
		<>
			<Card variant="outlined" sx={{ mb: 2 }}>
				<CardContent>
					<Stack spacing={2}>
						<Box
							display="flex"
							justifyContent="space-between"
							alignItems="center"
						>
							<Typography variant="h6" component="h2">
								Фронтендер не справился c задачой=( /)
							</Typography>
						</Box>

						{uploadError && (
							<Box
								display="flex"
								alignItems="center"
								gap={1}
								color="error.main"
							>
								<Warning fontSize="small" />
								<Typography variant="body2" color="error">
									{uploadError}
								</Typography>
							</Box>
						)}

						<Box display="flex" justifyContent="flex-end" gap={1}>
							{protocol ? (
								<>
									<Tooltip title="Скачать">
										<IconButton
											color="primary"
											onClick={handleDownload}
											size="small"
										>
											<Download />
										</IconButton>
									</Tooltip>
									{canManage && (
										<>
											<Tooltip title="Заменить">
												<IconButton
													color="primary"
													component="label"
													size="small"
												>
													<Upload />
													<input
														type="file"
														hidden
														accept="application/pdf"
														onChange={handleFileUpload}
													/>
												</IconButton>
											</Tooltip>
											<Tooltip title="Удалить">
												<IconButton
													color="error"
													onClick={() => setDeleteDialogOpen(true)}
													size="small"
												>
													<Delete />
												</IconButton>
											</Tooltip>
										</>
									)}
								</>
							) : (
								canManage && (
									<Button
										variant="outlined"
										component="label"
										startIcon={<Upload />}
									>
										Загрузить протокол
										<input
											type="file"
											hidden
											accept="application/pdf"
											onChange={handleFileUpload}
										/>
									</Button>
								)
							)}
						</Box>
					</Stack>
				</CardContent>
			</Card>

			<Dialog
				open={deleteDialogOpen}
				onClose={() => setDeleteDialogOpen(false)}
				maxWidth="sm"
				fullWidth
			>
				<DialogTitle>Удаление протокола</DialogTitle>
				<DialogContent>
					<Typography>
						Вы действительно хотите удалить протокол? Это действие нельзя будет
						отменить.
					</Typography>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setDeleteDialogOpen(false)}>Отмена</Button>
					<Button onClick={handleDelete} color="error" variant="contained">
						Удалить
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};
