/** Seconds to `m:ss`, with the degenerate values the audio element reports. */
export function formatTime(time: number): string {
  if (!time || Number.isNaN(time) || time === Infinity) return '0:00'
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}
