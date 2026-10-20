/**
 * Formats seconds into MM:SS format with leading zeros.
 * Negative numbers or invalid numbers are clamped to 00:00.
 */
export function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds <= 0) {
    return '00:00';
  }

  const safeSec = Math.floor(seconds);
  const mins = Math.floor(safeSec / 60);
  const secs = safeSec % 60;

  const pad = (n: number): string => (n < 10 ? `0${n}` : `${n}`);
  return `${pad(mins)}:${pad(secs)}`;
}
