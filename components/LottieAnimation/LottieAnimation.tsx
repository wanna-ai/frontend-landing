'use client';

import Lottie from 'lottie-react';
import { CSSProperties } from 'react';

interface LottieAnimationProps {
  animationData: unknown; // Your JSON animation data
  loop?: boolean;
  autoplay?: boolean;
  style?: CSSProperties;
  className?: string;
  speed?: number;
  onComplete?: () => void;
}

export default function LottieAnimation({
  animationData,
  loop = true,
  autoplay = true,
  style,
  className,
  speed = 1,
  onComplete,
}: LottieAnimationProps) {
  return (
    <Lottie
      animationData={animationData}
      loop={loop}
      autoplay={autoplay}
      style={style}
      className={className}
      onComplete={onComplete}
    />
  );
}