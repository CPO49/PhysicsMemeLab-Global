import { describe, expect, it } from 'vitest'
import { completeElectricMission, completeGravityMission, completeProjectileMission, initialPersistedGameState } from './gameState'

describe('persisted game state', () => {
  it('records projectile completion and caps progress at 30', () => {
    const result = completeProjectileMission(initialPersistedGameState, 9)
    expect(result.progress.projectile).toBe(30)
    expect(result.completedMissions).toContain('projectile-basic-shot')
  })

  it('records electric mission completion and Momentum progress', () => {
    const result = completeElectricMission(initialPersistedGameState, 3)
    expect(result.progress.momentum).toBe(30)
    expect(result.completedMissions).toContain('momentum-electric-voltage')
  })

  it('records gravity lab completion and Gravity Island progress', () => {
    const result = completeGravityMission(initialPersistedGameState, 3)
    expect(result.progress.power67).toBe(30)
    expect(result.completedMissions).toContain('gravity-free-fall-lab')
  })
})
