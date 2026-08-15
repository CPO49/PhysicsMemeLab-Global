import { describe, expect, it } from 'vitest'
import { resolveWorldMapIslands } from './worldMapData'

describe('resolveWorldMapIslands', () => {
  it('keeps Momentum Island locked before the projectile mission is complete', () => {
    expect(resolveWorldMapIslands([]).find((island) => island.id === 'momentum')?.status).toBe('locked')
  })

  it('activates Momentum Island after the projectile mission is complete', () => {
    expect(resolveWorldMapIslands(['projectile-basic-shot']).find((island) => island.id === 'momentum')?.status).toBe('active')
  })

  it('removes the Power 67 lock after the electric mission is complete', () => {
    expect(resolveWorldMapIslands(['momentum-electric-voltage']).find((island) => island.id === 'power67')?.status).toBe('coming-soon')
  })
})
