import type { HandLandmarks } from '../camera/handDetector'

const WRIST = 0
const PALM_CENTER = 9
const FINGERTIPS = [4, 8, 12, 16, 20]

export type GesturePhase = 'idle' | 'hover' | 'grabbed' | 'aiming' | 'released'

export interface GestureState {
  phase: GesturePhase
  fistFrames: number
  openFrames: number
  lostFrames: number // consecutive frames with no hand detected
  wrist: { x: number; y: number } | null
}

export const initialGestureState: GestureState = {
  phase: 'idle',
  fistFrames: 0,
  openFrames: 0,
  lostFrames: 0,
  wrist: null,
}

// Require more consecutive frames to confirm state change → reduces false transitions
const FIST_CONFIRM_FRAMES = 6
// Release should feel snappy — fewer frames than grab confirmation
const OPEN_CONFIRM_FRAMES = 3
// Hold current state for this many frames when hand goes missing → prevents flicker
const LOST_FRAMES_BEFORE_IDLE = 20  // ~0.67s at 30fps

function getDistance(
  a: { x: number; y: number; z: number },
  b: { x: number; y: number; z: number },
): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2)
}

export function isFist(landmarks: HandLandmarks): boolean {
  const palm = landmarks[PALM_CENTER]
  const wrist = landmarks[WRIST]
  const handSize = getDistance(wrist, palm)
  if (handSize < 0.01) return false

  const avgFingertipDist =
    FINGERTIPS.reduce((sum, idx) => sum + getDistance(landmarks[idx], palm), 0) /
    FINGERTIPS.length

  // Normalised by hand size — threshold tuned for webcam side/front views
  return avgFingertipDist / handSize < 0.8
}

export function updateGestureState(
  prev: GestureState,
  landmarks: HandLandmarks | null,
): GestureState {
  // No hand detected — hold current phase for LOST_FRAMES_BEFORE_IDLE frames
  if (!landmarks) {
    const lostFrames = prev.lostFrames + 1

    if (prev.phase === 'grabbed' || prev.phase === 'aiming') {
      // Hand disappeared while aiming — treat as release after brief hold
      if (lostFrames >= LOST_FRAMES_BEFORE_IDLE) {
        return { phase: 'released', fistFrames: 0, openFrames: 0, lostFrames: 0, wrist: null }
      }
      return { ...prev, lostFrames }
    }

    // For idle/hover/released: hold the current phase until threshold
    if (lostFrames < LOST_FRAMES_BEFORE_IDLE) {
      return { ...prev, lostFrames }
    }

    return { phase: 'idle', fistFrames: 0, openFrames: 0, lostFrames, wrist: null }
  }

  // Hand detected — reset lost counter
  const wrist = { x: landmarks[WRIST].x, y: landmarks[WRIST].y }
  const fist = isFist(landmarks)
  const fistFrames = fist ? prev.fistFrames + 1 : 0
  const openFrames = !fist ? prev.openFrames + 1 : 0
  const lostFrames = 0

  switch (prev.phase) {
    case 'idle':
    case 'hover': {
      if (fistFrames >= FIST_CONFIRM_FRAMES) {
        return { phase: 'grabbed', fistFrames, openFrames: 0, lostFrames, wrist }
      }
      return { phase: 'hover', fistFrames, openFrames, lostFrames, wrist }
    }

    case 'grabbed':
    case 'aiming': {
      if (openFrames >= OPEN_CONFIRM_FRAMES) {
        return { phase: 'released', fistFrames: 0, openFrames: 0, lostFrames, wrist }
      }
      // Keep accumulating openFrames — resetting it here would block release forever
      return { phase: 'aiming', fistFrames, openFrames, lostFrames, wrist }
    }

    case 'released': {
      return { phase: 'hover', fistFrames: 0, openFrames, lostFrames, wrist }
    }
  }
}
