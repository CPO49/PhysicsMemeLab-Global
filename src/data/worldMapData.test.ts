import { describe, expect, it } from 'vitest'
import { resolveWorldMapIslands } from './worldMapData'

describe('resolveWorldMapIslands', () => {
  it('keeps Momentum Island locked before the projectile mission is complete', () => {
    expect(resolveWorldMapIslands([]).find((island) => island.id === 'momentum')?.status).toBe('locked')
  })

  it('activates Momentum Island after the projectile mission is complete', () => {
    expect(resolveWorldMapIslands(['projectile-basic-shot']).find((island) => island.id === 'momentum')?.status).toBe('active')
  })

  it('activates Gravity Island after the electric mission is complete', () => {
    const island = resolveWorldMapIslands(['momentum-electric-voltage']).find((entry) => entry.id === 'power67')
    expect(island).toMatchObject({ status: 'active', name: 'Gravity Island' })
  })
})
