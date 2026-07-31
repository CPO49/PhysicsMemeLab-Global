import { initialWorldMapProgress, type WorldMapProgress } from './worldMapState'

export type PersistedGameState = { version: 1; progress: WorldMapProgress; completedMissions: string[] }
export const GAME_STATE_STORAGE_KEY = 'memePhysics.gameState.v1'
export const initialPersistedGameState: PersistedGameState = { version: 1, progress: initialWorldMapProgress, completedMissions: [] }

export function loadGameState(): PersistedGameState {
  try {
    const value = JSON.parse(window.localStorage.getItem(GAME_STATE_STORAGE_KEY) ?? '') as Partial<PersistedGameState>
    if (value.version !== 1 || !value.progress) return initialPersistedGameState
    return { version: 1, progress: { ...initialWorldMapProgress, ...value.progress }, completedMissions: Array.isArray(value.completedMissions) ? value.completedMissions : [] }
  } catch { return initialPersistedGameState }
}

export function completeProjectileMission(state: PersistedGameState, stars: number): PersistedGameState {
  const safeStars = Math.max(1, Math.min(3, Math.round(stars)))
  return {
    ...state,
    progress: { ...state.progress, projectile: Math.max(state.progress.projectile, safeStars * 10) },
    completedMissions: state.completedMissions.includes('projectile-basic-shot') ? state.completedMissions : [...state.completedMissions, 'projectile-basic-shot'],
  }
}

export function saveGameState(state: PersistedGameState) {
  try { window.localStorage.setItem(GAME_STATE_STORAGE_KEY, JSON.stringify(state)) } catch { /* local storage is optional */ }
}
