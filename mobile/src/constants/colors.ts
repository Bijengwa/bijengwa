export const colors = {
  light: {
    background: '#F7FAF8',
    surface: '#FFFFFF',
    surfaceSecondary: '#F0F5F2',

    primary: '#18A957',
    primaryDark: '#128344',
    primaryLight: '#DDF5E7',

    secondary: '#208AEF',
    secondaryDark: '#126DC4',
    secondaryLight: '#DCEEFF',

    text: '#10251A',
    textSecondary: '#63736A',
    textMuted: '#8A9890',

    border: '#DCE5DF',
    inputBackground: '#F8FAF9',

    danger: '#D92D20',
    white: '#FFFFFF',
    black: '#000000',
  },

  dark: {
    background: '#0B1210',
    surface: '#121B17',
    surfaceSecondary: '#18241E',

    primary: '#35C875',
    primaryDark: '#20A95C',
    primaryLight: '#123B25',

    secondary: '#4CA5FF',
    secondaryDark: '#208AEF',
    secondaryLight: '#102A42',

    text: '#FFFFFF',
    textSecondary: '#B4C0B9',
    textMuted: '#7F8E85',

    border: '#29362F',
    inputBackground: '#17211C',

    danger: '#FF6B61',
    white: '#FFFFFF',
    black: '#000000',
  },
} as const;

export type ThemeMode = 'light' | 'dark';