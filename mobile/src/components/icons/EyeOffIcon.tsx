import React from 'react';
import Svg, { Path } from 'react-native-svg';

import { IconProps } from './types';

export function EyeOffIcon({
  size = 20,
  color = '#1A242B',
  strokeWidth = 1.75,
}: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3.2 12S6.4 6.8 12 6.8c1.4 0 2.6.3 3.7.8M20.8 12S17.6 17.2 12 17.2c-1.4 0-2.6-.3-3.7-.8"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9.6 9.7a2.6 2.6 0 0 0 4.6 2.3M4 4l16 16"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </Svg>
  );
}
