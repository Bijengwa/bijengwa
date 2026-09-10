import React, { useEffect, useRef, useState } from 'react';
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
import { router, useLocalSearchParams } from 'expo-router';

import { api, ApiError } from '../../src/api/api';
import { setSessionToken } from '../../src/auth/session';
import { useTheme } from '../../src/context/ThemeContext';
import { useLanguage } from '../../src/context/LanguageContext';

import { Logo } from '../../src/components/Logo';
import { ArrowLeftIcon, LockIcon } from '../../src/components/icons';

export default function VerifyEmailScreen() {
  const { colors } = useTheme();
  const { language } = useLanguage();
  const insets = useSafeAreaInsets();

  const params = useLocalSearchParams<{ email?: string }>();

  const email =
    typeof params.email === 'string' ? params.email.trim().toLowerCase() : '';

  const isSwahili = language === 'sw';

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(0);

  const codeInputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (secondsLeft <= 0) return;

    const timer = setInterval(() => {
      setSecondsLeft((current) => Math.max(0, current - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);

  const handleCodeChange = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 6);

    setCode(cleaned);
    setError('');
    setMessage('');
  };

  const handleVerify = async () => {
    if (loading) return;

    const cleanCode = code.trim();

    if (!email) {
      setError(
        isSwahili
          ? 'Barua pepe haijapatikana.'
          : 'Email address was not found.',
      );
      return;
    }

    if (!/^\d{6}$/.test(cleanCode)) {
      setError(
        isSwahili
          ? 'Ingiza namba ya uthibitisho yenye tarakimu 6.'
          : 'Enter the 6-digit verification code.',
      );
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await api.post<{
        token?: string;
        access_token?: string;
        user?: unknown;
      }>('/auth/verify-email', {
        email,
        code: cleanCode,
      });

      const token = response.data?.token ?? response.data?.access_token;

      if (token) {
        setSessionToken(token);
      }

      setMessage(
        response.message ||
          (isSwahili
            ? 'Barua pepe imethibitishwa.'
            : 'Email verified successfully.'),
      );

      router.replace('/dashboard');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(
          err.message ||
            (isSwahili
              ? 'Namba ya uthibitisho si sahihi.'
              : 'The verification code is incorrect.'),
        );
      } else {
        setError(
          isSwahili
            ? 'Imeshindikana kuthibitisha barua pepe.'
            : 'Unable to verify your email.',
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resending || secondsLeft > 0) return;

    if (!email) {
      setError(
        isSwahili
          ? 'Barua pepe haijapatikana.'
          : 'Email address was not found.',
      );
      return;
    }

    setResending(true);
    setError('');
    setMessage('');

    try {
      const response = await api.post('/auth/request-verification-code', {
        email,
      });

      setMessage(
        response.message ||
          (isSwahili
            ? 'Namba mpya imetumwa kwenye barua pepe yako.'
            : 'A new verification code has been sent to your email.'),
      );

      setSecondsLeft(60);
      setCode('');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError(
          isSwahili
            ? 'Imeshindikana kutuma namba mpya.'
            : 'Unable to send a new verification code.',
        );
      }
    } finally {
      setResending(false);
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingBottom: Math.max(insets.bottom, 8),
        },
      ]}
    >
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.topBar}>
            <Pressable
              onPress={() => router.back()}
              accessibilityRole="button"
              accessibilityLabel={
                isSwahili ? 'Rudi nyuma' : 'Go back'
              }
              hitSlop={10}
              style={({ pressed }) => [
                styles.backButton,
                {
                  borderColor: colors.border,
                  backgroundColor: colors.surface,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <ArrowLeftIcon
                size={20}
                color={colors.icon}
                accessibilityLabel={
                  isSwahili ? 'Rudi nyuma' : 'Go back'
                }
              />
            </Pressable>
          </View>

          <View style={styles.brand}>
            <Logo size="medium" />
          </View>

          <View style={styles.content}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: colors.primaryLight },
              ]}
            >
              <LockIcon
                size={28}
                color={colors.primary}
                accessibilityLabel={
                  isSwahili
                    ? 'Uthibitisho wa barua pepe'
                    : 'Email verification'
                }
              />
            </View>

            <Text style={[styles.title, { color: colors.text }]}>
              {isSwahili ? 'Thibitisha barua pepe' : 'Verify your email'}
            </Text>

            {email ? (
              <Text
                style={[styles.email, { color: colors.textSecondary }]}
                numberOfLines={1}
              >
                {email}
              </Text>
            ) : null}

            <View style={styles.form}>
              <TextInput
                ref={codeInputRef}
                value={code}
                onChangeText={handleCodeChange}
                keyboardType="number-pad"
                inputMode="numeric"
                maxLength={6}
                autoComplete="one-time-code"
                textContentType="oneTimeCode"
                autoFocus
                placeholder="000000"
                placeholderTextColor={colors.textMuted}
                style={[
                  styles.codeInput,
                  {
                    color: colors.text,
                    backgroundColor: colors.inputBackground,
                    borderColor: error
                      ? colors.danger
                      : colors.inputBorder,
                  },
                ]}
                accessibilityLabel={
                  isSwahili
                    ? 'Namba ya uthibitisho'
                    : 'Verification code'
                }
                accessibilityHint={
                  isSwahili
                    ? 'Ingiza tarakimu 6 ulizotumiwa kwenye barua pepe'
                    : 'Enter the 6-digit code sent to your email'
                }
              />

              {error ? (
                <Text
                  style={[styles.feedback, { color: colors.danger }]}
                  accessibilityRole="alert"
                >
                  {error}
                </Text>
              ) : null}

              {message ? (
                <Text
                  style={[styles.feedback, { color: colors.secondary }]}
                  accessibilityRole="text"
                >
                  {message}
                </Text>
              ) : null}

              <Pressable
                onPress={handleVerify}
                disabled={loading}
                accessibilityRole="button"
                accessibilityLabel={
                  isSwahili ? 'Thibitisha barua pepe' : 'Verify email'
                }
                style={({ pressed }) => [
                  styles.primaryButton,
                  {
                    backgroundColor: colors.primary,
                    opacity: loading ? 0.65 : pressed ? 0.86 : 1,
                  },
                ]}
              >
                {loading ? (
                  <ActivityIndicator
                    size="small"
                    color={colors.textOnPrimary}
                  />
                ) : (
                  <Text
                    style={[
                      styles.primaryButtonText,
                      { color: colors.textOnPrimary },
                    ]}
                  >
                    {isSwahili ? 'Thibitisha' : 'Verify'}
                  </Text>
                )}
              </Pressable>

              <Pressable
                onPress={handleResend}
                disabled={resending || secondsLeft > 0}
                accessibilityRole="button"
                accessibilityLabel={
                  isSwahili
                    ? 'Tuma tena namba ya uthibitisho'
                    : 'Resend verification code'
                }
                style={({ pressed }) => [
                  styles.resendButton,
                  {
                    opacity:
                      resending || secondsLeft > 0
                        ? 0.45
                        : pressed
                          ? 0.7
                          : 1,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.resendText,
                    { color: colors.primary },
                  ]}
                >
                  {secondsLeft > 0
                    ? isSwahili
                      ? `Tuma tena baada ya ${secondsLeft}s`
                      : `Resend in ${secondsLeft}s`
                    : resending
                      ? isSwahili
                        ? 'Inatuma...'
                        : 'Sending...'
                      : isSwahili
                        ? 'Tuma tena namba'
                        : 'Resend code'}
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  flex: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 24,
  },

  topBar: {
    height: 42,
    justifyContent: 'center',
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  brand: {
    alignItems: 'center',
    marginTop: 18,
  },

  content: {
    alignItems: 'center',
    width: '100%',
    marginTop: 22,
  },

  iconContainer: {
    width: 58,
    height: 58,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },

  title: {
    fontSize: 25,
    lineHeight: 31,
    fontWeight: '700',
    textAlign: 'center',
  },

  email: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 7,
    maxWidth: '90%',
    textAlign: 'center',
  },

  form: {
    width: '100%',
    marginTop: 22,
  },

  codeInput: {
    width: '100%',
    height: 58,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 8,
  },

  feedback: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 9,
    textAlign: 'center',
  },

  primaryButton: {
    height: 54,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },

  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },

  resendButton: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 7,
  },

  resendText: {
    fontSize: 14,
    fontWeight: '600',
  },
});