export const brand = {
  teal: '#0088B0',
  tealDark: '#006786',
  tealDeep: '#004961',
  tealBright: '#38A9CD',
  tealSoft: '#E9F8FF',
  steel: '#5980A6',
  key: '#DA9258',
  ink: '#201E1D',
  paper: '#F3F2F2',
} as const;

export const colors = {
  light: {
    background: '#F5F8FA',
    surface: '#FFFFFF',
    surfaceSecondary: '#EEF3F6',

    primary: '#0088B0',
    primaryDark: '#006786',
    primaryLight: '#E9F8FF',

    secondary: '#1F9A62',
    secondaryDark: '#16784B',
    secondaryLight: '#E5F6EE',

    accent: '#DA9258',
    steel: '#5980A6',

    text: '#1A242B',
    textSecondary: '#5B6B73',
    textMuted: '#8A9AA2',
    textOnPrimary: '#FFFFFF',

    border: '#D3DEE4',
    borderFocused: '#0088B0',
    inputBackground: '#FFFFFF',
    inputBorder: '#D3DEE4',

    icon: '#3D4F58',
    iconMuted: '#8A9AA2',

    skyline: '#C5D5DE',
    skylineAccent: '#7FB3C8',
    skylineWindow: '#8FD0C0',

    overlay: 'rgba(26, 36, 43, 0.08)',
    danger: '#D92D20',
    white: '#FFFFFF',
    black: '#000000',
  },

  dark: {
    background: '#0C151A',
    surface: '#152228',
    surfaceSecondary: '#1B2A32',

    primary: '#3BB7D8',
    primaryDark: '#2A9EBD',
    primaryLight: '#0F2F39',

    secondary: '#3DCC8A',
    secondaryDark: '#2AA970',
    secondaryLight: '#123528',

    accent: '#E0A06C',
    steel: '#7A9BB8',

    text: '#F2F6F8',
    textSecondary: '#B3C2C8',
    textMuted: '#7E9199',
    textOnPrimary: '#082028',

    border: '#2E4450',
    borderFocused: '#3BB7D8',
    inputBackground: '#1B2A32',
    inputBorder: '#2E4450',

    icon: '#D5E2E7',
    iconMuted: '#7E9199',

    skyline: '#24343C',
    skylineAccent: '#3A5A68',
    skylineWindow: '#2F6B62',

    overlay: 'rgba(0, 0, 0, 0.35)',
    danger: '#FF6B61',
    white: '#FFFFFF',
    black: '#000000',
  },
} as const;

export type ThemeMode = 'light' | 'dark';
export type ThemeColors = (typeof colors)[ThemeMode];
