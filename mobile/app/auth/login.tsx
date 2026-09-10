import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  SafeAreaView,
  initialWindowMetrics,
} from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { api, ApiError } from '../../src/api/api';
import { authLog } from '../../src/auth/log';
import { setSessionToken } from '../../src/auth/session';
import { CitySkyline } from '../../src/components/CitySkyline';
import { LanguageButton } from '../../src/components/LanguageButton';
import { Logo } from '../../src/components/Logo';
import { ThemeToggle } from '../../src/components/ThemeToggle';
import { ArrowRightIcon } from '../../src/components/icons/ArrowRightIcon';
import { EmailIcon } from '../../src/components/icons/EmailIcon';
import { EyeIcon } from '../../src/components/icons/EyeIcon';
import { EyeOffIcon } from '../../src/components/icons/EyeOffIcon';
import { LockIcon } from '../../src/components/icons/LockIcon';
import { spacing } from '../../src/constants/spacing';
import { themeConfig } from '../../src/constants/theme';
import { typography } from '../../src/constants/typography';
import { useLanguage } from '../../src/context/LanguageContext';
import { useTheme } from '../../src/context/ThemeContext';

export default function LoginScreen() {
  const { colors, isDark } = useTheme();
  const { language } = useLanguage();
  const passwordRef = useRef<TextInput>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const isSwahili = language === 'sw';

  const handleLogin = async () => {
    if (loading) return;

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setErrorMessage(
        isSwahili
          ? 'Tafadhali weka barua pepe yako.'
          : 'Please enter your email address.',
      );
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setErrorMessage(
        isSwahili
          ? 'Tafadhali weka barua pepe sahihi.'
          : 'Please enter a valid email address.',
      );
      return;
    }

    if (!password) {
      setErrorMessage(
        isSwahili
          ? 'Tafadhali weka nenosiri lako.'
          : 'Please enter your password.',
      );
      return;
    }

    setErrorMessage('');
    setLoading(true);
    authLog('Login request started');

    try {
      const response = await api.post<{
        token?: string;
        verification_required?: boolean;
      }>('/auth/login', {
        email: normalizedEmail,
        password,
      });

      authLog('Login response: 200');

      const token = response.data?.token;

      if (token) {
        setSessionToken(token);
      }

      authLog('Login successful');
      router.replace('/dashboard');
    } catch (error) {
      if (error instanceof ApiError) {
        authLog(`Login failed: ${error.status ?? 'network'}`);

        const verificationRequired =
          error.status === 403 &&
          typeof error.data === 'object' &&
          error.data !== null &&
          'verification_required' in error.data &&
          Boolean(
            (error.data as { verification_required?: boolean })
              .verification_required,
          );

        if (verificationRequired || error.status === 403) {
          router.replace({
            pathname: '/auth/verify',
            params: {
              email: normalizedEmail,
            },
          });
          return;
        }

        if (error.status === 401) {
          setErrorMessage(
            isSwahili
              ? 'Barua pepe au nenosiri si sahihi.'
              : 'Invalid email or password.',
          );
          return;
        }

        if (error.status === 429) {
          setErrorMessage(
            isSwahili
              ? 'Majaribio mengi sana. Tafadhali jaribu tena baadaye.'
              : 'Too many login attempts. Please try again later.',
          );
          return;
        }

        setErrorMessage(
          error.message ||
            (isSwahili
              ? 'Kuna tatizo. Tafadhali jaribu tena.'
              : 'Something went wrong. Please try again.'),
        );
        return;
      }

      authLog('Login failed: network');
      setErrorMessage(
        isSwahili
          ? 'Imeshindikana kuungana na seva. Tafadhali jaribu tena.'
          : 'Unable to connect to the server. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      edges={['top']}
      style={[
        styles.safeArea,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.topBar}>
            <LanguageButton />
            <ThemeToggle />
          </View>

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
                ? 'Pata Mahali. Jenga Kitu.'
                : 'Find a Place. Build Something.'}
            </Text>
          </View>

          <View style={styles.formSection}>
            <Text
              style={[
                styles.title,
                {
                  color: colors.text,
                },
              ]}
            >
              {isSwahili ? 'Karibu Tena' : 'Welcome Back'}
            </Text>

            {errorMessage ? (
              <View
                accessibilityRole="alert"
                style={[
                  styles.errorBox,
                  {
                    backgroundColor: colors.primaryLight,
                    borderColor: colors.danger,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.errorText,
                    {
                      color: colors.danger,
                    },
                  ]}
                >
                  {errorMessage}
                </Text>
              </View>
            ) : null}

            <View style={styles.field}>
              <Text
                style={[
                  styles.label,
                  {
                    color: colors.text,
                  },
                ]}
              >
                {isSwahili ? 'Barua pepe' : 'Email'}
              </Text>

              <View
                style={[
                  styles.inputShell,
                  {
                    backgroundColor: colors.inputBackground,
                    borderColor: emailFocused
                      ? colors.borderFocused
                      : colors.inputBorder,
                  },
                ]}
              >
                <EmailIcon
                  size={themeConfig.icons.md}
                  color={
                    emailFocused ? colors.primary : colors.iconMuted
                  }
                />

                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  blurOnSubmit={false}
                  onSubmitEditing={() => passwordRef.current?.focus()}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="email"
                  textContentType="emailAddress"
                  keyboardType="email-address"
                  returnKeyType="next"
                  placeholder={
                    isSwahili
                      ? 'Weka barua pepe yako'
                      : 'Enter your email'
                  }
                  placeholderTextColor={colors.textMuted}
                  cursorColor={colors.primary}
                  selectionColor={colors.primary}
                  accessibilityLabel={
                    isSwahili ? 'Barua pepe' : 'Email'
                  }
                  style={[
                    styles.input,
                    {
                      color: colors.text,
                    },
                  ]}
                />
              </View>
            </View>

            <View style={styles.field}>
              <Text
                style={[
                  styles.label,
                  {
                    color: colors.text,
                  },
                ]}
              >
                {isSwahili ? 'Nenosiri' : 'Password'}
              </Text>

              <View
                style={[
                  styles.inputShell,
                  {
                    backgroundColor: colors.inputBackground,
                    borderColor: passwordFocused
                      ? colors.borderFocused
                      : colors.inputBorder,
                  },
                ]}
              >
                <LockIcon
                  size={themeConfig.icons.md}
                  color={passwordFocused ? colors.primary : colors.iconMuted}
                />

                <TextInput
                  ref={passwordRef}
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  onSubmitEditing={handleLogin}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="password"
                  textContentType="password"
                  returnKeyType="done"
                  placeholder={
                    isSwahili
                      ? 'Ingiza nenosiri lako'
                      : 'Enter your password'
                  }
                  placeholderTextColor={colors.textMuted}
                  cursorColor={colors.primary}
                  selectionColor={colors.primary}
                  accessibilityLabel={
                    isSwahili ? 'Nenosiri' : 'Password'
                  }
                  style={[
                    styles.input,
                    {
                      color: colors.text,
                    },
                  ]}
                />

                <Pressable
                  onPress={() => setShowPassword((current) => !current)}
                  hitSlop={10}
                  accessibilityRole="button"
                  accessibilityLabel={
                    showPassword
                      ? isSwahili
                        ? 'Ficha nenosiri'
                        : 'Hide password'
                      : isSwahili
                        ? 'Onyesha nenosiri'
                        : 'Show password'
                  }
                  style={styles.visibilityButton}
                >
                  {showPassword ? (
                    <EyeOffIcon
                      size={themeConfig.icons.md}
                      color={colors.icon}
                    />
                  ) : (
                    <EyeIcon
                      size={themeConfig.icons.md}
                      color={colors.icon}
                    />
                  )}
                </Pressable>
              </View>
            </View>

            <Pressable
              onPress={() => router.push('/auth/forgot-password')}
              accessibilityRole="button"
              accessibilityLabel={
                isSwahili ? 'Umesahau nenosiri?' : 'Forgot password?'
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
                {isSwahili ? 'Umesahau nenosiri?' : 'Forgot password?'}
              </Text>
            </Pressable>

            <Pressable
              onPress={handleLogin}
              disabled={loading}
              accessibilityRole="button"
              accessibilityState={{ disabled: loading }}
              accessibilityLabel={isSwahili ? 'Ingia' : 'Login'}
              style={({ pressed }) => [
                styles.loginButton,
                {
                  backgroundColor: pressed
                    ? colors.primaryDark
                    : colors.primary,
                  opacity: loading ? 0.65 : 1,
                  transform: [
                    {
                      scale: pressed
                        ? themeConfig.buttons.pressedScale
                        : 1,
                    },
                  ],
                },
                !isDark ? themeConfig.shadows.light : themeConfig.shadows.none,
              ]}
            >
              {loading ? (
                <ActivityIndicator
                  size="small"
                  color={colors.textOnPrimary}
                />
              ) : (
                <>
                  <Text
                    style={[
                      styles.loginButtonText,
                      {
                        color: colors.textOnPrimary,
                      },
                    ]}
                  >
                    {isSwahili ? 'Ingia' : 'Login'}
                  </Text>

                  <ArrowRightIcon
                    size={themeConfig.icons.md}
                    color={colors.textOnPrimary}
                  />
                </>
              )}
            </Pressable>

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
                onPress={() => router.push('/auth/register')}
                accessibilityRole="button"
                accessibilityLabel={
                  isSwahili ? 'Jisajili' : 'Register'
                }
                hitSlop={8}
              >
                <Text
                  style={[
                    styles.registerLink,
                    {
                      color: colors.primary,
                    },
                  ]}
                >
                  {isSwahili ? 'Jisajili' : 'Register'}
                </Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.bottomVisual}>
            <CitySkyline colors={colors} />

            <Text
              style={[
                styles.footerText,
                {
                  color: colors.textMuted,
                },
              ]}
            >
              {isSwahili
                ? 'Mahali pa kuishi, kufanya kazi na biashara'
                : 'Places for living, working, and business'}
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
    paddingHorizontal: themeConfig.screen.paddingHorizontal,
    paddingBottom:
      (initialWindowMetrics?.insets.bottom ?? 0) + spacing.lg + spacing.md,
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
    marginTop: themeConfig.screen.brandGap,
  },
  tagline: {
    marginTop: spacing.md,
    fontSize: typography.md,
    fontWeight: typography.weight.medium,
    textAlign: 'center',
  },
  formSection: {
    marginTop: themeConfig.screen.sectionGap - spacing.lg,
  },
  title: {
    fontSize: typography.title,
    fontWeight: typography.weight.heavy,
    letterSpacing: typography.letterSpacing.tight,
  },
  errorBox: {
    borderWidth: 1,
    borderRadius: themeConfig.radius.md,
    padding: spacing.md,
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  errorText: {
    fontSize: typography.sm,
    lineHeight: 20,
    fontWeight: typography.weight.medium,
  },
  subtitle: {
    fontSize: typography.md,
    marginTop: spacing.sm,
    marginBottom: spacing.xxxl,
    lineHeight: 22,
  },
  field: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: typography.sm,
    fontWeight: typography.weight.bold,
    marginBottom: spacing.sm,
  },
  inputShell: {
    height: themeConfig.inputs.height,
    borderWidth: themeConfig.inputs.borderWidth,
    borderRadius: themeConfig.inputs.radius,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: themeConfig.inputs.paddingHorizontal,
    paddingRight: spacing.sm,
    gap: themeConfig.inputs.iconGap,
  },
  input: {
    flex: 1,
    fontSize: typography.md,
    paddingVertical: 0,
  },
  visibilityButton: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginTop: -spacing.sm,
    marginBottom: spacing.xxl,
    minHeight: 32,
    justifyContent: 'center',
  },
  forgotText: {
    fontSize: typography.sm,
    fontWeight: typography.weight.bold,
  },
  loginButton: {
    minHeight: themeConfig.buttons.height,
    borderRadius: themeConfig.buttons.radius,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: themeConfig.buttons.iconGap,
  },
  loginButtonText: {
    fontSize: typography.md,
    fontWeight: typography.weight.heavy,
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: spacing.xxl,
  },
  registerText: {
    fontSize: typography.sm,
  },
  registerLink: {
    fontSize: typography.sm,
    fontWeight: typography.weight.heavy,
  },
  bottomVisual: {
    marginTop: 'auto',
    paddingTop: spacing.xl,
    alignItems: 'center',
    minHeight: 150,
  },
  footerText: {
    marginTop: spacing.md,
    fontSize: typography.xs,
    fontWeight: typography.weight.medium,
    textAlign: 'center',
  },
});
