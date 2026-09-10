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
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { api, ApiError } from '../../src/api/api';
import { CitySkyline } from '../../src/components/CitySkyline';
import { LanguageButton } from '../../src/components/LanguageButton';
import { Logo } from '../../src/components/Logo';
import { ThemeToggle } from '../../src/components/ThemeToggle';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  UserIcon,
} from '../../src/components/icons';
import { useLanguage } from '../../src/context/LanguageContext';
import { useTheme } from '../../src/context/ThemeContext';
import { themeConfig } from '../../src/constants/theme';
import { spacing } from '../../src/constants/spacing';
import { typography } from '../../src/constants/typography';

export default function RegisterScreen() {
  const { colors, isDark } = useTheme();
  const { language } = useLanguage();
  const insets = useSafeAreaInsets();

  const isSwahili = language === 'sw';

  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] =
    useState(false);

  const [fullNameFocused, setFullNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);

  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const validate = () => {
    const name = fullName.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (!name) {
      return isSwahili
        ? 'Tafadhali weka jina lako kamili.'
        : 'Please enter your full name.';
    }

    if (name.length < 2) {
      return isSwahili
        ? 'Jina lako ni fupi sana.'
        : 'Your name is too short.';
    }

    if (!normalizedEmail) {
      return isSwahili
        ? 'Tafadhali weka barua pepe yako.'
        : 'Please enter your email address.';
    }

    const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);

    if (!emailIsValid) {
      return isSwahili
        ? 'Tafadhali weka barua pepe sahihi.'
        : 'Please enter a valid email address.';
    }

    if (password.length < 8) {
      return isSwahili
        ? 'Nenosiri lazima liwe na angalau herufi 8.'
        : 'Password must be at least 8 characters.';
    }

    if (password !== confirmPassword) {
      return isSwahili
        ? 'Nenosiri halilingani.'
        : 'Passwords do not match.';
    }

    if (!consent) {
      return isSwahili
        ? 'Tafadhali kubali Masharti na Sera ya Faragha.'
        : 'Please agree to the Terms and Privacy Policy.';
    }

    return null;
  };

  const handleRegister = async () => {
    if (loading) return;

    setErrorMessage('');

    const validationError = validate();

    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    try {
      setLoading(true);

      await api.post('/auth/register', {
        full_name: fullName.trim(),
        email: email.trim().toLowerCase(),
        password,
        confirm_password: confirmPassword,
      });

      router.replace({
        pathname: '/auth/verify',
        params: {
          email: email.trim().toLowerCase(),
        },
      });
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 409) {
          setErrorMessage(
            isSwahili
              ? 'Akaunti yenye barua pepe hii tayari ipo.'
              : 'An account with this email already exists.',
          );
        } else {
          setErrorMessage(error.message);
        }
      } else {
        setErrorMessage(
          isSwahili
            ? 'Kuna tatizo. Tafadhali jaribu tena.'
            : 'Something went wrong. Please try again.',
        );
      }
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
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingBottom: Math.max(insets.bottom, spacing.lg) + spacing.md,
            },
          ]}
        >
          <View style={styles.topControls}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={
                isSwahili ? 'Rudi kwenye kuingia' : 'Back to login'
              }
              onPress={() => router.back()}
              style={[
                styles.backButton,
                {
                  borderColor: colors.border,
                  backgroundColor: colors.surface,
                },
              ]}
            >
              <ArrowLeftIcon size={20} color={colors.icon} />

              <Text
                style={[
                  styles.backText,
                  {
                    color: colors.text,
                  },
                ]}
              >
                {isSwahili ? 'Ingia' : 'Login'}
              </Text>
            </Pressable>

            <View style={styles.headerControls}>
              <LanguageButton />
              <ThemeToggle />
            </View>
          </View>

          <View style={styles.brandSection}>
            <Logo size="medium" />

            <Text
              style={[
                styles.tagline,
                {
                  color: colors.text,
                },
              ]}
            >
              {isSwahili
                ? 'Pata Mahali. Jenga Kitu.'
                : 'Find a Place. Build Something.'}
            </Text>
          </View>

          <View style={styles.form}>
            <Text
              style={[
                styles.heading,
                {
                  color: colors.text,
                },
              ]}
            >
              {isSwahili ? 'Jisajili' : 'Create Account'}
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
                {isSwahili ? 'Jina kamili' : 'Full name'}
              </Text>

              <View
                style={[
                  styles.inputShell,
                  {
                    backgroundColor: colors.inputBackground,
                    borderColor: fullNameFocused
                      ? colors.borderFocused
                      : colors.inputBorder,
                  },
                ]}
              >
                <UserIcon size={20} color={colors.icon} />

                <TextInput
                  value={fullName}
                  onChangeText={setFullName}
                  onFocus={() => setFullNameFocused(true)}
                  onBlur={() => setFullNameFocused(false)}
                  placeholder={
                    isSwahili ? 'Jina lako kamili' : 'Your full name'
                  }
                  placeholderTextColor={colors.textMuted}
                  style={[
                    styles.input,
                    {
                      color: colors.text,
                    },
                  ]}
                  autoCapitalize="words"
                  autoCorrect={false}
                  autoComplete="name"
                  textContentType="name"
                  returnKeyType="next"
                  onSubmitEditing={() => passwordRef.current?.focus()}
                  accessibilityLabel={
                    isSwahili ? 'Jina kamili' : 'Full name'
                  }
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
                {isSwahili ? 'Barua pepe' : 'Email address'}
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
                <UserIcon size={20} color={colors.icon} />

                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  placeholder={
                    isSwahili
                      ? 'Weka barua pepe yako'
                      : 'Enter your email address'
                  }
                  placeholderTextColor={colors.textMuted}
                  style={[
                    styles.input,
                    {
                      color: colors.text,
                    },
                  ]}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="email"
                  textContentType="emailAddress"
                  returnKeyType="next"
                  accessibilityLabel={
                    isSwahili ? 'Barua pepe' : 'Email address'
                  }
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
                <LockIcon size={20} color={colors.icon} />

                <TextInput
                  ref={passwordRef}
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  placeholder={
                    isSwahili ? 'Weka nenosiri' : 'Create a password'
                  }
                  placeholderTextColor={colors.textMuted}
                  style={[
                    styles.input,
                    {
                      color: colors.text,
                    },
                  ]}
                  secureTextEntry={!passwordVisible}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="new-password"
                  textContentType="newPassword"
                  returnKeyType="next"
                  onSubmitEditing={() =>
                    confirmPasswordRef.current?.focus()
                  }
                  accessibilityLabel={
                    isSwahili ? 'Nenosiri' : 'Password'
                  }
                />

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={
                    passwordVisible
                      ? isSwahili
                        ? 'Ficha nenosiri'
                        : 'Hide password'
                      : isSwahili
                        ? 'Onyesha nenosiri'
                        : 'Show password'
                  }
                  hitSlop={8}
                  onPress={() => setPasswordVisible((value) => !value)}
                >
                  {passwordVisible ? (
                    <EyeOffIcon size={20} color={colors.iconMuted} />
                  ) : (
                    <EyeIcon size={20} color={colors.iconMuted} />
                  )}
                </Pressable>
              </View>

              <Text
                style={[
                  styles.helperText,
                  {
                    color: colors.textMuted,
                  },
                ]}
              >
                {isSwahili
                  ? 'Angalau herufi 8.'
                  : 'At least 8 characters.'}
              </Text>
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
                {isSwahili ? 'Thibitisha nenosiri' : 'Confirm password'}
              </Text>

              <View
                style={[
                  styles.inputShell,
                  {
                    backgroundColor: colors.inputBackground,
                    borderColor: confirmPasswordFocused
                      ? colors.borderFocused
                      : colors.inputBorder,
                  },
                ]}
              >
                <LockIcon size={20} color={colors.icon} />

                <TextInput
                  ref={confirmPasswordRef}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  onFocus={() => setConfirmPasswordFocused(true)}
                  onBlur={() => setConfirmPasswordFocused(false)}
                  placeholder={
                    isSwahili
                      ? 'Rudia nenosiri'
                      : 'Re-enter your password'
                  }
                  placeholderTextColor={colors.textMuted}
                  style={[
                    styles.input,
                    {
                      color: colors.text,
                    },
                  ]}
                  secureTextEntry={!confirmPasswordVisible}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="new-password"
                  textContentType="newPassword"
                  returnKeyType="done"
                  onSubmitEditing={handleRegister}
                  accessibilityLabel={
                    isSwahili
                      ? 'Thibitisha nenosiri'
                      : 'Confirm password'
                  }
                />

                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={
                    confirmPasswordVisible
                      ? isSwahili
                        ? 'Ficha nenosiri'
                        : 'Hide password'
                      : isSwahili
                        ? 'Onyesha nenosiri'
                        : 'Show password'
                  }
                  hitSlop={8}
                  onPress={() =>
                    setConfirmPasswordVisible((value) => !value)
                  }
                >
                  {confirmPasswordVisible ? (
                    <EyeOffIcon size={20} color={colors.iconMuted} />
                  ) : (
                    <EyeIcon size={20} color={colors.iconMuted} />
                  )}
                </Pressable>
              </View>
            </View>

            <Pressable
              accessibilityRole="checkbox"
              accessibilityState={{ checked: consent }}
              onPress={() => setConsent((value) => !value)}
              style={styles.consentRow}
            >
              <View
                style={[
                  styles.checkbox,
                  {
                    borderColor: consent
                      ? colors.primary
                      : colors.border,
                    backgroundColor: consent
                      ? colors.primary
                      : colors.surface,
                  },
                ]}
              >
                {consent ? (
                  <Text
                    style={[
                      styles.checkmark,
                      {
                        color: colors.textOnPrimary,
                      },
                    ]}
                  >
                    ✓
                  </Text>
                ) : null}
              </View>

              <Text
                style={[
                  styles.consentText,
                  {
                    color: colors.textSecondary,
                  },
                ]}
              >
                {isSwahili
                  ? 'Nakubali Masharti ya Matumizi na Sera ya Faragha ya Bijengwa.'
                  : 'I agree to the Bijengwa Terms of Use and Privacy Policy.'}
              </Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityState={{ disabled: loading }}
              disabled={loading}
              onPress={handleRegister}
              style={({ pressed }) => [
                styles.submitButton,
                {
                  backgroundColor: colors.primary,
                  opacity: loading
                    ? 0.65
                    : pressed
                      ? themeConfig.buttons.pressedOpacity
                      : 1,
                },
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
                      styles.submitText,
                      {
                        color: colors.textOnPrimary,
                      },
                    ]}
                  >
                    {isSwahili ? 'Tengeneza akaunti' : 'Create account'}
                  </Text>

                  <ArrowRightIcon
                    size={20}
                    color={colors.textOnPrimary}
                  />
                </>
              )}
            </Pressable>

            <View style={styles.loginPrompt}>
              <Text
                style={[
                  styles.loginPromptText,
                  {
                    color: colors.textSecondary,
                  },
                ]}
              >
                {isSwahili
                  ? 'Tayari una akaunti?'
                  : 'Already have an account?'}
              </Text>

              <Pressable
                accessibilityRole="link"
                onPress={() => router.replace('/auth/login')}
              >
                <Text
                  style={[
                    styles.loginLink,
                    {
                      color: colors.primary,
                    },
                  ]}
                >
                  {isSwahili ? 'Ingia' : 'Login'}
                </Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.skylineContainer}>
            <CitySkyline colors={colors} />
          </View>

          <Text
            style={[
              styles.footer,
              {
                color: colors.textMuted,
              },
            ]}
          >
            {isSwahili
              ? 'Mahali pa kuishi, kufanya kazi na biashara'
              : 'Places for living, working, and business'}
          </Text>
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
    paddingTop: spacing.md,
  },

  topControls: {
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  backButton: {
    minHeight: themeConfig.controls.height,
    paddingHorizontal: spacing.sm,
    borderWidth: themeConfig.controls.borderWidth,
    borderRadius: themeConfig.radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },

  backText: {
    fontSize: typography.sm,
    fontWeight: typography.weight.semibold,
  },

  headerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: themeConfig.header.controlGap,
  },

  brandSection: {
    alignItems: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },

  tagline: {
    marginTop: spacing.md,
    fontSize: typography.xl,
    fontWeight: typography.weight.bold,
    textAlign: 'center',
  },

  description: {
    marginTop: spacing.sm,
    fontSize: typography.md,
    lineHeight: 22,
    textAlign: 'center',
    maxWidth: 340,
  },

  form: {
    width: '100%',
  },

  heading: {
    fontSize: typography.xxl,
    fontWeight: typography.weight.bold,
  },

  formSubtitle: {
    marginTop: spacing.xs,
    marginBottom: spacing.md,
    fontSize: typography.md,
  },

  errorBox: {
    borderWidth: 1,
    borderRadius: themeConfig.radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },

  errorText: {
    fontSize: typography.sm,
    lineHeight: 20,
    fontWeight: typography.weight.medium,
  },

  field: {
    marginBottom: spacing.sm,
  },

  label: {
    marginBottom: spacing.xs,
    fontSize: typography.sm,
    fontWeight: typography.weight.semibold,
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

  helperText: {
    marginTop: spacing.xs,
    fontSize: typography.xs,
  },

  consentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },

  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1.5,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },

  checkmark: {
    fontSize: 14,
    fontWeight: typography.weight.bold,
  },

  consentText: {
    flex: 1,
    fontSize: typography.sm,
    lineHeight: 20,
  },

  submitButton: {
    minHeight: themeConfig.buttons.height,
    borderRadius: themeConfig.buttons.radius,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: themeConfig.buttons.iconGap,
  },

  submitText: {
    fontSize: typography.md,
    fontWeight: typography.weight.bold,
  },

  loginPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.md,
  },

  loginPromptText: {
    fontSize: typography.sm,
  },

  loginLink: {
    fontSize: typography.sm,
    fontWeight: typography.weight.bold,
  },

  skylineContainer: {
    marginTop: spacing.lg,
    minHeight: 150,
  },

  footer: {
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
    textAlign: 'center',
    fontSize: typography.xs,
  },
});