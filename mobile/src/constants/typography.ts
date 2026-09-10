export const typography = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  title: 28,
  hero: 34,

  wordmark: {
    small: 18,
    medium: 24,
    large: 30,
  },

  weight: {
    regular: '400' as const,
    medium: '600' as const,
    semibold: '700' as const,
    bold: '800' as const,
    heavy: '900' as const,
  },

  letterSpacing: {
    tight: -0.6,
    normal: 0,
    wordmark: 2.4,
  },
} as const;
