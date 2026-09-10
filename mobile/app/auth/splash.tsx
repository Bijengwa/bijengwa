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

import { useTheme } from '../../src/context/ThemeContext';

export default function SplashScreen() {
  const { colors } = useTheme();

  const keyScale = useRef(
    new Animated.Value(0.2)
  ).current;

  const keyRotate = useRef(
    new Animated.Value(-25)
  ).current;

  const keyOpacity = useRef(
    new Animated.Value(0)
  ).current;

  const brandOpacity = useRef(
    new Animated.Value(0)
  ).current;

  const brandTranslate = useRef(
    new Animated.Value(15)
  ).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(keyOpacity, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),

        Animated.spring(keyScale, {
          toValue: 1,
          friction: 5,
          tension: 70,
          useNativeDriver: true,
        }),

        Animated.timing(keyRotate, {
          toValue: 0,
          duration: 650,
          easing: Easing.out(Easing.back(1.4)),
          useNativeDriver: true,
        }),
      ]),

      Animated.delay(350),

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
        Animated.timing(keyOpacity, {
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
  }, []);

  const rotate = keyRotate.interpolate({
    inputRange: [-25, 0],
    outputRange: ['-25deg', '0deg'],
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
            styles.keyContainer,
            {
              opacity: keyOpacity,
              transform: [
                {
                  scale: keyScale,
                },
                {
                  rotate,
                },
              ],
            },
          ]}
        >
          <View
            style={[
              styles.keyCircle,
              {
                backgroundColor: colors.primary,
              },
            ]}
          >
            <View
              style={[
                styles.keyHole,
                {
                  backgroundColor: colors.background,
                },
              ]}
            />
          </View>

          <View
            style={[
              styles.keyStem,
              {
                backgroundColor: colors.primary,
              },
            ]}
          />

          <View
            style={[
              styles.keyTooth,
              {
                backgroundColor: colors.primary,
              },
            ]}
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.brandContainer,
            {
              opacity: brandOpacity,
              transform: [
                {
                  translateY: brandTranslate,
                },
              ],
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
            Bijengwa
          </Text>

          <Text
            style={[
              styles.tagline,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            Find Your Place
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

  keyContainer: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  keyCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,

    position: 'absolute',
    left: 7,
    top: 12,
  },

  keyHole: {
    width: 20,
    height: 20,
    borderRadius: 10,

    position: 'absolute',
    left: 19,
    top: 19,
  },

  keyStem: {
    width: 48,
    height: 16,
    borderRadius: 8,

    position: 'absolute',
    right: 0,
    top: 33,

    transform: [
      {
        rotate: '-45deg',
      },
    ],
  },

  keyTooth: {
    width: 19,
    height: 24,
    borderRadius: 4,

    position: 'absolute',
    right: 0,
    top: 50,

    transform: [
      {
        rotate: '-45deg',
      },
    ],
  },

  brandContainer: {
    alignItems: 'center',
    marginTop: 28,
  },

  brand: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -1,
  },

  tagline: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: '600',
  },
});