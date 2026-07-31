import { describe, expect, it } from 'vitest'
import { completeProjectileMission, initialPersistedGameState } from './gameState'

describe('persisted game state', () => {
  it('records projectile completion and caps progress at 30', () => {
    const result = completeProjectileMission(initialPersistedGameState, 9)
    expect(result.progress.projectile).toBe(30)
    expect(result.completedMissions).toContain('projectile-basic-shot')
  })
})
