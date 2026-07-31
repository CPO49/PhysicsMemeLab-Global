export const audioAssets = {
  landingMusic: '/assets/audio/landing-theme.mp3',
  worldMapMusic: '/assets/audio/world-map-theme.mp3',
  projectileAmbience: '/assets/audio/projectile-island-ambience.mp3',
  summarySuccess: '/assets/audio/summary-success.mp3',
} as const

export type AudioScene = 'landing' | 'worldMap' | 'projectile' | 'summary'
export type SoundEffect = 'hover' | 'click' | 'missionStart' | 'locked' | 'charge' | 'skillUnlocked' | 'launch' | 'hit' | 'miss' | 'success'

export const audioScenePaths: Record<AudioScene, string> = {
  landing: audioAssets.landingMusic,
  worldMap: audioAssets.worldMapMusic,
  projectile: audioAssets.projectileAmbience,
  summary: audioAssets.summarySuccess,
}
