import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '../src/context/ThemeContext';
import { useLanguage } from '../src/context/LanguageContext';

export default function DashboardScreen() {
  const { colors } = useTheme();
  const { language } = useLanguage();

  const isSwahili = language === 'sw';

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>
          {isSwahili ? 'Karibu Bijengwa' : 'Welcome to Bijengwa'}
        </Text>

        <Text
          style={[
            styles.subtitle,
            { color: colors.textSecondary },
          ]}
        >
          {isSwahili
            ? 'Dashboard yako itakuja hapa.'
            : 'Your dashboard will appear here.'}
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  title: {
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '700',
    textAlign: 'center',
  },

  subtitle: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 21,
    textAlign: 'center',
  },
});