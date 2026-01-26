import { Platform } from "react-native";

export const AppColors = {
  profitGreen: "#00D68F",
  warningAmber: "#FFB946",
  lossRed: "#FF4757",
  primaryAccent: "#0EA5E9",
  backgroundDark: "#0F172A",
  surface: "#1E293B",
  surfaceLight: "#334155",
  textPrimary: "#F1F5F9",
  textSecondary: "#94A3B8",
  border: "#475569",
};

export const Colors = {
  light: {
    text: "#F1F5F9",
    textSecondary: "#94A3B8",
    buttonText: "#FFFFFF",
    tabIconDefault: "#94A3B8",
    tabIconSelected: "#0EA5E9",
    link: "#0EA5E9",
    backgroundRoot: "#0F172A",
    backgroundDefault: "#1E293B",
    backgroundSecondary: "#334155",
    backgroundTertiary: "#475569",
    border: "#475569",
    profitGreen: "#00D68F",
    warningAmber: "#FFB946",
    lossRed: "#FF4757",
  },
  dark: {
    text: "#F1F5F9",
    textSecondary: "#94A3B8",
    buttonText: "#FFFFFF",
    tabIconDefault: "#94A3B8",
    tabIconSelected: "#0EA5E9",
    link: "#0EA5E9",
    backgroundRoot: "#0F172A",
    backgroundDefault: "#1E293B",
    backgroundSecondary: "#334155",
    backgroundTertiary: "#475569",
    border: "#475569",
    profitGreen: "#00D68F",
    warningAmber: "#FFB946",
    lossRed: "#FF4757",
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  "4xl": 40,
  "5xl": 48,
  inputHeight: 48,
  buttonHeight: 52,
};

export const BorderRadius = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 30,
  "2xl": 40,
  "3xl": 50,
  full: 9999,
};

export const Typography = {
  displayLarge: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: "700" as const,
  },
  h1: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "700" as const,
  },
  h2: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: "600" as const,
  },
  h3: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600" as const,
  },
  h4: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600" as const,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400" as const,
  },
  small: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400" as const,
  },
  dataLarge: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: "600" as const,
  },
  dataSmall: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500" as const,
  },
  link: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400" as const,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
