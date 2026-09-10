import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { themeConfig } from '../constants/theme';
import { typography } from '../constants/typography';
import { useTheme } from '../context/ThemeContext';
import { BijengwaMark } from './icons/BijengwaMark';

type LogoSize = 'small' | 'medium' | 'large';

type LogoProps = {
  size?: LogoSize;
  showWordmark?: boolean;
};

export function Logo({ size = 'medium', showWordmark = true }: LogoProps) {
  const { colors, isDark } = useTheme();
  const markSize = themeConfig.logo[size];

  return (
    <View
      style={styles.container}
      accessibilityRole="image"
      accessibilityLabel="Bijengwa"
    >
      <BijengwaMark
        size={markSize}
        variant={isDark ? 'onDark' : 'color'}
      />

      {showWordmark ? (
        <Text
          style={[
            styles.wordmark,
            {
              color: colors.text,
              fontSize: typography.wordmark[size],
            },
          ]}
        >
          BIJENGWA
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  wordmark: {
    marginTop: 6,
    fontWeight: typography.weight.semibold,
    letterSpacing: typography.letterSpacing.wordmark,
  },
});
