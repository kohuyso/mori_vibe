import '@/global.css';

import { Platform } from 'react-native';

/**
 * Stitch MD3 Design Tokens for Mori
 * Direct synchronization with design/stitch-ui.html
 */
export const StitchTokens = {
  colors: {
    primary: '#004ac6',
    primaryContainer: '#2563eb',
    secondary: '#1d4ed8',
    secondaryContainer: '#4069f2',
    onPrimary: '#ffffff',
    surface: '#faf8ff',
    surfaceDim: '#d2d9f4',
    surfaceBright: '#faf8ff',
    surfaceContainerLowest: '#ffffff',
    surfaceContainerLow: '#f2f3ff',
    surfaceContainer: '#eaedff',
    surfaceContainerHigh: '#e2e7ff',
    surfaceContainerHighest: '#dae2fd',
    onSurface: '#131b2e',
    onSurfaceVariant: '#434655',
    outline: '#737686',
    outlineVariant: '#c3c6d7',
    tertiary: '#006329',
    tertiaryContainer: '#007f36',
    onTertiaryContainer: '#c7ffca',
    error: '#ba1a1a',
  },
  timer: {
    size: 260,
    radius: 114,
    strokeWidth: 5,
    circumference: 716.28,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    marginMobile: 20,
  },
  radius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },
} as const;

export const Palette = {
  primary: StitchTokens.colors.primary,
  primaryDeep: StitchTokens.colors.secondary,
  primaryPale: StitchTokens.colors.surfaceContainerHigh,
  background: StitchTokens.colors.surface,
  surface: StitchTokens.colors.surfaceContainerLowest,
  textPrimary: StitchTokens.colors.onSurface,
  textSecondary: StitchTokens.colors.onSurfaceVariant,
  border: StitchTokens.colors.outlineVariant,
} as const;

export const Colors = {
  light: {
    text: StitchTokens.colors.onSurface,
    background: StitchTokens.colors.surface,
    backgroundElement: StitchTokens.colors.surfaceContainerLow,
    backgroundSelected: StitchTokens.colors.surfaceContainerHigh,
    textSecondary: StitchTokens.colors.onSurfaceVariant,
  },
  dark: {
    text: '#ffffff',
    background: '#0f172a',
    backgroundElement: '#1e293b',
    backgroundSelected: '#334155',
    textSecondary: '#94a3b8',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
