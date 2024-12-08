import { createTheme, alpha } from "@mui/material/styles";
import { TypographyVariantsOptions } from "@mui/material/styles";

const primaryMain = "#5438DC";
const secondaryMain = "#FF4D8D";

const typography: TypographyVariantsOptions = {
	fontFamily: "'Inter', 'Roboto', 'Arial', sans-serif",
	h1: {
		fontSize: "3.5rem",
		fontWeight: 700,
		letterSpacing: "-0.02em",
		lineHeight: 1.2,
	},
	h2: {
		fontSize: "2.75rem",
		fontWeight: 700,
		letterSpacing: "-0.01em",
		lineHeight: 1.2,
	},
	h3: {
		fontSize: "2.2rem",
		fontWeight: 600,
		letterSpacing: "-0.01em",
	},
	h4: {
		fontSize: "1.75rem",
		fontWeight: 600,
		letterSpacing: "-0.005em",
	},
	h5: {
		fontSize: "1.5rem",
		fontWeight: 500,
		letterSpacing: "-0.005em",
	},
	h6: {
		fontSize: "1.25rem",
		fontWeight: 500,
		letterSpacing: "-0.005em",
	},
	subtitle1: {
		fontSize: "1.125rem",
		letterSpacing: "0.005em",
	},
	body1: {
		fontSize: "1rem",
		letterSpacing: "0.005em",
		lineHeight: 1.7,
	},
	button: {
		textTransform: "none" as const,
		fontWeight: 500,
		letterSpacing: "0.02em",
	},
};

const components = {
	MuiButton: {
		styleOverrides: {
			root: {
				borderRadius: "12px",
				padding: "8px 24px",
				fontSize: "1rem",
				transition: "all 0.2s ease-in-out",
			},
			contained: {
				boxShadow: "none",
				"&:hover": {
					transform: "translateY(-1px)",
					boxShadow: `0 8px 20px -8px ${alpha(primaryMain, 0.3)}`,
				},
			},
			outlined: {
				borderWidth: "2px",
				"&:hover": {
					borderWidth: "2px",
				},
			},
		},
	},
	MuiCard: {
		styleOverrides: {
			root: {
				borderRadius: "16px",
				transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
				"&:hover": {
					transform: "translateY(-4px)",
				},
			},
		},
		defaultProps: {
			elevation: 0,
		},
	},
	MuiPaper: {
		styleOverrides: {
			rounded: {
				borderRadius: "16px",
			},
			elevation1: {
				boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.08)",
			},
		},
	},
	MuiAppBar: {
		styleOverrides: {
			root: {
				backdropFilter: "blur(8px)",
			},
		},
	},
	MuiTextField: {
		styleOverrides: {
			root: {
				"& .MuiOutlinedInput-root": {
					borderRadius: "12px",
				},
			},
		},
	},
};

export const theme = createTheme({
	palette: {
		mode: "light",
		primary: {
			main: primaryMain,
			light: alpha(primaryMain, 0.8),
			dark: "#3B2899",
			contrastText: "#ffffff",
		},
		secondary: {
			main: secondaryMain,
			light: alpha(secondaryMain, 0.8),
			dark: "#E6195F",
			contrastText: "#ffffff",
		},
		background: {
			default: "#F8F9FC",
			paper: "#FFFFFF",
		},
		text: {
			primary: "#1A1A2F",
			secondary: "#585773",
		},
	},
	typography,
	shape: {
		borderRadius: 12,
	},
	components,
});

export const darkTheme = createTheme({
	palette: {
		mode: "dark",
		primary: {
			main: "#0A0B14",
			light: "#BF94FF",
			dark: "#7B3FE4",
			contrastText: "#ffffff",
		},
		secondary: {
			main: "#FF3D7F",
			light: "#FF729F",
			dark: "#E31B5F",
			contrastText: "#ffffff",
		},
		background: {
			default: "#0A0B14",
			paper: "#151823",
		},
		text: {
			primary: "#FFFFFF",
			secondary: "#A4A9BC",
		},
		divider: "rgba(164, 169, 188, 0.12)",
		error: {
			main: "#FF5252",
			light: "#FF8A80",
			dark: "#D32F2F",
		},
		warning: {
			main: "#FFB74D",
			light: "#FFE0B2",
			dark: "#F57C00",
		},
		success: {
			main: "#69F0AE",
			light: "#B9F6CA",
			dark: "#00C853",
		},
		info: {
			main: "#40C4FF",
			light: "#80D8FF",
			dark: "#0091EA",
		},
	},
	typography,
	shape: {
		borderRadius: 12,
	},
	components: {
		...components,
		MuiPaper: {
			styleOverrides: {
				root: {
					backgroundImage: "none",
					"&::before": {
						display: "none",
					},
				},
				rounded: {
					borderRadius: "16px",
				},
				elevation1: {
					boxShadow: "0 4px 20px 0 rgba(0, 0, 0, 0.4)",
					backgroundColor: "rgba(21, 24, 35, 0.95)",
					backdropFilter: "blur(12px)",
				},
				elevation2: {
					boxShadow: "0 8px 24px 0 rgba(0, 0, 0, 0.5)",
					backgroundColor: "rgba(21, 24, 35, 0.98)",
				},
			},
		},
		MuiCard: {
			styleOverrides: {
				root: {
					backgroundImage: "none",
					backgroundColor: "rgba(21, 24, 35, 0.95)",
					backdropFilter: "blur(12px)",
					border: "1px solid rgba(164, 169, 188, 0.08)",
					transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
					"&:hover": {
						transform: "translateY(-4px)",
						boxShadow: `0 12px 28px -4px ${alpha(
							"#9D5CFF",
							0.24
						)}, 0 4px 12px -2px rgba(0, 0, 0, 0.3)`,
						border: "1px solid rgba(157, 92, 255, 0.12)",
					},
				},
			},
			defaultProps: {
				elevation: 0,
			},
		},
		MuiAppBar: {
			styleOverrides: {
				root: {
					backgroundImage: "none",
					backgroundColor: "rgba(10, 11, 20, 0.8)",
					backdropFilter: "blur(16px)",
					borderBottom: "1px solid rgba(164, 169, 188, 0.08)",
				},
			},
		},
		MuiButton: {
			styleOverrides: {
				root: {
					textTransform: "none",
					borderRadius: "12px",
					padding: "8px 24px",
					transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
				},
				contained: {
					background: `linear-gradient(135deg, #9D5CFF 0%, #7B3FE4 100%)`,
					boxShadow: "none",
					"&:hover": {
						background: `linear-gradient(135deg, #BF94FF 0%, #9D5CFF 100%)`,
						boxShadow: `0 8px 24px -4px ${alpha("#9D5CFF", 0.4)}`,
						transform: "translateY(-1px)",
					},
				},
				outlined: {
					borderColor: "rgba(164, 169, 188, 0.24)",
					"&:hover": {
						borderColor: "#9D5CFF",
						backgroundColor: alpha("#9D5CFF", 0.08),
					},
				},
				text: {
					"&:hover": {
						backgroundColor: alpha("#9D5CFF", 0.08),
					},
				},
			},
		},
	},
});

export const gradients = {
	primary: `linear-gradient(135deg, ${primaryMain} 0%, ${alpha(
		primaryMain,
		0.8
	)} 100%)`,
	secondary: `linear-gradient(135deg, ${secondaryMain} 0%, ${alpha(
		secondaryMain,
		0.8
	)} 100%)`,
};
