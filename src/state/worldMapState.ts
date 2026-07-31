export type WorldMapProgress = Record<'projectile' | 'momentum' | 'power67' | 'friction' | 'energy' | 'mystery', number>

export const initialWorldMapProgress: WorldMapProgress = {
  projectile: 12,
  momentum: 0,
  power67: 0,
  friction: 0,
  energy: 0,
  mystery: 0,
}

export const starsFromProgress = (progress: number) => Math.min(3, Math.floor(progress / 10))
