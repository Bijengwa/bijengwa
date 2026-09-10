import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

import { IconProps } from './types';

export function UserIcon({
  size = 20,
  color = '#1A242B',
  strokeWidth = 1.75,
}: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle
        cx="12"
        cy="8"
        r="3.4"
        stroke={color}
        strokeWidth={strokeWidth}
      />
      <Path
        d="M5.6 18.6c.9-2.8 3.3-4.4 6.4-4.4s5.5 1.6 6.4 4.4"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </Svg>
  );
}
