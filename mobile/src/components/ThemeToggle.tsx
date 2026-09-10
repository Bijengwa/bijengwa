import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
} from 'react-native';

import { useTheme } from '../context/ThemeContext';

export function ThemeToggle() {
  const { isDark, toggleTheme, colors } = useTheme();

  return (
    <Pressable
      onPress={toggleTheme}
      accessibilityRole="button"
      accessibilityLabel={
        isDark
          ? 'Switch to light mode'
          : 'Switch to dark mode'
      }
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <Text
        style={[
          styles.icon,
          {
            color: colors.text,
          },
        ]}
      >
        {isDark ? '☾' : '☀'}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 42,
    height: 42,

    borderRadius: 999,
    borderWidth: 1,

    alignItems: 'center',
    justifyContent: 'center',
  },

  icon: {
    fontSize: 20,
    fontWeight: '700',
  },
});