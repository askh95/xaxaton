//src/components/RegionList.tsx
import React from "react";
import {
	List,
	ListItem,
	ListItemText,
	ListItemSecondaryAction,
	IconButton,
	Paper,
	Typography,
} from "@mui/material";
import { Delete, ArrowForward } from "@mui/icons-material";
import { RegionResponse } from "../features/regions/types";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

interface RegionListProps {
	regions: RegionResponse[];
	onDelete?: (regionId: number) => void;
	userRole: string;
}

export const RegionList: React.FC<RegionListProps> = ({
	regions,
	onDelete,
	userRole,
}) => {
	const navigate = useNavigate();

	if (!regions.length) {
		return (
			<Typography variant="body1" sx={{ textAlign: "center", mt: 4 }}>
				Регионы не найдены
			</Typography>
		);
	}

	return (
		<List>
			{regions.map((region) => (
				<ListItem
					key={region.id}
					component={Paper}
					sx={{
						mb: 2,
						p: 2,
						transition: "all 0.2s",
						"&:hover": {
							transform: "translateY(-2px)",
							boxShadow: 2,
						},
						cursor: "pointer",
					}}
					onClick={() => navigate(`/regions/${region.id}`)}
				>
					<ListItemText
						primary={
							<Typography
								variant="h6"
								component="div"
								sx={{ display: "flex", alignItems: "center", gap: 2 }}
							>
								{region.name}
							</Typography>
						}
						secondary={
							<React.Fragment>
								<Typography
									variant="body2"
									color="text.secondary"
									sx={{ mt: 1 }}
								>
									{region.description}
								</Typography>
								<Typography
									variant="caption"
									color="text.secondary"
									display="block"
									sx={{ mt: 1 }}
								>
									Контакт: {region.contactEmail}
								</Typography>
								<Typography
									variant="caption"
									color="text.secondary"
									display="block"
								>
									Создано:{" "}
									{format(new Date(region.createdAt), "dd.MM.yyyy HH:mm")}
								</Typography>
							</React.Fragment>
						}
					/>

					<ListItemSecondaryAction>
						<IconButton
							onClick={(e) => {
								e.stopPropagation();
								navigate(`/regions/${region.id}`);
							}}
							color="primary"
							size="large"
						>
							<ArrowForward />
						</IconButton>
						{userRole === "FSP_ADMIN" && onDelete && (
							<IconButton
								onClick={(e) => {
									e.stopPropagation();
									onDelete(region.id);
								}}
								color="error"
								size="large"
							>
								<Delete />
							</IconButton>
						)}
					</ListItemSecondaryAction>
				</ListItem>
			))}
		</List>
	);
};
