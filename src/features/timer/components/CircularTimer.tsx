import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

import { StitchTokens } from '@/constants/theme';
import { TimerMode, TimerStatus } from '../types';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const { size, radius, strokeWidth, circumference } = StitchTokens.timer;
const center = size / 2;

export interface CircularTimerProps {
  readonly progress: number; // 0.0 at start -> 1.0 at finish
  readonly formattedTime: string;
  readonly mode: TimerMode;
  readonly status: TimerStatus;
  readonly quoteText?: string;
}

export const CircularTimer: React.FC<CircularTimerProps> = ({
  progress,
  formattedTime,
  mode,
  status,
  quoteText,
}) => {
  const animatedProgress = useSharedValue(progress);

  useEffect(() => {
    animatedProgress.value = withTiming(progress, {
      duration: 250,
      easing: Easing.linear,
    });
  }, [progress, animatedProgress]);

  const animatedProps = useAnimatedProps(() => {
    // When progress = 0, offset = 0 (full circle ring)
    // When progress = 1, offset = circumference (depleted ring)
    const strokeDashoffset = circumference * animatedProgress.value;
    return {
      strokeDashoffset,
    };
  });

  const activeColor =
    mode === 'focus' ? StitchTokens.colors.primary : StitchTokens.colors.tertiary;

  const modeLabel = mode === 'focus' ? 'TIME TO FOCUS' : 'REST YOUR MIND';

  const defaultQuote =
    mode === 'focus' ? 'One thing at a time.' : 'Breathe and recharge.';

  const accessibleDescription = `${formattedTime} remaining in ${mode === 'focus' ? 'Focus' : 'Break'} session`;

  return (
    <View
      style={styles.container}
      testID="circular-timer-container"
      accessible={true}
      accessibilityRole="timer"
      accessibilityLabel={accessibleDescription}
      accessibilityLiveRegion="polite"
    >
      {/* Ambient Glow Layer */}
      <View style={styles.glowLayer} />

      {/* Radial SVG Timer */}
      <Svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={styles.svg}
      >
        {/* Background Track Circle */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={StitchTokens.colors.surfaceContainerHigh}
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Active Progress Arc */}
        <AnimatedCircle
          cx={center}
          cy={center}
          r={radius}
          stroke={activeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeLinecap="round"
          fill="none"
          animatedProps={animatedProps}
        />
      </Svg>

      {/* Center Display Typography */}
      <View style={styles.centerContent} pointerEvents="none">
        <Text style={styles.modeLabel} numberOfLines={1}>
          {modeLabel}
        </Text>
        <Text style={styles.digitsText} numberOfLines={1} testID="timer-digits">
          {formattedTime}
        </Text>
        <Text style={styles.quoteText} numberOfLines={1}>
          {quoteText ?? defaultQuote}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: size,
    height: size,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginVertical: StitchTokens.spacing.sm,
  },
  glowLayer: {
    position: 'absolute',
    width: size - 16,
    height: size - 16,
    borderRadius: (size - 16) / 2,
    backgroundColor: StitchTokens.colors.surfaceContainerLow,
    opacity: 0.7,
  },
  svg: {
    transform: [{ rotate: '-90deg' }],
  },
  centerContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: StitchTokens.spacing.md,
  },
  modeLabel: {
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 1.3,
    fontWeight: '600',
    color: StitchTokens.colors.onSurfaceVariant,
    textTransform: 'uppercase',
    marginBottom: StitchTokens.spacing.xs,
  },
  digitsText: {
    fontSize: 56,
    lineHeight: 64,
    fontWeight: '300',
    letterSpacing: -1.5,
    color: StitchTokens.colors.onSurface,
    fontVariant: ['tabular-nums'],
    marginVertical: 2,
  },
  quoteText: {
    fontSize: 13,
    lineHeight: 18,
    fontStyle: 'italic',
    color: StitchTokens.colors.onSurfaceVariant,
    opacity: 0.85,
    marginTop: StitchTokens.spacing.xs,
  },
});
