import { formatTime } from '../formatTime';

describe('formatTime utility', () => {
  it('formats 0 seconds as 00:00', () => {
    expect(formatTime(0)).toBe('00:00');
  });

  it('clamps negative numbers to 00:00', () => {
    expect(formatTime(-15)).toBe('00:00');
    expect(formatTime(-1)).toBe('00:00');
  });

  it('handles NaN or invalid inputs gracefully', () => {
    expect(formatTime(NaN)).toBe('00:00');
  });

  it('formats sub-minute times with leading zero', () => {
    expect(formatTime(5)).toBe('00:05');
    expect(formatTime(9)).toBe('00:09');
    expect(formatTime(45)).toBe('00:45');
    expect(formatTime(59)).toBe('00:59');
  });

  it('formats standard Pomodoro 25:00 correctly', () => {
    expect(formatTime(25 * 60)).toBe('25:00');
  });

  it('formats short break 05:00 correctly', () => {
    expect(formatTime(5 * 60)).toBe('05:00');
  });

  it('formats arbitrary minute:second combinations correctly', () => {
    expect(formatTime(65)).toBe('01:05');
    expect(formatTime(125)).toBe('02:05');
    expect(formatTime(1499)).toBe('24:59');
    expect(formatTime(3600)).toBe('60:00');
  });

  it('floors fractional seconds without jumping', () => {
    expect(formatTime(59.9)).toBe('00:59');
    expect(formatTime(60.1)).toBe('01:00');
  });
});
