import React from 'react';
import Svg, { Path } from 'react-native-svg';

import { IconProps } from './types';

export function ChevronDownIcon({
  size = 16,
  color = '#1A242B',
  strokeWidth = 1.85,
}: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6 9.5 12 15.5 18 9.5"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
