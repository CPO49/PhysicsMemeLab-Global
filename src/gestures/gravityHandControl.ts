import type { HandLandmarks } from '../camera/handDetector'

const WRIST = 0
const THUMB_TIP = 4
const INDEX_TIP = 8
const PALM_CENTER = 9
const MASS_FINGERTIPS = [12, 16, 20]

export type MassGesture = 'increase' | 'decrease' | 'neutral'

export type GravityHandIntent = {
  cursor: { x: number; y: number }
  pinching: boolean
  massGesture: MassGesture
}

function distance(a: { x: number; y: number }, b: { x: number; y: number }): number {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

export function getGravityHandIntent(landmarks: HandLandmarks): GravityHandIntent {
  const wrist = landmarks[WRIST]
  const palm = landmarks[PALM_CENTER]
  const handSize = Math.max(0.001, distance(wrist, palm))
  const pinchRatio = distance(landmarks[THUMB_TIP], landmarks[INDEX_TIP]) / handSize
  const fingerSpread = MASS_FINGERTIPS.reduce((sum, index) => sum + distance(landmarks[index], palm), 0) / MASS_FINGERTIPS.length / handSize
  const pinching = pinchRatio < 0.48

  return {
    cursor: { x: 1 - landmarks[INDEX_TIP].x, y: landmarks[INDEX_TIP].y },
    pinching,
    massGesture: fingerSpread > 1.55 ? 'increase' : fingerSpread < 1.02 ? 'decrease' : 'neutral',
  }
}
