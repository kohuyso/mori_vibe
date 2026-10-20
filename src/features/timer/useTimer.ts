import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { TimerEngine } from './engine';
import { TimerMode, TimerSnapshot } from './types';
import { formatTime } from '@/utils/formatTime';

export interface UseTimerOptions {
  readonly initialMode?: TimerMode;
  readonly focusDurationSec?: number;
  readonly breakDurationSec?: number;
  readonly onComplete?: (mode: TimerMode) => void;
}

export interface UseTimerReturn {
  readonly snapshot: TimerSnapshot;
  readonly formattedTime: string;
  readonly start: () => void;
  readonly pause: () => void;
  readonly resume: () => void;
  readonly reset: () => void;
  readonly switchMode: (mode: TimerMode) => void;
  readonly updateDurations: (focusSec: number, breakSec: number) => void;
}

const TICK_INTERVAL_MS = 250;

export function useTimer(options?: UseTimerOptions): UseTimerReturn {
  const onCompleteRef = useRef<((mode: TimerMode) => void) | undefined>(options?.onComplete);
  onCompleteRef.current = options?.onComplete;

  const engineRef = useRef<TimerEngine | null>(null);

  if (!engineRef.current) {
    const engine = new TimerEngine({
      focusDurationSec: options?.focusDurationSec,
      breakDurationSec: options?.breakDurationSec,
      onComplete: (completedMode: TimerMode) => {
        onCompleteRef.current?.(completedMode);
      },
    });

    if (options?.initialMode && options.initialMode !== 'focus') {
      engine.switchMode(options.initialMode);
    }

    engineRef.current = engine;
  }

  const [snapshot, setSnapshot] = useState<TimerSnapshot>(() => engineRef.current!.getSnapshot());

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const syncSnapshot = useCallback(() => {
    if (engineRef.current) {
      setSnapshot(engineRef.current.getSnapshot());
    }
  }, []);

  // Interval loop for running state
  useEffect(() => {
    if (snapshot.status === 'running') {
      if (!intervalRef.current) {
        intervalRef.current = setInterval(() => {
          if (engineRef.current) {
            engineRef.current.tick();
            syncSnapshot();
          }
        }, TICK_INTERVAL_MS);
      }
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [snapshot.status, syncSnapshot]);

  // AppState foreground synchronization to prevent drift
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState: AppStateStatus) => {
      if (nextState === 'active' && engineRef.current) {
        engineRef.current.tick();
        syncSnapshot();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [syncSnapshot]);

  // Teardown on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      engineRef.current?.destroy();
      engineRef.current = null;
    };
  }, []);

  const start = useCallback(() => {
    if (engineRef.current) {
      const next = engineRef.current.start();
      setSnapshot(next);
    }
  }, []);

  const pause = useCallback(() => {
    if (engineRef.current) {
      const next = engineRef.current.pause();
      setSnapshot(next);
    }
  }, []);

  const resume = useCallback(() => {
    if (engineRef.current) {
      const next = engineRef.current.resume();
      setSnapshot(next);
    }
  }, []);

  const reset = useCallback(() => {
    if (engineRef.current) {
      const next = engineRef.current.reset();
      setSnapshot(next);
    }
  }, []);

  const switchMode = useCallback((mode: TimerMode) => {
    if (engineRef.current) {
      const next = engineRef.current.switchMode(mode);
      setSnapshot(next);
    }
  }, []);

  const updateDurations = useCallback((focusSec: number, breakSec: number) => {
    if (engineRef.current) {
      const next = engineRef.current.updateDurations(focusSec, breakSec);
      setSnapshot(next);
    }
  }, []);

  const formattedTime = formatTime(snapshot.timeRemainingSec);

  return {
    snapshot,
    formattedTime,
    start,
    pause,
    resume,
    reset,
    switchMode,
    updateDurations,
  };
}
