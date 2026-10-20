import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { StitchTokens } from '@/constants/theme';
import { TimerMode } from '../types';

export interface ModeSelectorProps {
  readonly activeMode: TimerMode;
  readonly onSelectMode: (mode: TimerMode) => void;
  readonly disabled?: boolean;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  activeMode,
  onSelectMode,
  disabled = false,
}) => {
  const isFocus = activeMode === 'focus';

  const activeFocusStyle = [
    styles.tabActive,
    { backgroundColor: StitchTokens.colors.primary },
  ];

  const activeBreakStyle = [
    styles.tabActive,
    { backgroundColor: StitchTokens.colors.tertiary },
  ];

  return (
    <View style={styles.container} accessibilityRole="tablist">
      <Pressable
        accessibilityRole="tab"
        accessibilityLabel="Focus mode"
        accessibilityState={{ selected: isFocus }}
        disabled={disabled}
        onPress={() => onSelectMode('focus')}
        style={({ pressed }) => [
          styles.tab,
          isFocus ? activeFocusStyle : styles.tabInactive,
          pressed && !isFocus && styles.tabPressed,
        ]}
        hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
        testID="focus-mode-tab"
      >
        <Text
          style={[
            styles.tabText,
            isFocus ? styles.tabTextActive : styles.tabTextInactive,
          ]}
        >
          Focus
        </Text>
      </Pressable>

      <Pressable
        accessibilityRole="tab"
        accessibilityLabel="Break mode"
        accessibilityState={{ selected: !isFocus }}
        disabled={disabled}
        onPress={() => onSelectMode('break')}
        style={({ pressed }) => [
          styles.tab,
          !isFocus ? activeBreakStyle : styles.tabInactive,
          pressed && isFocus && styles.tabPressed,
        ]}
        hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
        testID="break-mode-tab"
      >
        <Text
          style={[
            styles.tabText,
            !isFocus ? styles.tabTextActive : styles.tabTextInactive,
          ]}
        >
          Break
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: StitchTokens.colors.surfaceContainer,
    borderRadius: StitchTokens.radius.full,
    padding: 4,
  },
  tab: {
    minHeight: 40,
    minWidth: 96,
    paddingHorizontal: StitchTokens.spacing.lg,
    paddingVertical: 8,
    borderRadius: StitchTokens.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 2,
    elevation: 2,
  },
  tabInactive: {
    backgroundColor: 'transparent',
  },
  tabPressed: {
    backgroundColor: StitchTokens.colors.surfaceContainerHighest,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.1,
  },
  tabTextActive: {
    color: StitchTokens.colors.onPrimary,
  },
  tabTextInactive: {
    color: StitchTokens.colors.onSurfaceVariant,
  },
});
