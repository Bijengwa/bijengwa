import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

import { IconProps } from './types';

export function SunIcon({
  size = 20,
  color = '#1A242B',
  strokeWidth = 1.75,
}: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle
        cx="12"
        cy="12"
        r="4.25"
        stroke={color}
        strokeWidth={strokeWidth}
      />
      <Path
        d="M12 3v1.8M12 19.2V21M4.93 4.93l1.27 1.27M17.8 17.8l1.27 1.27M3 12h1.8M19.2 12H21M4.93 19.07l1.27-1.27M17.8 6.2l1.27-1.27"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </Svg>
  );
}
