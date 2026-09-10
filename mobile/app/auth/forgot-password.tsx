import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { ArrowLeftIcon } from '../../src/components/icons/ArrowLeftIcon';
import { themeConfig } from '../../src/constants/theme';
import { typography } from '../../src/constants/typography';
import { useLanguage } from '../../src/context/LanguageContext';
import { useTheme } from '../../src/context/ThemeContext';

export default function ForgotPasswordScreen() {
  const { colors } = useTheme();
  const { language } = useLanguage();

  const isSwahili = language === 'sw';

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <View style={styles.content}>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel={isSwahili ? 'Rudi' : 'Back'}
          hitSlop={8}
          style={styles.backButton}
        >
          <ArrowLeftIcon
            size={themeConfig.icons.md}
            color={colors.primary}
          />
          <Text
            style={[
              styles.back,
              {
                color: colors.primary,
              },
            ]}
          >
            {isSwahili ? 'Rudi' : 'Back'}
          </Text>
        </Pressable>

        <Text
          style={[
            styles.title,
            {
              color: colors.text,
            },
          ]}
        >
          {isSwahili
            ? 'Umesahau Nenosiri?'
            : 'Forgot Password?'}
        </Text>

        <Text
          style={[
            styles.subtitle,
            {
              color: colors.textSecondary,
            },
          ]}
        >
          {isSwahili
            ? 'Tutaweka mfumo wa kurejesha nenosiri hapa.'
            : 'Password recovery will be implemented here.'}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: themeConfig.screen.paddingHorizontal,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 50,
    minHeight: 44,
  },
  back: {
    fontSize: typography.md,
    fontWeight: typography.weight.bold,
  },
  title: {
    fontSize: typography.title,
    fontWeight: typography.weight.heavy,
  },
  subtitle: {
    fontSize: typography.lg,
    lineHeight: 24,
    marginTop: 12,
  },
});
