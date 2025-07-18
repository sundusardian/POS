// Theme configuration for the admin dashboard
export const adminTheme = {
  colors: {
    primary: {
      DEFAULT: "#0ea5e9", // Sky blue as primary color
      hover: "#0284c7",
      light: "#e0f2fe",
      dark: "#0369a1",
    },
    secondary: {
      DEFAULT: "#8b5cf6", // Purple as secondary color
      hover: "#7c3aed",
      light: "#f3e8ff",
      dark: "#6d28d9",
    },
    accent: {
      DEFAULT: "#f59e0b", // Amber as accent color
      hover: "#d97706",
      light: "#fef3c7",
      dark: "#b45309",
    },
    success: {
      DEFAULT: "#10b981", // Green
      light: "#d1fae5",
    },
    warning: {
      DEFAULT: "#f59e0b", // Amber
      light: "#fef3c7",
    },
    danger: {
      DEFAULT: "#ef4444", // Red
      light: "#fee2e2",
    },
    info: {
      DEFAULT: "#3b82f6", // Blue
      light: "#dbeafe",
    },
  },
  animations: {
    fadeIn: "animate-fadeIn",
    slideIn: "animate-slideIn",
    pulse: "animate-pulse",
    bounce: "animate-bounce",
    spin: "animate-spin",
  },
  transitions: {
    fast: "transition-all duration-150 ease-in-out",
    medium: "transition-all duration-300 ease-in-out",
    slow: "transition-all duration-500 ease-in-out",
  },
};
