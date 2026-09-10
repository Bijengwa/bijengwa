import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { themeConfig } from '../constants/theme';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { MoonIcon } from './icons/MoonIcon';
import { SunIcon } from './icons/SunIcon';

export function ThemeToggle() {
  const { isDark, toggleTheme, colors } = useTheme();
  const { isSwahili } = useLanguage();

  return (
    <Pressable
      onPress={toggleTheme}
      accessibilityRole="button"
      accessibilityLabel={
        isDark
          ? isSwahili
            ? 'Badilisha kuwa hali ya mwanga'
            : 'Switch to light mode'
          : isSwahili
            ? 'Badilisha kuwa hali ya giza'
            : 'Switch to dark mode'
      }
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          opacity: pressed ? themeConfig.buttons.pressedOpacity : 1,
          transform: [
            { scale: pressed ? themeConfig.buttons.pressedScale : 1 },
          ],
        },
      ]}
    >
      {isDark ? (
        <MoonIcon size={themeConfig.icons.md} color={colors.icon} />
      ) : (
        <SunIcon size={themeConfig.icons.md} color={colors.icon} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: themeConfig.controls.themeToggleSize,
    height: themeConfig.controls.themeToggleSize,
    borderRadius: themeConfig.radius.pill,
    borderWidth: themeConfig.controls.borderWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
