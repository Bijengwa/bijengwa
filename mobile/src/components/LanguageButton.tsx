import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { themeConfig } from '../constants/theme';
import { typography } from '../constants/typography';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { LanguageIcon } from './icons/LanguageIcon';

export function LanguageButton() {
  const { language, toggleLanguage, isSwahili } = useLanguage();
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={toggleLanguage}
      accessibilityRole="button"
      accessibilityLabel={
        isSwahili
          ? 'Badilisha lugha. Lugha ya sasa ni Kiswahili'
          : 'Change language. Current language is English'
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
      <LanguageIcon
        size={themeConfig.icons.sm}
        color={colors.icon}
      />

      <Text
        style={[
          styles.language,
          {
            color: colors.text,
          },
        ]}
      >
        {language === 'en' ? 'EN' : 'SW'}
      </Text>

      <ChevronDownIcon
        size={themeConfig.icons.sm}
        color={colors.iconMuted}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: themeConfig.controls.height,
    paddingHorizontal: themeConfig.controls.paddingHorizontal,
    borderRadius: themeConfig.radius.pill,
    borderWidth: themeConfig.controls.borderWidth,
    flexDirection: 'row',
    alignItems: 'center',
    gap: themeConfig.controls.gap,
  },
  language: {
    fontSize: typography.sm,
    fontWeight: typography.weight.bold,
  },
});
