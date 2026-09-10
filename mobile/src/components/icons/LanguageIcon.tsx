import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

import { IconProps } from './types';

export function LanguageIcon({
  size = 20,
  color = '#1A242B',
  strokeWidth = 1.75,
}: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle
        cx="12"
        cy="12"
        r="9"
        stroke={color}
        strokeWidth={strokeWidth}
      />
      <Path
        d="M3 12h18"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <Path
        d="M12 3c2.5 2.8 3.8 5.9 3.8 9s-1.3 6.2-3.8 9c-2.5-2.8-3.8-5.9-3.8-9S9.5 5.8 12 3Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    </Svg>
  );
}
