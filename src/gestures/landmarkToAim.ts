import type { HandLandmarks } from '../camera/handDetector'

const WRIST = 0

export type AimInput = { angle: number; speed: number }

// Grab anchor: the wrist position when the fist was first closed
// We measure drag distance from this anchor to compute aim
export function landmarksToAim(
  landmarks: HandLandmarks,
  grabAnchor: { x: number; y: number },
): AimInput {
  const wrist = landmarks[WRIST]

  // dx: how far right the hand has moved since grab (0..1 normalised coords)
  // Moving right = higher angle, moving left = lower angle
  const dx = wrist.x - grabAnchor.x  // positive = moved right in camera (mirrored = moved left on screen)
  const dy = grabAnchor.y - wrist.y  // positive = moved up

  // Angle: 45° base, ±25° from horizontal movement
  // Camera coords are mirrored (x=0 is right side of screen for user)
  // So moving hand right in camera = angle goes down
  const angle = Math.round(Math.max(15, Math.min(75, 45 + dx * -120)))

  // Speed: base 20, drag upward increases power, drag down decreases
  const speed = Math.round(Math.max(12, Math.min(38, 25 + dy * 60)))

  return { angle, speed }
}

// Wrist position in normalised 0..1 coords → simple aim when no anchor
export function wristToBaseAim(landmarks: HandLandmarks): AimInput {
  const wrist = landmarks[WRIST]
  // x=0 = right of camera frame (mirrored display), x=1 = left
  // Map so center = 45°, edges = 15°/75°
  const angle = Math.round(Math.max(15, Math.min(75, (1 - wrist.x) * 60 + 15)))
  const speed = 25
  return { angle, speed }
}
