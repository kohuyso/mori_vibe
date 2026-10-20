export type TimerMode = 'focus' | 'break';

export type TimerStatus = 'idle' | 'running' | 'paused' | 'completed';

export interface TimerSnapshot {
  readonly mode: TimerMode;
  readonly status: TimerStatus;
  readonly timeRemainingSec: number;
  readonly totalDurationSec: number;
  readonly progress: number; // 0.0 at start -> 1.0 when finished
  readonly targetTimestamp: number | null;
  readonly hasCompletedDispatched: boolean;
}

export interface TimerConfig {
  readonly focusDurationSec?: number;
  readonly breakDurationSec?: number;
  readonly onTick?: (snapshot: TimerSnapshot) => void;
  readonly onComplete?: (mode: TimerMode) => void;
}
