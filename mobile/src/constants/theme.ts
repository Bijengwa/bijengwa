export const themeConfig = {
  radius: {
    sm: 10,
    md: 14,
    lg: 18,
    xl: 24,
    pill: 999,
  },

  buttons: {
    height: 54,
    heightCompact: 42,
    radius: 14,
    iconGap: 10,
    pressedOpacity: 0.86,
    pressedScale: 0.985,
  },

  inputs: {
    height: 54,
    radius: 14,
    paddingHorizontal: 16,
    iconGap: 10,
    borderWidth: 1,
  },

  icons: {
    sm: 16,
    md: 20,
    lg: 24,
    xl: 28,
  },

  logo: {
    small: 36,
    medium: 56,
    large: 72,
  },

  controls: {
    height: 42,
    themeToggleSize: 42,
    paddingHorizontal: 12,
    gap: 6,
    borderWidth: 1,
  },

  screen: {
    paddingHorizontal: 24,
    sectionGap: 32,
    brandGap: 40,
  },

  skyline: {
    height: 128,
  },

  header: {
    controlGap: 12,
  },

  cards: {
    radius: 18,
    padding: 16,
  },

  shadows: {
    light: {
      shadowColor: '#1A242B',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.08,
      shadowRadius: 18,
      elevation: 3,
    },
    soft: {
      shadowColor: '#1A242B',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 1,
    },
    none: {
      shadowColor: 'transparent',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
  },

  // Backward-compatible aliases used by existing screens
  borderRadius: {
    sm: 10,
    md: 14,
    lg: 18,
    xl: 24,
    pill: 999,
  },
  buttonHeight: 54,
  inputHeight: 54,
} as const;
