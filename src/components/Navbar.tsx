import {
	AppBar,
	Toolbar,
	Typography,
	Button,
	Box,
	Menu,
	MenuItem,
	ListItemText,
	Divider,
	Avatar,
	Badge,
	IconButton,
	Drawer,
	List,
	useTheme,
	useMediaQuery,
} from "@mui/material";
import {
	Logout,
	Settings,
	Event,
	Group,
	Map as MapIcon,
	KeyboardArrowDown as KeyboardArrowDownIcon,
	Person as PersonIcon,
	Notifications as NotificationsIcon,
	Menu as MenuIcon,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { logout, selectCurrentUser } from "../features/auth/slice";
import { useGetMeQuery } from "../features/auth/api";
import {
	useGetNotificationsQuery,
	useGetUnreadCountQuery,
	useMarkAllAsReadMutation,
	useMarkAsReadMutation,
} from "../features/notifications/api";
import { useState, useCallback } from "react";
import { ThemeToggle } from "./ThemeToggle";

const navigationItems = [
	{ title: "Заявки на мероприятия", path: "/events", icon: <Event /> },
	{ title: "Команды", path: "/teams", icon: <Group /> },
	{ title: "Регионы", path: "/regions", icon: <MapIcon /> },
];

export const Navbar = () => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const location = useLocation();
	const currentUser = useAppSelector(selectCurrentUser);

	const { data: userData } = useGetMeQuery();
	const { data: unreadCount = 0 } = useGetUnreadCountQuery();
	const { data: notifications } = useGetNotificationsQuery({
		page: 0,
		size: 5,
		read: false,
	});
	const [markAsRead] = useMarkAsReadMutation();
	const [markAllAsRead] = useMarkAllAsReadMutation();

	const [mobileOpen, setMobileOpen] = useState(false);
	const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(
		null
	);
	const [notificationsAnchorEl, setNotificationsAnchorEl] =
		useState<null | HTMLElement>(null);

	const profileOpen = Boolean(profileAnchorEl);
	const notificationsOpen = Boolean(notificationsAnchorEl);

	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};

	const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
		setProfileAnchorEl(event.currentTarget);
	};

	const handleProfileClose = () => {
		setProfileAnchorEl(null);
	};

	const handleNotificationsClick = (event: React.MouseEvent<HTMLElement>) => {
		setNotificationsAnchorEl(event.currentTarget);
	};

	const handleNotificationsClose = () => {
		setNotificationsAnchorEl(null);
	};

	const handleMarkAllRead = async () => {
		try {
			await markAllAsRead().unwrap();
			handleNotificationsClose();
		} catch (error) {
			console.error("Failed to mark all notifications as read:", error);
		}
	};

	const getButtonStyles = (isActive: boolean) => ({
		color: isActive ? theme.palette.primary.main : "inherit",
		backgroundColor: isActive ? theme.palette.background.paper : "transparent",
		"&:hover": {
			backgroundColor: isActive
				? theme.palette.background.paper
				: theme.palette.action.hover,
		},
		mx: 1,
		py: 1.5,
		borderRadius: 2,
		transition: "all 0.2s ease-in-out",
	});

	const getIconStyles = (isActive: boolean) => ({
		color: isActive ? theme.palette.primary.main : "inherit",
		mr: 1,
		transition: "color 0.2s ease-in-out",
	});

	const handleNotificationItemClick = async (id: number) => {
		try {
			await markAsRead(id).unwrap();
			handleNotificationsClose();
		} catch (error) {
			console.error("Failed to mark notification as read:", error);
		}
	};

	const handleLogout = () => {
		handleProfileClose();
		dispatch(logout());
		navigate("/login");
	};

	const handleNavigate = useCallback(
		(path: string) => {
			setMobileOpen(false);
			handleProfileClose();
			navigate(path);
		},
		[navigate]
	);

	const isActiveRoute = (path: string) => location.pathname === path;

	const activeButtonStyle = {
		backgroundColor: "rgba(255, 255, 255, 0.12)",
	};

	const drawer = (
		<Box sx={{ width: 250 }}>
			<Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
				<Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
					Меню
				</Typography>
			</Box>
			<List>
				{navigationItems.map((item) => (
					<Button
						key={item.path}
						onClick={() => navigate(item.path)}
						sx={getButtonStyles(isActiveRoute(item.path))}
						startIcon={
							<Box
								component="span"
								sx={getIconStyles(isActiveRoute(item.path))}
							>
								{item.icon}
							</Box>
						}
					>
						{item.title}
					</Button>
				))}
			</List>
		</Box>
	);

	return (
		<AppBar position="static" sx={{ bgcolor: "primary.main", boxShadow: 1 }}>
			<Toolbar sx={{ justifyContent: "space-between" }}>
				{isMobile && (
					<IconButton
						color="inherit"
						aria-label="open drawer"
						edge="start"
						onClick={handleDrawerToggle}
						sx={{ mr: 2 }}
					>
						<MenuIcon />
					</IconButton>
				)}

				<Typography
					variant="h6"
					component="div"
					onClick={() => navigate("/")}
					sx={{
						cursor: "pointer",
						fontWeight: 1000,
						fontSize: {
							xs: "0.9rem",
							sm: "1.1rem",
							md: "1.25rem",
						},
						display: "flex",
						alignItems: "center",
						flexGrow: { xs: 1, md: 0 },
						justifyContent: { xs: "center", md: "flex-start" },
					}}
				>
					ФСП
				</Typography>

				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						gap: { xs: 1, md: 2 },
					}}
				>
					{currentUser && (
						<>
							{!isMobile &&
								navigationItems.map((item) => (
									<Button
										key={item.path}
										color="inherit"
										startIcon={item.icon}
										onClick={() => handleNavigate(item.path)}
										sx={{
											...(isActiveRoute(item.path) && activeButtonStyle),
											display: { xs: "none", md: "flex" },
											fontSize: {
												xs: "0.8rem",
												sm: "0.9rem",
												md: "1rem",
											},
										}}
									>
										{item.title}
									</Button>
								))}

							<IconButton
								color="inherit"
								onClick={handleNotificationsClick}
								size={isMobile ? "small" : "medium"}
							>
								<Badge badgeContent={unreadCount} color="error">
									<NotificationsIcon />
								</Badge>
							</IconButton>

							<Menu
								anchorEl={notificationsAnchorEl}
								open={notificationsOpen}
								onClose={handleNotificationsClose}
								PaperProps={{
									elevation: 4,
									sx: {
										width: { xs: 280, sm: 320 },
										maxHeight: 400,
									},
								}}
								transformOrigin={{ horizontal: "right", vertical: "top" }}
								anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
							>
								<Box
									sx={{
										p: 2,
										display: "flex",
										justifyContent: "space-between",
										alignItems: "center",
									}}
								>
									<Typography variant="subtitle1">Уведомления</Typography>
									{unreadCount > 0 && (
										<Button size="small" onClick={handleMarkAllRead}>
											Прочитать все
										</Button>
									)}
								</Box>
								<Divider />
								{notifications?.content && notifications.content.length > 0 ? (
									notifications.content.map((notification) => (
										<MenuItem
											key={notification.id}
											onClick={() =>
												handleNotificationItemClick(notification.id)
											}
											sx={{ whiteSpace: "normal", py: 1 }}
										>
											<ListItemText
												primary={notification.content}
												secondary={new Date(
													notification.createdAt
												).toLocaleString("ru-RU")}
												primaryTypographyProps={{
													variant: "body2",
													sx: {
														fontWeight: notification.read ? "normal" : "bold",
														fontSize: { xs: "0.8rem", sm: "0.875rem" },
													},
												}}
												secondaryTypographyProps={{
													variant: "caption",
													sx: { fontSize: { xs: "0.7rem", sm: "0.75rem" } },
												}}
											/>
										</MenuItem>
									))
								) : (
									<Box sx={{ p: 2, textAlign: "center" }}>
										<Typography variant="body2" color="text.secondary">
											Нет новых уведомлений
										</Typography>
									</Box>
								)}
							</Menu>

							<Button
								color="inherit"
								onClick={handleProfileClick}
								endIcon={!isMobile && <KeyboardArrowDownIcon />}
								startIcon={
									<Avatar
										sx={{
											width: isMobile ? 28 : 32,
											height: isMobile ? 28 : 32,
										}}
									>
										{userData?.firstname?.[0]?.toUpperCase() || <PersonIcon />}
									</Avatar>
								}
								sx={{
									textTransform: "none",
									minWidth: "auto",
									fontSize: {
										xs: "0.8rem",
										sm: "0.9rem",
										md: "1rem",
									},
									px: { xs: 1, md: 2 },
									...(isActiveRoute("/settings") && activeButtonStyle),
									...(profileOpen && activeButtonStyle),
								}}
							>
								{!isMobile && `${userData?.firstname} ${userData?.lastname}`}
							</Button>

							<Menu
								anchorEl={profileAnchorEl}
								open={profileOpen}
								onClose={handleProfileClose}
								PaperProps={{
									elevation: 4,
									sx: {
										width: { xs: 280, sm: 320 },
										overflow: "visible",
										mt: 1.5,
									},
								}}
								transformOrigin={{ horizontal: "right", vertical: "top" }}
								anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
							>
								<Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
									<Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
										Профиль
									</Typography>
									<Typography variant="body2" color="text.secondary">
										{userData?.firstname} {userData?.lastname}
									</Typography>
								</Box>

								<MenuItem onClick={() => handleNavigate("/settings")}>
									<ListItemText
										primary="Настройки"
										secondary="Управление профилем и уведомлениями"
										primaryTypographyProps={{
											sx: { fontSize: { xs: "0.9rem", sm: "1rem" } },
										}}
										secondaryTypographyProps={{
											sx: { fontSize: { xs: "0.75rem", sm: "0.875rem" } },
										}}
									/>
									<Settings sx={{ ml: 2 }} />
								</MenuItem>

								<MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
									<ListItemText
										primary="Выйти"
										secondary="Завершить текущую сессию"
										primaryTypographyProps={{
											sx: { fontSize: { xs: "0.9rem", sm: "1rem" } },
										}}
										secondaryTypographyProps={{
											sx: { fontSize: { xs: "0.75rem", sm: "0.875rem" } },
										}}
									/>
									<Logout sx={{ ml: 2 }} />
								</MenuItem>
							</Menu>

							<ThemeToggle />
						</>
					)}

					{!currentUser && (
						<>
							<Button
								color="inherit"
								onClick={() => navigate("/login")}
								sx={{
									fontSize: {
										xs: "0.8rem",
										sm: "0.9rem",
										md: "1rem",
									},
									...(isActiveRoute("/login") && activeButtonStyle),
								}}
							>
								Вход
							</Button>
							<Button
								color="inherit"
								onClick={() => navigate("/register")}
								sx={{
									fontSize: {
										xs: "0.8rem",
										sm: "0.9rem",
										md: "1rem",
									},
									...(isActiveRoute("/register") && activeButtonStyle),
								}}
							>
								Регистрация
							</Button>
							<ThemeToggle />
						</>
					)}
				</Box>
			</Toolbar>

			<Drawer
				variant="temporary"
				anchor="left"
				open={mobileOpen}
				onClose={handleDrawerToggle}
				ModalProps={{
					keepMounted: true,
				}}
				sx={{
					display: { xs: "block", md: "none" },
					"& .MuiDrawer-paper": {
						boxSizing: "border-box",
						width: 250,
					},
				}}
			>
				{drawer}
			</Drawer>
		</AppBar>
	);
};
