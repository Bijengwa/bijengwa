import React from 'react';
import Svg, { Path } from 'react-native-svg';

import { IconProps } from './types';

export function MoonIcon({
  size = 20,
  color = '#F2F6F8',
  strokeWidth = 1.75,
}: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M17.5 14.2A7.2 7.2 0 0 1 9.8 6.5 7.25 7.25 0 1 0 17.5 14.2Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
