import { describe, expect, it } from 'vitest'
import { addPump, activateTrajectoryVision, initialGameSession, startSkillSign } from '../learning/gameSession'
import { simulateShot } from '../physics/projectile'

describe('deterministic fallback scenario', () => {
  it('requires full energy and two skill steps before vision', () => {
    let state = initialGameSession
    state = addPump(addPump(addPump(addPump(state, 25), 25), 25), 25)
    expect(state.energy).toBe(100)
    state = startSkillSign(state)
    expect(state.skill).toBe('sign-step-1')
    expect(activateTrajectoryVision(state).skill).toBe('active')
  })
  it('keeps deterministic miss and hit attempts distinct', () => {
    const miss = simulateShot(20, 15)
    const hit = simulateShot(45, 25)
    expect(miss.hit).toBe(false)
    expect(hit.hit).toBe(true)
    expect(miss.range).not.toBe(hit.range)
  })
})
