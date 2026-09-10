import React from 'react';
import Svg, { Path } from 'react-native-svg';

import { IconProps } from './types';

export function ArrowRightIcon({
  size = 20,
  color = '#FFFFFF',
  strokeWidth = 1.9,
}: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5 12h13.2M13.5 6.5 19.5 12l-6 5.5"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
