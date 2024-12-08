import { FC, PropsWithChildren } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import {
	selectIsAuthenticated,
	selectCurrentUser,
} from "../features/auth/slice";
import { CircularProgress, Box } from "@mui/material";

interface ProtectedRouteProps extends PropsWithChildren {
	requireAuth?: boolean;
	allowedRoles?: string[];
}

/**
 * @param {ReactNode} children
 * @param {boolean} requireAuth
 * @param {string[]} allowedRoles
 */
export const ProtectedRoute: FC<ProtectedRouteProps> = ({
	children,
	requireAuth = true,
	allowedRoles = [],
}) => {
	const location = useLocation();
	const isAuthenticated = useAppSelector(selectIsAuthenticated);
	const currentUser = useAppSelector(selectCurrentUser);

	if (requireAuth && !isAuthenticated) {
		return <Navigate to="/login" state={{ from: location.pathname }} replace />;
	}

	if (
		allowedRoles.length > 0 &&
		currentUser &&
		!allowedRoles.includes(currentUser.role.name)
	) {
		return <Navigate to="/" replace />;
	}

	if (requireAuth && !currentUser) {
		return (
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					minHeight: "100vh",
				}}
			>
				<CircularProgress />
			</Box>
		);
	}

	return <>{children}</>;
};

export type { ProtectedRouteProps };
