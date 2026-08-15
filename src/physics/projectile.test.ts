import { describe, expect, it } from 'vitest'
import { simulateShot } from './projectile'

describe('simulateShot', () => {
  it('does not report a hit before the projectile reaches the visual target', () => {
    expect(simulateShot(45, 20).hit).toBe(false)
  })

  it('requires a shot to clear the wall and reach the target', () => {
    expect(simulateShot(45, 25).hit).toBe(true)
  })
})
