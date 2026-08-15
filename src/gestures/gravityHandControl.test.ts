import { describe, expect, it } from 'vitest'
import type { HandLandmarks } from '../camera/handDetector'
import { getGravityHandIntent } from './gravityHandControl'

function makeLandmarks(fingerDistance: number, pinchDistance = 0.02): HandLandmarks {
  const landmarks = Array.from({ length: 21 }, () => ({ x: 0.5, y: 0.5, z: 0 }))
  landmarks[0] = { x: 0.5, y: 0.8, z: 0 }
  landmarks[9] = { x: 0.5, y: 0.6, z: 0 }
  landmarks[4] = { x: 0.5 - pinchDistance / 2, y: 0.4, z: 0 }
  landmarks[8] = { x: 0.5 + pinchDistance / 2, y: 0.4, z: 0 }
  for (const index of [12, 16, 20]) landmarks[index] = { x: 0.5 + fingerDistance, y: 0.6, z: 0 }
  return landmarks
}

describe('gravity hand control', () => {
  it('uses thumb-index pinch to hold an object', () => {
    expect(getGravityHandIntent(makeLandmarks(0.35)).pinching).toBe(true)
  })

  it('releases when thumb and index finger move apart', () => {
    expect(getGravityHandIntent(makeLandmarks(0.35, 0.16)).pinching).toBe(false)
  })

  it('maps spread fingers to mass increase and curled fingers to decrease', () => {
    expect(getGravityHandIntent(makeLandmarks(0.35)).massGesture).toBe('increase')
    expect(getGravityHandIntent(makeLandmarks(0.05)).massGesture).toBe('decrease')
  })
})
