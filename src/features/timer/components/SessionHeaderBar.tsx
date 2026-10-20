import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { StitchTokens } from '@/constants/theme';

export interface SessionHeaderBarProps {
  readonly title?: string;
  readonly sessionLabel?: string;
  readonly onOpenSettings?: () => void;
}

export const SessionHeaderBar: React.FC<SessionHeaderBarProps> = ({
  title = 'Still',
  sessionLabel,
  onOpenSettings,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftBrand}>
        <Text style={styles.titleText}>{title}</Text>
        <View style={styles.dot} />
        {sessionLabel ? (
          <Text style={styles.sessionText}>{sessionLabel}</Text>
        ) : null}
      </View>

      {onOpenSettings ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open settings"
          onPress={onOpenSettings}
          style={({ pressed }) => [
            styles.settingsButton,
            pressed && styles.settingsButtonPressed,
          ]}
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
          testID="settings-btn"
        >
          {/* Tune / Slider settings icon */}
          <Svg width={20} height={20} viewBox="0 0 24 24">
            <Path
              d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"
              fill={StitchTokens.colors.onSurfaceVariant}
            />
          </Svg>
        </Pressable>
      ) : (
        <View style={styles.placeholder} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: StitchTokens.spacing.md,
    paddingVertical: StitchTokens.spacing.sm,
  },
  leftBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  titleText: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '600',
    letterSpacing: -0.3,
    color: StitchTokens.colors.onSurface,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: StitchTokens.colors.primary,
    marginLeft: 6,
    marginBottom: 2,
  },
  sessionText: {
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: StitchTokens.colors.onSurfaceVariant,
    marginLeft: StitchTokens.spacing.sm,
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: StitchTokens.radius.full,
    backgroundColor: StitchTokens.colors.surfaceContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsButtonPressed: {
    backgroundColor: StitchTokens.colors.surfaceContainerHigh,
  },
  placeholder: {
    width: 44,
    height: 44,
  },
});
