import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

export function LanguageButton() {
  const { language, toggleLanguage } = useLanguage();
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={toggleLanguage}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <Text style={styles.flag}>🇹🇿</Text>

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

      <Text
        style={[
          styles.arrow,
          {
            color: colors.textSecondary,
          },
        ]}
      >
        ▾
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 42,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,

    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  flag: {
    fontSize: 18,
  },

  language: {
    fontSize: 13,
    fontWeight: '800',
  },

  arrow: {
    fontSize: 13,
    marginTop: -2,
  },
});