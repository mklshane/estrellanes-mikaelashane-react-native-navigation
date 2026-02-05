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
  ctaGreen: string;
  border: string;
  success: string;
  warning: string;
  error: string;
};

export const themeColors: Record<ThemeMode, ThemeColors> = {
  light: {
    background: "#FFFFFF",
    surface: "#F4F4F4",
    card: "#FFFFFF",
    text: "#0F172A",
    mutedText: "#475569",
    primary: "#0EA5E9",
    primaryText: "#FFFFFF",
    accent: "#F59E0B",
    ctaGreen: "#81D14F",
    border: "#E2E8F0",
    success: "#22C55E",
    warning: "#F97316",
    error: "#EF4444",
  },
  dark: {
    background: "#181818",
    surface: "#212121",
    card: "#2f2f2f",
    text: "#E2E8F0",
    mutedText: "#9ca6b3",
    primary: "#38BDF8",
    primaryText: "#0B1120",
    accent: "#FBBF24",
    ctaGreen: "#81D14F",
    border: "#464646",
    success: "#22C55E",
    warning: "#FB923C",
    error: "#F87171",
  },
};

export const getColorsFor = (mode: ThemeMode) => themeColors[mode];
