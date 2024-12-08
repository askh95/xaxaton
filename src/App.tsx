// src/App.tsx
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline, Box } from "@mui/material";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "./store/store";
import { theme, darkTheme } from "./styles/theme";
import { useState, useMemo, createContext, useContext } from "react";

import { LoginForm } from "./components/LoginForm";
import { RegisterForm } from "./components/RegisterForm";
import { Navbar } from "./components/Navbar";
import { UserSettings } from "./components/UserSettings";
import { EventsPage } from "./pages/EventsPage";
import { TeamsPage } from "./pages/TeamsPage";
import { RegionsPage } from "./pages/RegionsPage";

import { ForgotPasswordForm } from "./components/ForgotPasswordForm";
import { ResetPasswordForm } from "./components/ResetPasswordForm";
import { RegionDetailsPage } from "./components/RegionDetailsPage";

import { LandingPage } from "./pages/LandingPage";

interface ThemeContextType {
	isDarkMode: boolean;
	toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType>({
	isDarkMode: false,
	toggleTheme: () => {},
});

export const useThemeToggle = () => useContext(ThemeContext);

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
	const token = localStorage.getItem("token");
	if (!token) {
		return <Navigate to="/login" />;
	}
	return <>{children}</>;
};

function App() {
	const [isDarkMode, setIsDarkMode] = useState(() => {
		const savedTheme = localStorage.getItem("theme");
		return savedTheme === "dark";
	});

	const themeContextValue = useMemo(
		() => ({
			isDarkMode,
			toggleTheme: () => {
				setIsDarkMode((prev) => {
					const newMode = !prev;
					localStorage.setItem("theme", newMode ? "dark" : "light");
					return newMode;
				});
			},
		}),
		[isDarkMode]
	);

	return (
		<ReduxProvider store={store}>
			<ThemeContext.Provider value={themeContextValue}>
				<ThemeProvider theme={isDarkMode ? darkTheme : theme}>
					<CssBaseline />
					<Router>
						<Box
							sx={{
								display: "flex",
								flexDirection: "column",
								minHeight: "100vh",
								width: "100%",
							}}
						>
							<Navbar />
							<Box
								component="main"
								sx={{
									flexGrow: 1,
									width: "100%",
									bgcolor: "background.default",
								}}
							>
								<Routes>
									<Route path="/login" element={<LoginForm />} />
									<Route path="/register" element={<RegisterForm />} />
									<Route
										path="/forgot-password"
										element={<ForgotPasswordForm />}
									/>
									<Route
										path="/reset-password"
										element={<ResetPasswordForm />}
									/>
									<Route
										path="/teams"
										element={
											<ProtectedRoute>
												<TeamsPage />
											</ProtectedRoute>
										}
									/>
									<Route
										path="/regions"
										element={
											<ProtectedRoute>
												<RegionsPage />
											</ProtectedRoute>
										}
									/>
									<Route
										path="/regions/:id"
										element={
											<ProtectedRoute>
												<RegionDetailsPage />
											</ProtectedRoute>
										}
									/>
									<Route
										path="/"
										element={
											<ProtectedRoute>
												<LandingPage />
											</ProtectedRoute>
										}
									/>
									<Route
										path="/settings"
										element={
											<ProtectedRoute>
												<UserSettings />
											</ProtectedRoute>
										}
									/>
									<Route
										path="/events"
										element={
											<ProtectedRoute>
												<EventsPage />
											</ProtectedRoute>
										}
									/>
									<Route
										path="/events/create"
										element={
											<ProtectedRoute>
												<EventsPage />
											</ProtectedRoute>
										}
									/>
									<Route path="*" element={<Navigate to="/" />} />
								</Routes>
							</Box>
						</Box>
					</Router>
				</ThemeProvider>
			</ThemeContext.Provider>
		</ReduxProvider>
	);
}

export default App;
