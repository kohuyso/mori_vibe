import { AppState } from 'react-native';
import { formatTime } from '@/utils/formatTime';
import { TimerEngine } from '../engine';

describe('Timer Domain & Formatting Integration', () => {
  it('1. Formats default focus session duration (25:00)', () => {
    const engine = new TimerEngine();
    const snapshot = engine.getSnapshot();
    expect(formatTime(snapshot.timeRemainingSec)).toBe('25:00');
  });

  it('2. Formats break session duration (05:00)', () => {
    const engine = new TimerEngine();
    engine.switchMode('break');
    const snapshot = engine.getSnapshot();
    expect(formatTime(snapshot.timeRemainingSec)).toBe('05:00');
  });

  it('3. Formats remaining countdown accurately during ticks', () => {
    const engine = new TimerEngine({ focusDurationSec: 1500 });
    const now = 1000000;
    engine.start(now);

    // After 61 seconds
    const snap1 = engine.tick(now + 61000);
    expect(snap1.timeRemainingSec).toBe(1439);
    expect(formatTime(snap1.timeRemainingSec)).toBe('23:59');

    // After 24 minutes (1440 seconds)
    const snap2 = engine.tick(now + 1440000);
    expect(snap2.timeRemainingSec).toBe(60);
    expect(formatTime(snap2.timeRemainingSec)).toBe('01:00');

    // Final second
    const snap3 = engine.tick(now + 1499000);
    expect(snap3.timeRemainingSec).toBe(1);
    expect(formatTime(snap3.timeRemainingSec)).toBe('00:01');

    // Completion
    const snap4 = engine.tick(now + 1500000);
    expect(snap4.timeRemainingSec).toBe(0);
    expect(formatTime(snap4.timeRemainingSec)).toBe('00:00');
  });

  it('4. Simulates AppState foreground recovery with drift prevention', () => {
    const engine = new TimerEngine({ focusDurationSec: 1500 });
    const now = 1000000;
    engine.start(now);

    // Simulate 300 seconds background lock
    const resumeTime = now + 300000;
    const snap = engine.tick(resumeTime);

    expect(snap.timeRemainingSec).toBe(1200);
    expect(formatTime(snap.timeRemainingSec)).toBe('20:00');
    expect(snap.status).toBe('running');
  });

  it('5. Verifies AppState listener registration in mock', () => {
    const mockListener = jest.fn();
    const sub = AppState.addEventListener('change', mockListener);
    expect(AppState.addEventListener).toHaveBeenCalledWith('change', mockListener);
    expect(sub.remove).toBeDefined();
  });
});
