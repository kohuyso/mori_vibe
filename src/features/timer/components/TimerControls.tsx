import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path, Polygon, Rect } from 'react-native-svg';

import { StitchTokens } from '@/constants/theme';
import { TimerMode, TimerStatus } from '../types';

export interface TimerControlsProps {
  readonly status: TimerStatus;
  readonly mode: TimerMode;
  readonly onStart: () => void;
  readonly onPause: () => void;
  readonly onResume: () => void;
  readonly onReset: () => void;
}

export const TimerControls: React.FC<TimerControlsProps> = ({
  status,
  mode,
  onStart,
  onPause,
  onResume,
  onReset,
}) => {
  const isBreak = mode === 'break';
  const buttonBgColor = isBreak
    ? StitchTokens.colors.tertiary
    : StitchTokens.colors.primary;

  const handlePrimaryPress = () => {
    switch (status) {
      case 'idle':
        onStart();
        break;
      case 'running':
        onPause();
        break;
      case 'paused':
        onResume();
        break;
      case 'completed':
        onStart();
        break;
    }
  };

  const getPrimaryLabel = (): string => {
    switch (status) {
      case 'idle':
        return isBreak ? 'Start Break' : 'Start Focus';
      case 'running':
        return 'Pause';
      case 'paused':
        return 'Resume';
      case 'completed':
        return 'Restart';
    }
  };

  const renderPrimaryIcon = () => {
    if (status === 'running') {
      return (
        <Svg width={20} height={20} viewBox="0 0 24 24" style={styles.icon}>
          <Rect x="6" y="4" width="4" height="16" rx="1" fill="#ffffff" />
          <Rect x="14" y="4" width="4" height="16" rx="1" fill="#ffffff" />
        </Svg>
      );
    }

    if (status === 'completed') {
      return (
        <Svg width={20} height={20} viewBox="0 0 24 24" style={styles.icon}>
          <Path
            d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46A7.93 7.93 0 0020 12c0-4.42-3.58-8-8-8zm-6.3 5.2L4.24 7.74A7.93 7.93 0 004 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8z"
            fill="#ffffff"
          />
        </Svg>
      );
    }

    // Idle or Paused -> Play triangle
    return (
      <Svg width={20} height={20} viewBox="0 0 24 24" style={styles.icon}>
        <Polygon points="6,4 20,12 6,20" fill="#ffffff" />
      </Svg>
    );
  };

  const canReset = status !== 'idle';

  return (
    <View style={styles.container}>
      {/* Primary Action Button */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={getPrimaryLabel()}
        onPress={handlePrimaryPress}
        style={({ pressed }) => [
          styles.primaryButton,
          { backgroundColor: buttonBgColor },
          pressed && styles.primaryButtonPressed,
        ]}
        testID="timer-primary-btn"
      >
        {renderPrimaryIcon()}
        <Text style={styles.primaryButtonText}>{getPrimaryLabel()}</Text>
      </Pressable>

      {/* Auxiliary Controls & Guidance */}
      <View style={styles.auxiliaryContainer}>
        {canReset ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Reset timer"
            onPress={onReset}
            style={({ pressed }) => [
              styles.resetButton,
              pressed && styles.resetButtonPressed,
            ]}
            hitSlop={{ top: 8, bottom: 8, left: 12, right: 12 }}
            testID="timer-reset-btn"
          >
            <Svg width={16} height={16} viewBox="0 0 24 24" style={{ marginRight: 6 }}>
              <Path
                d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46A7.93 7.93 0 0020 12c0-4.42-3.58-8-8-8zm-6.3 5.2L4.24 7.74A7.93 7.93 0 004 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8z"
                fill={StitchTokens.colors.onSurfaceVariant}
              />
            </Svg>
            <Text style={styles.resetText}>Reset</Text>
          </Pressable>
        ) : (
          <Text style={styles.hintText}>Tap to start or adjust</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: StitchTokens.spacing.sm,
  },
  primaryButton: {
    width: 240,
    height: 56,
    borderRadius: StitchTokens.radius.full,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButtonPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.98 }],
  },
  icon: {
    marginRight: StitchTokens.spacing.sm,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.3,
    color: StitchTokens.colors.onPrimary,
  },
  auxiliaryContainer: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: StitchTokens.spacing.xs,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: StitchTokens.spacing.md,
    borderRadius: StitchTokens.radius.full,
  },
  resetButtonPressed: {
    backgroundColor: StitchTokens.colors.surfaceContainerHigh,
  },
  resetText: {
    fontSize: 13,
    fontWeight: '500',
    color: StitchTokens.colors.onSurfaceVariant,
  },
  hintText: {
    fontSize: 13,
    color: StitchTokens.colors.onSurfaceVariant,
  },
});
