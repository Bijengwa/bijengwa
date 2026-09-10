import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { Logo } from '../../src/components/Logo';
import { typography } from '../../src/constants/typography';
import { useLanguage } from '../../src/context/LanguageContext';
import { useTheme } from '../../src/context/ThemeContext';

export default function SplashScreen() {
  const { colors } = useTheme();
  const { language } = useLanguage();

  const markScale = useRef(new Animated.Value(0.2)).current;
  const markRotate = useRef(new Animated.Value(-18)).current;
  const markOpacity = useRef(new Animated.Value(0)).current;
  const brandOpacity = useRef(new Animated.Value(0)).current;
  const brandTranslate = useRef(new Animated.Value(15)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(markOpacity, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.spring(markScale, {
          toValue: 1,
          friction: 5,
          tension: 70,
          useNativeDriver: true,
        }),
        Animated.timing(markRotate, {
          toValue: 0,
          duration: 650,
          easing: Easing.out(Easing.back(1.4)),
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(250),
      Animated.parallel([
        Animated.timing(brandOpacity, {
          toValue: 1,
          duration: 450,
          useNativeDriver: true,
        }),
        Animated.timing(brandTranslate, {
          toValue: 0,
          duration: 450,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(900),
      Animated.parallel([
        Animated.timing(markOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(brandOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      router.replace('/auth/login');
    });
  }, [brandOpacity, brandTranslate, markOpacity, markRotate, markScale]);

  const rotate = markRotate.interpolate({
    inputRange: [-18, 0],
    outputRange: ['-18deg', '0deg'],
  });

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.markContainer,
            {
              opacity: markOpacity,
              transform: [{ scale: markScale }, { rotate }],
            },
          ]}
        >
          <Logo size="large" showWordmark={false} />
        </Animated.View>

        <Animated.View
          style={[
            styles.brandContainer,
            {
              opacity: brandOpacity,
              transform: [{ translateY: brandTranslate }],
            },
          ]}
        >
          <Text
            style={[
              styles.brand,
              {
                color: colors.text,
              },
            ]}
          >
            BIJENGWA
          </Text>

          <Text
            style={[
              styles.tagline,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            {language === 'sw'
              ? 'Pata Mahali. Jenga Kitu.'
              : 'Find a Place. Build Something.'}
          </Text>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  brand: {
    fontSize: typography.xxl,
    fontWeight: typography.weight.semibold,
    letterSpacing: typography.letterSpacing.wordmark,
  },
  tagline: {
    marginTop: 8,
    fontSize: typography.md,
    fontWeight: typography.weight.medium,
  },
});
