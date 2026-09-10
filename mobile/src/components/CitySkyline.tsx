import React, { useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg';

import { themeConfig } from '../constants/theme';
import { ThemeColors } from '../constants/colors';

type CitySkylineProps = {
  colors: ThemeColors;
  height?: number;
};

export function CitySkyline({
  colors,
  height = themeConfig.skyline.height,
}: CitySkylineProps) {
  const [width, setWidth] = useState(0);

  const onLayout = (event: LayoutChangeEvent) => {
    setWidth(event.nativeEvent.layout.width);
  };

  return (
    <View
      pointerEvents="none"
      onLayout={onLayout}
      style={styles.container}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {width > 0 ? (
      <Svg
        width={width}
        height={height}
        viewBox="0 0 390 128"
        preserveAspectRatio="none"
      >
        <Defs>
          <LinearGradient id="skyFade" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={colors.background} stopOpacity="1" />
            <Stop offset="0.42" stopColor={colors.background} stopOpacity="0.2" />
            <Stop offset="1" stopColor={colors.background} stopOpacity="0" />
          </LinearGradient>
        </Defs>

        <Path
          d="M0 128V86h18V58h10v12h8V46h14v40h12V62h16v22h10V38l12-10 12 10v28h14V54h22v34h10V70h18v18h12V48h16v36h10V66h14v22h12V42h18v44h14V72h16v20h12V60h20v68H0Z"
          fill={colors.skyline}
          opacity={0.55}
        />

        <Path
          d="M26 128V92h12V74h16v18h10V84h14v44H26Zm78 0V80h18V58h14v22h12v48H104Zm92 0V86h22V64h16v22h18v42h-56Zm86 0V78h14V56l10-8 10 8v22h16v50h-50Zm78 0V90h20V68h14v22h18v38h-52Z"
          fill={colors.skylineAccent}
          opacity={0.7}
        />

        <Rect x="48" y="86" width="3" height="5" rx="0.5" fill={colors.skylineWindow} opacity={0.9} />
        <Rect x="56" y="86" width="3" height="5" rx="0.5" fill={colors.primary} opacity={0.55} />
        <Rect x="122" y="68" width="3" height="5" rx="0.5" fill={colors.secondary} opacity={0.7} />
        <Rect x="132" y="68" width="3" height="5" rx="0.5" fill={colors.skylineWindow} opacity={0.85} />
        <Rect x="214" y="74" width="3" height="5" rx="0.5" fill={colors.primary} opacity={0.6} />
        <Rect x="224" y="74" width="3" height="5" rx="0.5" fill={colors.skylineWindow} opacity={0.8} />
        <Rect x="292" y="64" width="3" height="5" rx="0.5" fill={colors.secondary} opacity={0.65} />
        <Rect x="338" y="78" width="3" height="5" rx="0.5" fill={colors.primary} opacity={0.5} />

        <Path
          d="M0 118h390v10H0z"
          fill={colors.skyline}
          opacity={0.35}
        />

        <Rect width="390" height="128" fill="url(#skyFade)" />
      </Svg>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});
