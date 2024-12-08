import { useSelector } from "react-redux";
import { selectCurrentUser } from "./slice";
import { UserRole } from "./types";

export const useCurrentUserRole = () => {
	const user = useSelector(selectCurrentUser);
	return user?.role?.name as UserRole;
};
