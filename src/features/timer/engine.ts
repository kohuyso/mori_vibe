import { TimerConfig, TimerMode, TimerSnapshot, TimerStatus } from './types';

export const DEFAULT_FOCUS_DURATION_SEC = 25 * 60; // 1500 seconds
export const DEFAULT_BREAK_DURATION_SEC = 5 * 60;  // 300 seconds

export class TimerEngine {
  private mode: TimerMode = 'focus';
  private status: TimerStatus = 'idle';
  private focusDurationSec: number;
  private breakDurationSec: number;
  private remainingSec: number;
  private targetTimestamp: number | null = null;
  private hasCompletedDispatched = false;
  private onTick?: (snapshot: TimerSnapshot) => void;
  private onComplete?: (mode: TimerMode) => void;

  constructor(config?: TimerConfig) {
    this.focusDurationSec = config?.focusDurationSec ?? DEFAULT_FOCUS_DURATION_SEC;
    this.breakDurationSec = config?.breakDurationSec ?? DEFAULT_BREAK_DURATION_SEC;
    this.remainingSec = this.focusDurationSec;
    this.onTick = config?.onTick;
    this.onComplete = config?.onComplete;
  }

  public getTotalDurationSec(): number {
    return this.mode === 'focus' ? this.focusDurationSec : this.breakDurationSec;
  }

  public getSnapshot(): TimerSnapshot {
    const totalDurationSec = this.getTotalDurationSec();
    const progress = totalDurationSec > 0
      ? Math.min(1, Math.max(0, 1 - this.remainingSec / totalDurationSec))
      : 0;

    return {
      mode: this.mode,
      status: this.status,
      timeRemainingSec: this.remainingSec,
      totalDurationSec,
      progress,
      targetTimestamp: this.targetTimestamp,
      hasCompletedDispatched: this.hasCompletedDispatched,
    };
  }

  public start(now: number = Date.now()): TimerSnapshot {
    if (this.status === 'running') {
      return this.getSnapshot();
    }

    if (this.status === 'completed' || this.remainingSec <= 0) {
      this.remainingSec = this.getTotalDurationSec();
    }

    this.status = 'running';
    this.targetTimestamp = now + this.remainingSec * 1000;
    this.hasCompletedDispatched = false;

    const snapshot = this.getSnapshot();
    this.onTick?.(snapshot);
    return snapshot;
  }

  public pause(): TimerSnapshot {
    if (this.status !== 'running') {
      return this.getSnapshot();
    }

    this.status = 'paused';
    this.targetTimestamp = null;

    const snapshot = this.getSnapshot();
    this.onTick?.(snapshot);
    return snapshot;
  }

  public resume(now: number = Date.now()): TimerSnapshot {
    if (this.status !== 'paused') {
      return this.getSnapshot();
    }

    this.status = 'running';
    this.targetTimestamp = now + this.remainingSec * 1000;

    const snapshot = this.getSnapshot();
    this.onTick?.(snapshot);
    return snapshot;
  }

  public reset(): TimerSnapshot {
    this.status = 'idle';
    this.remainingSec = this.getTotalDurationSec();
    this.targetTimestamp = null;
    this.hasCompletedDispatched = false;

    const snapshot = this.getSnapshot();
    this.onTick?.(snapshot);
    return snapshot;
  }

  public switchMode(newMode: TimerMode): TimerSnapshot {
    this.mode = newMode;
    this.status = 'idle';
    this.remainingSec = this.getTotalDurationSec();
    this.targetTimestamp = null;
    this.hasCompletedDispatched = false;

    const snapshot = this.getSnapshot();
    this.onTick?.(snapshot);
    return snapshot;
  }

  public updateDurations(
    focusDurationSec: number,
    breakDurationSec: number,
    now: number = Date.now()
  ): TimerSnapshot {
    this.focusDurationSec = Math.max(1, focusDurationSec);
    this.breakDurationSec = Math.max(1, breakDurationSec);

    const totalDurationSec = this.getTotalDurationSec();

    if (this.status === 'idle') {
      this.remainingSec = totalDurationSec;
    } else {
      this.remainingSec = Math.min(this.remainingSec, totalDurationSec);
      if (this.status === 'running') {
        this.targetTimestamp = now + this.remainingSec * 1000;
      }
    }

    const snapshot = this.getSnapshot();
    this.onTick?.(snapshot);
    return snapshot;
  }

  public tick(now: number = Date.now()): TimerSnapshot {
    if (this.status !== 'running' || this.targetTimestamp === null) {
      return this.getSnapshot();
    }

    const diffMs = this.targetTimestamp - now;
    const remaining = Math.max(0, Math.ceil(diffMs / 1000));
    this.remainingSec = remaining;

    if (this.remainingSec <= 0) {
      this.status = 'completed';
      this.targetTimestamp = null;

      if (!this.hasCompletedDispatched) {
        this.hasCompletedDispatched = true;
        this.onComplete?.(this.mode);
      }
    }

    const snapshot = this.getSnapshot();
    this.onTick?.(snapshot);
    return snapshot;
  }

  public destroy(): void {
    this.onTick = undefined;
    this.onComplete = undefined;
    this.targetTimestamp = null;
  }
}
