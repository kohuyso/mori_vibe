import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { StitchTokens } from '@/constants/theme';
import { CircularTimer } from '@/features/timer/components/CircularTimer';
import { ModeSelector } from '@/features/timer/components/ModeSelector';
import { SessionHeaderBar } from '@/features/timer/components/SessionHeaderBar';
import { TimerControls } from '@/features/timer/components/TimerControls';
import { useTimer } from '@/features/timer/useTimer';

export default function HomeScreen() {
  const {
    snapshot,
    formattedTime,
    start,
    pause,
    resume,
    reset,
    switchMode,
  } = useTimer();

  return (
    <View style={styles.rootContainer}>
      <SafeAreaView style={styles.safeArea}>
        {/* Top Context & Session Header */}
        <SessionHeaderBar
          title="Still"
          sessionLabel={snapshot.mode === 'focus' ? 'Session 1 of 4' : 'Resting'}
        />

        {/* Center Main Stage */}
        <View style={styles.contentContainer}>
          {/* Mode Selector Pill */}
          <ModeSelector
            activeMode={snapshot.mode}
            onSelectMode={switchMode}
            disabled={snapshot.status === 'running'}
          />

          {/* Radial Circular Timer */}
          <CircularTimer
            progress={snapshot.progress}
            formattedTime={formattedTime}
            mode={snapshot.mode}
            status={snapshot.status}
          />

          {/* Primary & Auxiliary Controls */}
          <TimerControls
            status={snapshot.status}
            mode={snapshot.mode}
            onStart={start}
            onPause={pause}
            onResume={resume}
            onReset={reset}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: StitchTokens.colors.surface,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: StitchTokens.spacing.marginMobile,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    width: '100%',
    maxWidth: 420,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingVertical: StitchTokens.spacing.sm,
  },
});
