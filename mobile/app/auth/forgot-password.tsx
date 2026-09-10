import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { useTheme } from '../../src/context/ThemeContext';
import { useLanguage } from '../../src/context/LanguageContext';

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
        <Pressable onPress={() => router.back()}>
          <Text
            style={[
              styles.back,
              {
                color: colors.primary,
              },
            ]}
          >
            ← {isSwahili ? 'Rudi' : 'Back'}
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
    padding: 24,
  },

  back: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 50,
  },

  title: {
    fontSize: 30,
    fontWeight: '900',
  },

  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    marginTop: 12,
  },
});