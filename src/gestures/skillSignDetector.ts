import type { HandLandmarks } from '../camera/handDetector'

const TOGETHER_THRESHOLD = 0.28
const APART_THRESHOLD = 0.42
const CONFIRM_FRAMES = 8
// Tolerate brief detection drops (30fps camera vs 60fps RAF loop)
const LOST_FRAMES_BEFORE_RESET = 12

export type SignPhase = 'waiting' | 'confirming_together' | 'step1_done' | 'confirming_apart' | 'complete'

export interface SkillSignState {
  phase: SignPhase
  confirmFrames: number
  lostFrames: number
}

export const initialSkillSignState: SkillSignState = {
  phase: 'waiting',
  confirmFrames: 0,
  lostFrames: 0,
}

function wristDist(hands: HandLandmarks[]): number | null {
  if (hands.length < 2) return null
  const a = hands[0][0]
  const b = hands[1][0]
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2)
}

export function updateSkillSign(
  prev: SkillSignState,
  hands: HandLandmarks[],
): { state: SkillSignState; step1: boolean; step2: boolean } {
  const dist = wristDist(hands)

  if (prev.phase === 'complete') {
    return { state: prev, step1: false, step2: false }
  }

  // No hands detected — hold current state for a few frames before resetting
  if (dist === null) {
    const lostFrames = prev.lostFrames + 1
    if (lostFrames < LOST_FRAMES_BEFORE_RESET) {
      // Brief drop: keep confirmFrames intact so progress isn't lost
      return { state: { ...prev, lostFrames }, step1: false, step2: false }
    }
    // Long absence: reset confirm counter (but keep phase)
    return { state: { ...prev, confirmFrames: 0, lostFrames }, step1: false, step2: false }
  }

  // Hands detected — reset lost counter
  const lostFrames = 0

  switch (prev.phase) {
    case 'waiting':
    case 'confirming_together': {
      if (dist < TOGETHER_THRESHOLD) {
        const confirmFrames = prev.confirmFrames + 1
        if (confirmFrames >= CONFIRM_FRAMES) {
          return { state: { phase: 'step1_done', confirmFrames: 0, lostFrames }, step1: true, step2: false }
        }
        return { state: { phase: 'confirming_together', confirmFrames, lostFrames }, step1: false, step2: false }
      }
      return { state: { phase: 'waiting', confirmFrames: 0, lostFrames }, step1: false, step2: false }
    }

    case 'step1_done':
    case 'confirming_apart': {
      if (dist > APART_THRESHOLD) {
        const confirmFrames = prev.confirmFrames + 1
        if (confirmFrames >= CONFIRM_FRAMES) {
          return { state: { phase: 'complete', confirmFrames: 0, lostFrames }, step1: false, step2: true }
        }
        return { state: { phase: 'confirming_apart', confirmFrames, lostFrames }, step1: false, step2: false }
      }
      return { state: { phase: 'step1_done', confirmFrames: 0, lostFrames }, step1: false, step2: false }
    }

    default:
      return { state: prev, step1: false, step2: false }
  }
}
