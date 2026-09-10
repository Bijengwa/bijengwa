import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useTheme } from '../context/ThemeContext';

type LogoProps = {
  size?: 'small' | 'medium' | 'large';
};

export function Logo({ size = 'medium' }: LogoProps) {
  const { colors } = useTheme();

  const dimensions = {
    small: 42,
    medium: 64,
    large: 82,
  };

  const logoSize = dimensions[size];

  return (
    <View style={styles.container}>
      {/*
        Replace this Text with your actual Bijengwa logo
        once we confirm the exact filename in /assets.
      */}

      <View
        style={[
          styles.logoPlaceholder,
          {
            width: logoSize,
            height: logoSize,
            borderRadius: logoSize / 3,
            backgroundColor: colors.primary,
          },
        ]}
      >
        <Text
          style={[
            styles.logoLetter,
            {
              fontSize: logoSize * 0.45,
            },
          ]}
        >
          B
        </Text>
      </View>

      <Text
        style={[
          styles.brand,
          {
            color: colors.text,
            fontSize:
              size === 'large'
                ? 30
                : size === 'medium'
                  ? 26
                  : 21,
          },
        ]}
      >
        Bijengwa
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },

  logoPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },

  logoLetter: {
    color: '#FFFFFF',
    fontWeight: '800',
  },

  brand: {
    fontWeight: '800',
    letterSpacing: -0.8,
  },
});