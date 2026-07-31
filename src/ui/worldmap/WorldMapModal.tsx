import { useEffect } from 'react'
import { th } from '../../content/th'
import type { WorldMapIsland } from '../../data/worldMapData'
import type { MapPanel, UiState } from '../../state/uiState'

type Props = { panel: MapPanel; island: WorldMapIsland | null; ui: UiState; onClose: () => void; onToggleSound: () => void; onToggleAnimations: () => void }
export function WorldMapModal({ panel, island, ui, onClose, onToggleSound, onToggleAnimations }: Props) {
  useEffect(() => { const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }; window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey) }, [onClose])
  if (!panel) return null
  const title = panel === 'missions' ? th.g3.missionPanel : panel === 'statistics' ? th.g3.statisticsPanel : panel === 'collection' ? th.g3.collectionPanel : panel === 'settings' ? th.g3.settingsPanel : panel === 'locked' ? island?.localName ?? th.locked : th.g3.comingSoonTitle
  return <div className="g3-map-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}><section className="g3-map-modal" role="dialog" aria-modal="true" aria-labelledby="map-modal-title"><button className="g3-map-modal__close" type="button" onClick={onClose} aria-label={th.g3.close}>×</button><h2 id="map-modal-title">{title}</h2>
    {panel === 'missions' && <p>{th.hubTitle}</p>}{panel === 'statistics' && <p>สถิติการเรียนรู้กำลังเตรียมให้สำรวจ</p>}{panel === 'collection' && <p>ของสะสมจะปลดล็อกเมื่อผ่านภารกิจ</p>}{panel === 'locked' && <p><strong>{th.g3.unlockCondition}:</strong> {island?.unlockCondition}</p>}{panel === 'comingSoon' && <p>{th.comingSoon}</p>}
    {panel === 'settings' && <div className="g3-map-modal__settings"><button type="button" onClick={onToggleSound} aria-pressed={ui.soundEnabled}>{th.g3.sound}: {ui.soundEnabled ? 'ON' : 'OFF'}</button><button type="button" onClick={onToggleAnimations} aria-pressed={ui.animationsEnabled}>{th.g3.animations}: {ui.animationsEnabled ? 'ON' : 'OFF'}</button></div>}
    <button className="g3-map-modal__confirm" type="button" onClick={onClose}>{th.g3.close}</button>
  </section></div>
}
