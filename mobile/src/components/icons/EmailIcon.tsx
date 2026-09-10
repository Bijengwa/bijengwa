import React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';

import { IconProps } from './types';

export function EmailIcon({
  size = 20,
  color = '#1A242B',
  strokeWidth = 1.75,
}: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect
        x="3.5"
        y="6"
        width="17"
        height="12"
        rx="2.2"
        stroke={color}
        strokeWidth={strokeWidth}
      />
      <Path
        d="M4.4 7.6 12 13.2 19.6 7.6"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
