import React, { useRef, useState } from 'react';
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
import {
  SafeAreaView,
  initialWindowMetrics,
} from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { CitySkyline } from '../../src/components/CitySkyline';
import { LanguageButton } from '../../src/components/LanguageButton';
import { Logo } from '../../src/components/Logo';
import { ThemeToggle } from '../../src/components/ThemeToggle';
import { ArrowRightIcon } from '../../src/components/icons/ArrowRightIcon';
import { EyeIcon } from '../../src/components/icons/EyeIcon';
import { EyeOffIcon } from '../../src/components/icons/EyeOffIcon';
import { LockIcon } from '../../src/components/icons/LockIcon';
import { UserIcon } from '../../src/components/icons/UserIcon';
import { spacing } from '../../src/constants/spacing';
import { themeConfig } from '../../src/constants/theme';
import { typography } from '../../src/constants/typography';
import { useLanguage } from '../../src/context/LanguageContext';
import { useTheme } from '../../src/context/ThemeContext';

export default function LoginScreen() {
  const { colors, isDark } = useTheme();
  const { language } = useLanguage();
  const passwordRef = useRef<TextInput>(null);

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [identifierFocused, setIdentifierFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

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

            <Text
              style={[
                styles.subtitle,
                {
                  color: colors.textSecondary,
                },
              ]}
            >
              {isSwahili
                ? 'Ingia kuendelea na Bijengwa'
                : 'Sign in to continue with Bijengwa'}
            </Text>

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
                  ? 'Jina la mtumiaji, barua pepe au namba ya simu'
                  : 'Username, Email or Phone Number'}
              </Text>

              <View
                style={[
                  styles.inputShell,
                  {
                    backgroundColor: colors.inputBackground,
                    borderColor: identifierFocused
                      ? colors.borderFocused
                      : colors.inputBorder,
                  },
                ]}
              >
                <UserIcon
                  size={themeConfig.icons.md}
                  color={
                    identifierFocused ? colors.primary : colors.iconMuted
                  }
                />

                <TextInput
                  value={identifier}
                  onChangeText={setIdentifier}
                  onFocus={() => setIdentifierFocused(true)}
                  onBlur={() => setIdentifierFocused(false)}
                  blurOnSubmit={false}
                  onSubmitEditing={() => passwordRef.current?.focus()}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="username"
                  textContentType="username"
                  keyboardType="default"
                  returnKeyType="next"
                  placeholder={
                    isSwahili
                      ? 'Jina la mtumiaji, barua pepe au namba ya simu'
                      : 'Username, email or phone number'
                  }
                  placeholderTextColor={colors.textMuted}
                  cursorColor={colors.primary}
                  selectionColor={colors.primary}
                  accessibilityLabel={
                    isSwahili
                      ? 'Jina la mtumiaji, barua pepe au namba ya simu'
                      : 'Username, email or phone number'
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
              accessibilityRole="button"
              accessibilityLabel={isSwahili ? 'Ingia' : 'Login'}
              style={({ pressed }) => [
                styles.loginButton,
                {
                  backgroundColor: pressed
                    ? colors.primaryDark
                    : colors.primary,
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
    marginTop: themeConfig.screen.sectionGap,
  },
  title: {
    fontSize: typography.title,
    fontWeight: typography.weight.heavy,
    letterSpacing: typography.letterSpacing.tight,
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
    paddingTop: spacing.xxxl,
    alignItems: 'center',
  },
  footerText: {
    marginTop: spacing.md,
    fontSize: typography.xs,
    fontWeight: typography.weight.medium,
    textAlign: 'center',
  },
});
