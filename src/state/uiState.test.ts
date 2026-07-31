import { describe, expect, it } from 'vitest'
import { closeUiOverlay, initialUiState, openMapPanel, selectInputMode, toggleAnimations, toggleProfile, toggleSound } from './uiState'

describe('G.3 UI state', () => {
  it('selects each input mode without changing resources', () => {
    expect(selectInputMode(initialUiState, 'camera').inputMode).toBe('camera')
    expect(selectInputMode(initialUiState, 'gesture').inputMode).toBe('gesture')
    expect(selectInputMode(initialUiState, 'mouse')).toMatchObject({ inputMode: 'mouse', energy: 67, diamonds: 670 })
  })

  it('opens and closes profile/menu overlays and settings toggles', () => {
    const profile = toggleProfile(initialUiState)
    const menu = openMapPanel(profile, 'settings')
    expect(menu).toMatchObject({ profileOpen: false, activePanel: 'settings' })
    expect(toggleSound(menu).soundEnabled).toBe(false)
    expect(toggleAnimations(menu).animationsEnabled).toBe(false)
    expect(closeUiOverlay(menu)).toMatchObject({ profileOpen: false, activePanel: null })
  })
})
