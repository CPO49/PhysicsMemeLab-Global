import { th } from '../../content/th'
import { assets } from '../assets'
import { assetFallbacks } from '../assetFallbacks'

export type IslandStatus = 'active' | 'locked' | 'coming-soon'

export type WorldMapIsland = {
  id: 'projectile' | 'momentum' | 'power67' | 'friction' | 'energy' | 'mystery'
  name: string
  localName: string
  asset: string
  debugAsset: string
  status: IslandStatus
  stars: number
  starTotal: number
  isNew?: boolean
  position: { x: number; y: number; scale?: number }
}

export const worldMapIslands: WorldMapIsland[] = [
  {
    id: 'projectile',
    name: 'Projectile Island',
    localName: th.islandProjectile,
    asset: assets.final.worldMap.islands.projectile,
    debugAsset: assetFallbacks.projectileIsland,
    status: 'active',
    stars: 0,
    starTotal: 30,
    isNew: true,
    position: { x: 18, y: 30, scale: 1.04 },
  },
  {
    id: 'momentum',
    name: 'Momentum Island',
    localName: th.islandMomentum,
    asset: assets.final.worldMap.islands.momentum,
    debugAsset: assetFallbacks.lockedIsland,
    status: 'locked',
    stars: 0,
    starTotal: 30,
    position: { x: 50, y: 29 },
  },
  {
    id: 'power67',
    name: '67 Power Island',
    localName: th.islandPower67,
    asset: assets.final.worldMap.islands.power67,
    debugAsset: assetFallbacks.lockedIsland,
    status: 'locked',
    stars: 0,
    starTotal: 30,
    position: { x: 81, y: 29, scale: 1.02 },
  },
  {
    id: 'friction',
    name: 'Friction Island',
    localName: th.islandFriction,
    asset: assets.final.worldMap.islands.friction,
    debugAsset: assetFallbacks.lockedIsland,
    status: 'locked',
    stars: 0,
    starTotal: 30,
    position: { x: 18, y: 71, scale: 0.98 },
  },
  {
    id: 'energy',
    name: 'Energy Island',
    localName: th.islandEnergy,
    asset: assets.final.worldMap.islands.energy,
    debugAsset: assetFallbacks.lockedIsland,
    status: 'locked',
    stars: 0,
    starTotal: 30,
    position: { x: 50, y: 71 },
  },
  {
    id: 'mystery',
    name: 'Mystery Island',
    localName: th.islandMystery,
    asset: assets.final.worldMap.islands.mystery,
    debugAsset: assetFallbacks.lockedIsland,
    status: 'coming-soon',
    stars: 0,
    starTotal: 30,
    position: { x: 81, y: 71, scale: 0.98 },
  },
]
