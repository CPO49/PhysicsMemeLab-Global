import { useEffect } from 'react'
import { th } from '../../content/th'
import type { WorldMapIsland } from '../../data/worldMapData'
import type { MapPanel, UiState } from '../../state/uiState'

type Props = { panel: MapPanel; island: WorldMapIsland | null; ui: UiState; onClose: () => void; onToggleSound: () => void; onChangeSoundVolume: (volume: number) => void; onToggleAnimations: () => void }
export function WorldMapModal({ panel, island, ui, onClose, onToggleSound, onChangeSoundVolume, onToggleAnimations }: Props) {
  useEffect(() => { const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }; window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey) }, [onClose])
  if (!panel) return null
  const title = panel === 'missions' ? th.g3.missionPanel : panel === 'statistics' ? th.g3.statisticsPanel : panel === 'collection' ? th.g3.collectionPanel : panel === 'settings' ? th.g3.settingsPanel : panel === 'locked' ? island?.localName ?? th.locked : th.g3.comingSoonTitle
  return <div className="g3-map-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}><section className="g3-map-modal" role="dialog" aria-modal="true" aria-labelledby="map-modal-title"><button className="g3-map-modal__close" type="button" onClick={onClose} aria-label={th.g3.close}>×</button><h2 id="map-modal-title">{title}</h2>
    {panel === 'missions' && <p>{th.hubTitle}</p>}{panel === 'statistics' && <p>Learning statistics are coming soon</p>}{panel === 'collection' && <p>Collectibles unlock as you complete missions</p>}{panel === 'locked' && <p><strong>{th.g3.unlockCondition}:</strong> {island?.unlockCondition}</p>}{panel === 'comingSoon' && <p>{th.comingSoon}</p>}
    {panel === 'settings' && <div className="g3-map-modal__settings">
      <button type="button" onClick={onToggleSound} aria-pressed={ui.soundEnabled}>{th.g3.sound}: {ui.soundEnabled ? 'ON' : 'OFF'}</button>
      <div className="g3-map-modal__volume">
        <label htmlFor="master-volume">Volume</label>
        <output htmlFor="master-volume">{ui.soundVolume}%</output>
        <div className="g3-map-modal__volume-controls">
          <button className="g3-map-modal__volume-step" type="button" onClick={() => onChangeSoundVolume(ui.soundVolume - 5)} aria-label="Decrease volume by 5 percent">−</button>
          <input
            id="master-volume"
            type="range"
            min="0"
            max="100"
            step="5"
            value={ui.soundVolume}
            onInput={(event) => onChangeSoundVolume(event.currentTarget.valueAsNumber)}
            onPointerDown={(event) => event.stopPropagation()}
            aria-label={`Volume ${ui.soundVolume} percent`}
          />
          <button className="g3-map-modal__volume-step" type="button" onClick={() => onChangeSoundVolume(ui.soundVolume + 5)} aria-label="Increase volume by 5 percent">+</button>
        </div>
      </div>
      <button type="button" onClick={onToggleAnimations} aria-pressed={ui.animationsEnabled}>{th.g3.animations}: {ui.animationsEnabled ? 'ON' : 'OFF'}</button>
    </div>}
    <button className="g3-map-modal__confirm" type="button" onClick={onClose}>{th.g3.close}</button>
  </section></div>
}
