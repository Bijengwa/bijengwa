import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

import { IconProps } from './types';

export function EyeIcon({
  size = 20,
  color = '#1A242B',
  strokeWidth = 1.75,
}: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3.2 12S6.4 6.8 12 6.8 20.8 12 20.8 12 17.6 17.2 12 17.2 3.2 12 3.2 12Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      <Circle
        cx="12"
        cy="12"
        r="2.4"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </Svg>
  );
}
