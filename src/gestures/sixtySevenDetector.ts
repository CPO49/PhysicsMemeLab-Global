import type { HandLandmarks } from '../camera/handDetector'

const WRIST = 0
const DEBOUNCE_MS = 140 // minimum ms between pumps (limits to ~7 pumps/sec max)

export interface SixtySevenState {
  prevDiff: number | null
  lastPumpAt: number
}

export const initialSixtySevenState: SixtySevenState = {
  prevDiff: null,
  lastPumpAt: 0,
}

/**
 * Detects the "67 gesture": two hands alternating up/down like a scale.
 * Returns pumped=true each time the hands cross positions (sign change in Y diff).
 */
export function detectSixtySeven(
  prev: SixtySevenState,
  hands: HandLandmarks[],
  now: number,
): { state: SixtySevenState; pumped: boolean } {
  if (hands.length < 2) {
    return { state: prev, pumped: false }
  }

  const y0 = hands[0][WRIST].y
  const y1 = hands[1][WRIST].y
  const diff = y0 - y1

  const hasPrev = prev.prevDiff !== null
  const signChanged = hasPrev && Math.sign(diff) !== Math.sign(prev.prevDiff!)
  const handsWellSeparated = Math.abs(diff) > 0.03
  const notTooSoon = now - prev.lastPumpAt > DEBOUNCE_MS
  const pumped = signChanged && handsWellSeparated && notTooSoon

  return {
    state: {
      prevDiff: diff,
      lastPumpAt: pumped ? now : prev.lastPumpAt,
    },
    pumped,
  }
}

/** Estimate pumping speed (0–1) based on pumps in the last second */
export function getPumpRate(pumpTimestamps: number[], now: number): number {
  const recent = pumpTimestamps.filter((t) => now - t < 1000)
  return Math.min(1, recent.length / 6) // 6 pumps/sec = max rate
}
