import { th } from '../content/th'
import { assets } from '../ui/assets'
import { assetFallbacks } from '../ui/assetFallbacks'

export type IslandStatus = 'active' | 'locked' | 'coming-soon'
export type IslandId = 'projectile' | 'momentum' | 'power67' | 'friction' | 'energy' | 'mystery'

export type WorldMapIsland = {
  id: IslandId
  name: string
  localName: string
  asset: string
  debugAsset: string
  status: IslandStatus
  isNew?: boolean
  unlockCondition: string
  position: { x: number; y: number; scale?: number }
}

export const worldMapIslands: WorldMapIsland[] = [
  { id: 'projectile', name: 'Projectile Island', localName: th.islandProjectile, asset: assets.final.worldMap.islands.projectile, debugAsset: assetFallbacks.projectileIsland, status: 'active', isNew: true, unlockCondition: '', position: { x: 18, y: 29, scale: 1.04 } },
  { id: 'momentum', name: 'Ohm’s Law', localName: 'Electric Island', asset: assets.final.worldMap.islands.momentum, debugAsset: assetFallbacks.lockedIsland, status: 'locked', unlockCondition: 'Complete the projectile mission', position: { x: 50, y: 29 } },
  { id: 'power67', name: 'Gravity Island', localName: th.islandPower67, asset: assets.final.worldMap.islands.power67, debugAsset: assetFallbacks.lockedIsland, status: 'locked', unlockCondition: 'Complete the Ohm’s law mission', position: { x: 81, y: 29 } },
  { id: 'friction', name: 'Friction Island', localName: th.islandFriction, asset: assets.final.worldMap.islands.friction, debugAsset: assetFallbacks.lockedIsland, status: 'locked', unlockCondition: 'Unlock through the learning path', position: { x: 18, y: 72, scale: .98 } },
  { id: 'energy', name: 'Energy Island', localName: th.islandEnergy, asset: assets.final.worldMap.islands.energy, debugAsset: assetFallbacks.lockedIsland, status: 'locked', unlockCondition: 'Unlock through the learning path', position: { x: 50, y: 72 } },
  { id: 'mystery', name: 'Mystery Island', localName: th.islandMystery, asset: assets.final.worldMap.islands.mystery, debugAsset: assetFallbacks.lockedIsland, status: 'coming-soon', unlockCondition: 'Coming soon', position: { x: 81, y: 72, scale: .98 } },
]

export function resolveWorldMapIslands(completedMissions: readonly string[]): WorldMapIsland[] {
  const momentumUnlocked = completedMissions.includes('projectile-basic-shot')
  const power67Unlocked = completedMissions.includes('momentum-electric-voltage')
  const frictionPreviewUnlocked = completedMissions.includes('gravity-free-fall-lab')
  return worldMapIslands.map((island) =>
    island.id === 'momentum' && momentumUnlocked
      ? { ...island, status: 'active', isNew: true }
      : island.id === 'power67' && power67Unlocked
        ? { ...island, status: 'active', isNew: true }
        : island.id === 'friction' && frictionPreviewUnlocked
          ? { ...island, status: 'coming-soon' }
          : island,
  )
}
