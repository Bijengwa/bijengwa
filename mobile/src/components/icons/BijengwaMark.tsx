import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

import { brand } from '../../constants/colors';

type MarkVariant = 'color' | 'onDark';

type BijengwaMarkProps = {
  size?: number;
  variant?: MarkVariant;
};

/**
 * Official Bijengwa key/arch mark.
 * Geometry taken from mobile/assets/bijengwa-mark-color.svg
 * and mobile/assets/bijengwa-lockup-horizontal-white.svg.
 */
export function BijengwaMark({
  size = 56,
  variant = 'color',
}: BijengwaMarkProps) {
  const arch = variant === 'onDark' ? '#FFFFFF' : brand.steel;
  const key = brand.key;

  return (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <Path
        d="M8 45V21a16 16 0 0 1 32 0v24"
        stroke={arch}
        strokeWidth={5}
      />
      <Circle cx="24" cy="22" r="5.5" fill={key} />
      <Path d="M21 27h6l2.5 10h-11z" fill={key} />
    </Svg>
  );
}
