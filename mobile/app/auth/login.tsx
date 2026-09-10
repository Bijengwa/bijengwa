import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { useTheme } from '../../src/context/ThemeContext';
import { useLanguage } from '../../src/context/LanguageContext';

import { Logo } from '../../src/components/Logo';
import { LanguageButton } from '../../src/components/LanguageButton';
import { ThemeToggle } from '../../src/components/ThemeToggle';

import { spacing } from '../../src/constants/spacing';
import { typography } from '../../src/constants/typography';
import { themeConfig } from '../../src/constants/theme';

export default function LoginScreen() {
  const { colors } = useTheme();
  const { language } = useLanguage();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const isSwahili = language === 'sw';

  const handleLogin = () => {
    /*
      Backend integration comes here.

      POST /api/auth/login

      {
        identifier,
        password
      }
    */

    console.log({
      identifier,
      password,
    });
  };

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* TOP CONTROLS */}

          <View style={styles.topBar}>
            <LanguageButton />
            <ThemeToggle />
          </View>

          {/* BRAND */}

          <View style={styles.brandSection}>
            <Logo size="medium" />

            <Text
              style={[
                styles.tagline,
                {
                  color: colors.textSecondary,
                },
              ]}
            >
              {isSwahili
                ? 'Pata Mahali Pako'
                : 'Find Your Place'}
            </Text>
          </View>

          {/* LOGIN */}

          <View style={styles.formSection}>
            <Text
              style={[
                styles.title,
                {
                  color: colors.text,
                },
              ]}
            >
              {isSwahili
                ? 'Karibu Tena'
                : 'Welcome Back'}
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
                ? 'Ingia kwenye akaunti yako ya Bijengwa'
                : 'Login to your Bijengwa account'}
            </Text>

            {/* IDENTIFIER */}

            <View style={styles.field}>
              <Text
                style={[
                  styles.label,
                  {
                    color: colors.text,
                  },
                ]}
              >
                {isSwahili
                  ? 'Jina la mtumiaji, barua pepe au simu'
                  : 'Username, Email or Phone Number'}
              </Text>

              <TextInput
                value={identifier}
                onChangeText={setIdentifier}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                placeholder={
                  isSwahili
                    ? 'Jina la mtumiaji, barua pepe au namba ya simu'
                    : 'Username, email or phone number'
                }
                placeholderTextColor={colors.textMuted}
                style={[
                  styles.input,
                  {
                    backgroundColor:
                      colors.inputBackground,
                    borderColor: colors.border,
                    color: colors.text,
                  },
                ]}
              />
            </View>

            {/* PASSWORD */}

            <View style={styles.field}>
              <Text
                style={[
                  styles.label,
                  {
                    color: colors.text,
                  },
                ]}
              >
                {isSwahili
                  ? 'Nenosiri'
                  : 'Password'}
              </Text>

              <View
                style={[
                  styles.passwordWrapper,
                  {
                    backgroundColor:
                      colors.inputBackground,
                    borderColor: colors.border,
                  },
                ]}
              >
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholder={
                    isSwahili
                      ? 'Ingiza nenosiri lako'
                      : 'Enter your password'
                  }
                  placeholderTextColor={
                    colors.textMuted
                  }
                  style={[
                    styles.passwordInput,
                    {
                      color: colors.text,
                    },
                  ]}
                />

                <Pressable
                  onPress={() =>
                    setShowPassword(
                      (current) => !current
                    )
                  }
                  hitSlop={10}
                >
                  <Text
                    style={[
                      styles.showPassword,
                      {
                        color: colors.primary,
                      },
                    ]}
                  >
                    {showPassword
                      ? isSwahili
                        ? 'Ficha'
                        : 'Hide'
                      : isSwahili
                        ? 'Onyesha'
                        : 'Show'}
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* FORGOT PASSWORD */}

            <Pressable
              onPress={() =>
                router.push(
                  '/auth/forgot-password'
                )
              }
              style={styles.forgotButton}
            >
              <Text
                style={[
                  styles.forgotText,
                  {
                    color: colors.primary,
                  },
                ]}
              >
                {isSwahili
                  ? 'Umesahau nenosiri?'
                  : 'Forgot password?'}
              </Text>
            </Pressable>

            {/* LOGIN BUTTON */}

            <Pressable
              onPress={handleLogin}
              style={({ pressed }) => [
                styles.loginButton,
                {
                  backgroundColor:
                    colors.primary,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <Text style={styles.loginButtonText}>
                {isSwahili ? 'Ingia' : 'Login'}
              </Text>

              <Text style={styles.arrow}>
                →
              </Text>
            </Pressable>

            {/* REGISTER */}

            <View style={styles.registerRow}>
              <Text
                style={[
                  styles.registerText,
                  {
                    color: colors.textSecondary,
                  },
                ]}
              >
                {isSwahili
                  ? 'Huna akaunti? '
                  : "Don't have an account? "}
              </Text>

              <Pressable
                onPress={() =>
                  router.push(
                    '/auth/register'
                  )
                }
              >
                <Text
                  style={[
                    styles.registerLink,
                    {
                      color: colors.primary,
                    },
                  ]}
                >
                  {isSwahili
                    ? 'Jisajili'
                    : 'Register'}
                </Text>
              </Pressable>
            </View>
          </View>

          {/* FOOTER */}

          <View style={styles.footer}>
            <Text
              style={[
                styles.footerText,
                {
                  color: colors.textMuted,
                },
              ]}
            >
              {isSwahili
                ? 'Nyumba Bora • Maisha Bora'
                : 'Better Homes • Brighter Futures'}
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  keyboard: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.xxl,
    paddingBottom: spacing.xxxl,
  },

  topBar: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    paddingTop: spacing.sm,
  },

  brandSection: {
    alignItems: 'center',
    marginTop: spacing.huge,
  },

  tagline: {
    marginTop: spacing.md,
    fontSize: typography.md,
    fontWeight: '600',
  },

  formSection: {
    marginTop: spacing.xxxl,
  },

  title: {
    fontSize: typography.title,
    fontWeight: '900',
    letterSpacing: -0.8,
  },

  subtitle: {
    fontSize: typography.md,
    marginTop: spacing.sm,
    marginBottom: spacing.xxxl,
    lineHeight: 22,
  },

  field: {
    marginBottom: spacing.xl,
  },

  label: {
    fontSize: typography.sm,
    fontWeight: '800',
    marginBottom: spacing.sm,
  },

  input: {
    height: themeConfig.inputHeight,

    borderWidth: 1,
    borderRadius: themeConfig.borderRadius.md,

    paddingHorizontal: spacing.lg,

    fontSize: typography.md,
  },

  passwordWrapper: {
    height: themeConfig.inputHeight,

    borderWidth: 1,
    borderRadius: themeConfig.borderRadius.md,

    flexDirection: 'row',
    alignItems: 'center',

    paddingLeft: spacing.lg,
    paddingRight: spacing.md,
  },

  passwordInput: {
    flex: 1,
    height: '100%',
    fontSize: typography.md,
  },

  showPassword: {
    fontSize: typography.sm,
    fontWeight: '800',
  },

  forgotButton: {
    alignSelf: 'flex-end',
    marginTop: -spacing.sm,
    marginBottom: spacing.xxl,
  },

  forgotText: {
    fontSize: typography.sm,
    fontWeight: '800',
  },

  loginButton: {
    height: themeConfig.buttonHeight,

    borderRadius: themeConfig.borderRadius.md,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    gap: spacing.md,
  },

  loginButtonText: {
    color: '#FFFFFF',
    fontSize: typography.md,
    fontWeight: '900',
  },

  arrow: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
  },

  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',

    marginTop: spacing.xxl,
  },

  registerText: {
    fontSize: typography.sm,
  },

  registerLink: {
    fontSize: typography.sm,
    fontWeight: '900',
  },

  footer: {
    marginTop: 'auto',
    paddingTop: spacing.xxxl,
    alignItems: 'center',
  },

  footerText: {
    fontSize: typography.xs,
    fontWeight: '600',
  },
});