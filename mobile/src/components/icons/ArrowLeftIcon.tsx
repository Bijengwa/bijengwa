import React from 'react';
import Svg, { Path } from 'react-native-svg';

import { IconProps } from './types';

export function ArrowLeftIcon({
  size = 20,
  color = '#1A242B',
  strokeWidth = 1.9,
}: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M19 12H5.8M10.5 6.5 4.5 12l6 5.5"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
