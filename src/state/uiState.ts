export type InputMode = 'camera' | 'gesture' | 'mouse'
export type MapPanel = 'missions' | 'statistics' | 'collection' | 'settings' | 'locked' | 'comingSoon' | null

export type UiState = {
  inputMode: InputMode
  energy: number
  diamonds: number
  profileOpen: boolean
  activePanel: MapPanel
  soundEnabled: boolean
  animationsEnabled: boolean
}

export const initialUiState: UiState = {
  inputMode: 'mouse',
  energy: 67,
  diamonds: 670,
  profileOpen: false,
  activePanel: null,
  soundEnabled: true,
  animationsEnabled: true,
}

export const selectInputMode = (state: UiState, inputMode: InputMode): UiState => ({ ...state, inputMode })
export const toggleProfile = (state: UiState): UiState => ({ ...state, profileOpen: !state.profileOpen })
export const closeUiOverlay = (state: UiState): UiState => ({ ...state, profileOpen: false, activePanel: null })
export const openMapPanel = (state: UiState, activePanel: Exclude<MapPanel, null>): UiState => ({ ...state, profileOpen: false, activePanel })
export const toggleSound = (state: UiState): UiState => ({ ...state, soundEnabled: !state.soundEnabled })
export const toggleAnimations = (state: UiState): UiState => ({ ...state, animationsEnabled: !state.animationsEnabled })
