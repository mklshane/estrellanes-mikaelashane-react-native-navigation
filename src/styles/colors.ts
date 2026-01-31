export type ThemeMode = "light" | "dark";

export type ThemeColors = {
  background: string;
  surface: string;
  card: string;
  text: string;
  mutedText: string;
  primary: string;
  primaryText: string;
  accent: string;
  border: string;
  success: string;
  warning: string;
  error: string;
};

export const themeColors: Record<ThemeMode, ThemeColors> = {
  light: {
    background: "#F7F9FB",
    surface: "#FFFFFF",
    card: "#FFFFFF",
    text: "#0F172A",
    mutedText: "#475569",
    primary: "#0EA5E9",
    primaryText: "#FFFFFF",
    accent: "#F59E0B",
    border: "#E2E8F0",
    success: "#22C55E",
    warning: "#F97316",
    error: "#EF4444",
  },
  dark: {
    background: "#0F172A",
    surface: "#1E293B",
    card: "#1E293B",
    text: "#E2E8F0",
    mutedText: "#94A3B8",
    primary: "#38BDF8",
    primaryText: "#0B1120",
    accent: "#FBBF24",
    border: "#334155",
    success: "#22C55E",
    warning: "#FB923C",
    error: "#F87171",
  },
};

export const getColorsFor = (mode: ThemeMode) => themeColors[mode];
