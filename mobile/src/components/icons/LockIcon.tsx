import React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';

import { IconProps } from './types';

export function LockIcon({
  size = 20,
  color = '#1A242B',
  strokeWidth = 1.75,
}: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect
        x="5.5"
        y="10.5"
        width="13"
        height="9.5"
        rx="2.2"
        stroke={color}
        strokeWidth={strokeWidth}
      />
      <Path
        d="M8.2 10.5V8.1a3.8 3.8 0 0 1 7.6 0v2.4"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </Svg>
  );
}
