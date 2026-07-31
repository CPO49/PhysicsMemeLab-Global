import { useEffect, useRef } from 'react'
import { th } from '../../content/th'
import type { UiState } from '../../state/uiState'
import { gameUiAssets } from '../gameUiAssets'

export function WorldMapHud({ ui, onToggleProfile, onCloseProfile }: { ui: UiState; onToggleProfile: () => void; onCloseProfile: () => void }) {
  const profileRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const closeOnOutside = (event: PointerEvent) => { if (profileRef.current && !profileRef.current.contains(event.target as Node)) onCloseProfile() }
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') onCloseProfile() }
    document.addEventListener('pointerdown', closeOnOutside); document.addEventListener('keydown', closeOnEscape)
    return () => { document.removeEventListener('pointerdown', closeOnOutside); document.removeEventListener('keydown', closeOnEscape) }
  }, [onCloseProfile])
  return <header className="g3-map-hud" aria-label="สถานะผู้เล่น">
    <div className="g3-map-hud__resource"><img src={gameUiAssets.hud.energy} alt="" /><span aria-hidden="true" /><b>{ui.energy}</b></div>
    <div className="g3-map-hud__resource"><img src={gameUiAssets.hud.diamond} alt="" /><span aria-hidden="true" /><b>{ui.diamonds}</b></div>
    <div className="g3-map-hud__profile" ref={profileRef}><button type="button" onClick={onToggleProfile} aria-expanded={ui.profileOpen} aria-label="เปิดข้อมูลผู้เล่น"><img className="g3-map-hud__profile-frame" src={gameUiAssets.hud.profile} alt="" /><img className="g3-map-hud__avatar" src={gameUiAssets.hud.avatar} alt="" /><b>{th.landingMap.playerName}</b><span aria-hidden="true" /></button>
      {ui.profileOpen && <div className="g3-map-hud__dropdown" role="dialog" aria-label="ข้อมูลผู้เล่น"><strong>{th.g3.profileGreeting}</strong><small>{ui.energy} Energy · {ui.diamonds} Diamond</small></div>}
    </div>
  </header>
}
