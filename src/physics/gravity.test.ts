import { describe, expect, it } from 'vitest'
import { createGravityBody, defaultGravityEnvironment, releaseGravityBody, simulateGravityBody, stepGravityBody } from './gravity'

describe('gravity physics', () => {
  it('falls at the same rate for different masses in a vacuum', () => {
    const light = { ...createGravityBody('ball', 'light'), mass: 0.1 }
    const heavy = { ...createGravityBody('ball', 'heavy'), mass: 10 }
    const lightResult = simulateGravityBody(light, defaultGravityEnvironment, 0.8)
    const heavyResult = simulateGravityBody(heavy, defaultGravityEnvironment, 0.8)
    expect(lightResult.y).toBeCloseTo(heavyResult.y, 8)
    expect(lightResult.vy).toBeCloseTo(heavyResult.vy, 8)
  })

  it('lets a heavier equal-shaped object fall farther when air drag is enabled', () => {
    const environment = { ...defaultGravityEnvironment, mode: 'air' as const }
    const light = { ...createGravityBody('paper', 'light'), mass: 0.05 }
    const heavy = { ...createGravityBody('paper', 'heavy'), mass: 2 }
    const lightResult = simulateGravityBody(light, environment, 0.8)
    const heavyResult = simulateGravityBody(heavy, environment, 0.8)
    expect(heavyResult.y).toBeGreaterThan(lightResult.y)
  })

  it('falls faster when g is increased', () => {
    const body = createGravityBody('ball', 'ball')
    const moon = simulateGravityBody(body, { ...defaultGravityEnvironment, g: 1.62 }, 0.4)
    const jupiter = simulateGravityBody(body, { ...defaultGravityEnvironment, g: 24.79 }, 0.4)
    expect(jupiter.y).toBeGreaterThan(moon.y)
    expect(jupiter.vy).toBeGreaterThan(moon.vy)
  })

  it('starts falling under gravity after a held object is released', () => {
    const held = { ...createGravityBody('ball', 'held', 6, 2), held: true, vx: 8, vy: -4 }
    const released = releaseGravityBody(held)
    const nextFrame = stepGravityBody(released, defaultGravityEnvironment, 1 / 30)

    expect(released).toMatchObject({ held: false, vx: 0, vy: 0 })
    expect(nextFrame.y).toBeGreaterThan(released.y)
    expect(nextFrame.vy).toBeGreaterThan(0)
  })

  it('keeps a fast light object stable under quadratic air drag', () => {
    const feather = { ...createGravityBody('feather', 'feather', 6, 2), vx: 18, vy: -18 }
    const result = simulateGravityBody(feather, { ...defaultGravityEnvironment, mode: 'air' }, 3)

    expect(Number.isFinite(result.x)).toBe(true)
    expect(Number.isFinite(result.y)).toBe(true)
    expect(Number.isFinite(result.vx)).toBe(true)
    expect(Number.isFinite(result.vy)).toBe(true)
    expect(result.x).toBeGreaterThanOrEqual(result.radius)
    expect(result.x).toBeLessThanOrEqual(defaultGravityEnvironment.width - result.radius)
    expect(Math.abs(result.vx)).toBeLessThan(18)
    expect(Math.abs(result.vy)).toBeLessThan(18)
  })
})
