import {
  DEFAULT_BREAK_DURATION_SEC,
  DEFAULT_FOCUS_DURATION_SEC,
  TimerEngine,
} from '../engine';

describe('TimerEngine (Pure Domain Logic)', () => {
  const START_TIME = 1000000;

  it('1. Initializes with default values correctly', () => {
    const engine = new TimerEngine();
    const snapshot = engine.getSnapshot();

    expect(snapshot.mode).toBe('focus');
    expect(snapshot.status).toBe('idle');
    expect(snapshot.timeRemainingSec).toBe(DEFAULT_FOCUS_DURATION_SEC);
    expect(snapshot.totalDurationSec).toBe(DEFAULT_FOCUS_DURATION_SEC);
    expect(snapshot.progress).toBe(0);
    expect(snapshot.targetTimestamp).toBeNull();
    expect(snapshot.hasCompletedDispatched).toBe(false);
  });

  it('2. Initializes with custom durations', () => {
    const engine = new TimerEngine({
      focusDurationSec: 3000,
      breakDurationSec: 600,
    });

    expect(engine.getTotalDurationSec()).toBe(3000);
    expect(engine.getSnapshot().timeRemainingSec).toBe(3000);

    engine.switchMode('break');
    expect(engine.getTotalDurationSec()).toBe(600);
    expect(engine.getSnapshot().timeRemainingSec).toBe(600);
  });

  it('3. Starts running and computes target timestamp', () => {
    const onTick = jest.fn();
    const engine = new TimerEngine({ onTick });

    const snapshot = engine.start(START_TIME);

    expect(snapshot.status).toBe('running');
    expect(snapshot.targetTimestamp).toBe(START_TIME + DEFAULT_FOCUS_DURATION_SEC * 1000);
    expect(snapshot.timeRemainingSec).toBe(DEFAULT_FOCUS_DURATION_SEC);
    expect(onTick).toHaveBeenCalledWith(snapshot);

    // Calling start again when already running does nothing
    const secondStart = engine.start(START_TIME + 1000);
    expect(secondStart.targetTimestamp).toBe(snapshot.targetTimestamp);
  });

  it('4. Ticks accurately and updates progress', () => {
    const onTick = jest.fn();
    const engine = new TimerEngine({
      focusDurationSec: 100,
      breakDurationSec: 50,
      onTick,
    });

    engine.start(START_TIME);
    onTick.mockClear();

    // Advance 10 seconds
    const snap1 = engine.tick(START_TIME + 10000);
    expect(snap1.timeRemainingSec).toBe(90);
    expect(snap1.progress).toBeCloseTo(0.1, 4);
    expect(onTick).toHaveBeenCalledWith(snap1);

    // Advance 50 seconds (total 50s passed)
    const snap2 = engine.tick(START_TIME + 50000);
    expect(snap2.timeRemainingSec).toBe(50);
    expect(snap2.progress).toBeCloseTo(0.5, 4);
  });

  it('5. Pauses properly, clears target timestamp, and retains remaining time', () => {
    const engine = new TimerEngine({ focusDurationSec: 100 });
    engine.start(START_TIME);

    // Tick 25 seconds
    engine.tick(START_TIME + 25000);
    expect(engine.getSnapshot().timeRemainingSec).toBe(75);

    // Pause
    const pausedSnap = engine.pause();
    expect(pausedSnap.status).toBe('paused');
    expect(pausedSnap.targetTimestamp).toBeNull();
    expect(pausedSnap.timeRemainingSec).toBe(75);

    // Calling pause when not running returns current snapshot safely
    const pauseWhileIdle = new TimerEngine().pause();
    expect(pauseWhileIdle.status).toBe('idle');

    // Ticking while paused does not change remaining time
    const tickWhilePaused = engine.tick(START_TIME + 50000);
    expect(tickWhilePaused.timeRemainingSec).toBe(75);
    expect(tickWhilePaused.status).toBe('paused');
  });

  it('6. Resumes with a newly calculated target timestamp', () => {
    const engine = new TimerEngine({ focusDurationSec: 100 });

    // Calling resume when not paused returns current snapshot safely
    const resumeWhileIdle = engine.resume();
    expect(resumeWhileIdle.status).toBe('idle');

    engine.start(START_TIME);
    engine.tick(START_TIME + 30000); // 70 seconds remaining
    engine.pause();

    // User stays paused for 5 minutes (300,000ms), then resumes at a new time
    const RESUME_TIME = START_TIME + 330000;
    const resumedSnap = engine.resume(RESUME_TIME);

    expect(resumedSnap.status).toBe('running');
    expect(resumedSnap.timeRemainingSec).toBe(70);
    expect(resumedSnap.targetTimestamp).toBe(RESUME_TIME + 70 * 1000);

    // Tick 10 seconds after resume
    const afterTick = engine.tick(RESUME_TIME + 10000);
    expect(afterTick.timeRemainingSec).toBe(60);
  });

  it('7. Switches mode and resets state to idle', () => {
    const engine = new TimerEngine({
      focusDurationSec: 1500,
      breakDurationSec: 300,
    });
    engine.start(START_TIME);
    engine.tick(START_TIME + 50000);

    const breakSnap = engine.switchMode('break');
    expect(breakSnap.mode).toBe('break');
    expect(breakSnap.status).toBe('idle');
    expect(breakSnap.timeRemainingSec).toBe(300);
    expect(breakSnap.totalDurationSec).toBe(300);
    expect(breakSnap.progress).toBe(0);
    expect(breakSnap.targetTimestamp).toBeNull();

    const focusSnap = engine.switchMode('focus');
    expect(focusSnap.mode).toBe('focus');
    expect(focusSnap.status).toBe('idle');
    expect(focusSnap.timeRemainingSec).toBe(1500);
  });

  it('8. Resets timer back to initial state', () => {
    const engine = new TimerEngine({ focusDurationSec: 500 });
    engine.start(START_TIME);
    engine.tick(START_TIME + 200000);

    const resetSnap = engine.reset();
    expect(resetSnap.status).toBe('idle');
    expect(resetSnap.timeRemainingSec).toBe(500);
    expect(resetSnap.targetTimestamp).toBeNull();
    expect(resetSnap.progress).toBe(0);
    expect(resetSnap.hasCompletedDispatched).toBe(false);
  });

  it('9. Demonstrates timestamp drift resilience during backgrounding (ADR-001)', () => {
    const engine = new TimerEngine({ focusDurationSec: 1500 });
    engine.start(START_TIME);

    // Simulate phone being locked or app in background for 120 seconds (120,000ms)
    // When app resumes, a single tick occurs with current Date.now()
    const appResumeTime = START_TIME + 120000;
    const snapshot = engine.tick(appResumeTime);

    expect(snapshot.timeRemainingSec).toBe(1500 - 120);
    expect(snapshot.progress).toBeCloseTo(120 / 1500, 4);
    expect(snapshot.status).toBe('running');
  });

  it('10. Prevents duplicate completion dispatch upon timer expiration', () => {
    const onComplete = jest.fn();
    const engine = new TimerEngine({
      focusDurationSec: 10,
      onComplete,
    });

    engine.start(START_TIME);

    // Advance to 10 seconds (exact finish)
    const completedSnap = engine.tick(START_TIME + 10000);
    expect(completedSnap.status).toBe('completed');
    expect(completedSnap.timeRemainingSec).toBe(0);
    expect(completedSnap.progress).toBe(1);
    expect(completedSnap.targetTimestamp).toBeNull();
    expect(completedSnap.hasCompletedDispatched).toBe(true);
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(onComplete).toHaveBeenCalledWith('focus');

    // Simulate continued ticks after completion (e.g. interval still firing)
    engine.tick(START_TIME + 11000);
    engine.tick(START_TIME + 15000);
    engine.tick(START_TIME + 20000);

    // onComplete MUST NOT be called again
    expect(onComplete).toHaveBeenCalledTimes(1);

    // Restarting timer allows completion to fire again on next cycle
    engine.start(START_TIME + 30000);
    expect(engine.getSnapshot().hasCompletedDispatched).toBe(false);
    engine.tick(START_TIME + 40000);
    expect(onComplete).toHaveBeenCalledTimes(2);
  });

  it('11. Updates durations when idle and running', () => {
    const engine = new TimerEngine({
      focusDurationSec: 1500,
      breakDurationSec: 300,
    });

    // Update while idle
    engine.updateDurations(1200, 400);
    expect(engine.getSnapshot().timeRemainingSec).toBe(1200);
    expect(engine.getSnapshot().totalDurationSec).toBe(1200);

    // Start running
    engine.start(START_TIME);
    engine.tick(START_TIME + 200000); // 1000s left

    // Update duration while running with clamp
    engine.updateDurations(900, 400, START_TIME + 200000);
    expect(engine.getSnapshot().totalDurationSec).toBe(900);
    expect(engine.getSnapshot().timeRemainingSec).toBe(900);
  });

  it('12. Cleans up callbacks and state on destroy', () => {
    const onTick = jest.fn();
    const onComplete = jest.fn();
    const engine = new TimerEngine({ onTick, onComplete });

    engine.destroy();
    engine.start(START_TIME);

    expect(onTick).not.toHaveBeenCalled();
    expect(onComplete).not.toHaveBeenCalled();
  });
});
