import { useState } from 'react'
import { audioManager } from '../../audio/audioManager'
import { assets } from '../assets'
import { IllustratedAsset } from '../components/IllustratedAsset'
import { gameUiAssets } from '../gameUiAssets'
import type { WorldMapIsland } from '../../data/worldMapData'
import { resolveWorldMapIslands } from '../../data/worldMapData'
import type { UiState, MapPanel } from '../../state/uiState'
import type { WorldMapProgress } from '../../state/worldMapState'
import { IslandNode } from './IslandNode'
import { WorldMapHud } from './WorldMapHud'
import { WorldMapModal } from './WorldMapModal'
import { WorldMapSideMenu } from './WorldMapSideMenu'
import './WorldMapPage.css'
import './WorldMapPolish.css'

type Props = { ui: UiState; progress: WorldMapProgress; completedMissions: string[]; onToggleProfile: () => void; onCloseOverlay: () => void; onOpenPanel: (panel: Exclude<MapPanel, null>) => void; onToggleSound: () => void; onChangeSoundVolume: (volume: number) => void; onToggleAnimations: () => void; onEnterProjectile: () => void; onEnterElectric: () => void; onEnterGravity: () => void }
export function WorldMapPage({ ui, progress, completedMissions, onToggleProfile, onCloseOverlay, onOpenPanel, onToggleSound, onChangeSoundVolume, onToggleAnimations, onEnterProjectile, onEnterElectric, onEnterGravity }: Props) {
  const [selectedIsland, setSelectedIsland] = useState<WorldMapIsland | null>(null)
  const islands = resolveWorldMapIslands(completedMissions)
  const openIsland = (island: WorldMapIsland) => { audioManager.play('locked'); setSelectedIsland(island); onOpenPanel(island.status === 'coming-soon' ? 'comingSoon' : 'locked') }
  return <section className="g3-world-map" aria-label="World Map"><IllustratedAsset className="g3-world-map__background" src={assets.final.worldMap.background} alt="" />
    <WorldMapHud ui={ui} onToggleProfile={onToggleProfile} onCloseProfile={onCloseOverlay} />
    <div className="g3-world-map__islands">{islands.map((island) => <IslandNode key={island.id} island={island} progress={progress[island.id]} onEnter={(activeIsland) => activeIsland.id === 'projectile' ? onEnterProjectile() : activeIsland.id === 'momentum' ? onEnterElectric() : onEnterGravity()} onLocked={openIsland} />)}</div>
    <img className="g3-world-map__wheel" src="/assets/generated/decor/ship-wheel.svg" alt="" aria-hidden="true" /><img className="g3-world-map__note" src={gameUiAssets.map.note} alt="" aria-hidden="true" />
    <WorldMapSideMenu activePanel={ui.activePanel} onOpen={onOpenPanel} />
    <WorldMapModal panel={ui.activePanel} island={selectedIsland} ui={ui} onClose={onCloseOverlay} onToggleSound={onToggleSound} onChangeSoundVolume={onChangeSoundVolume} onToggleAnimations={onToggleAnimations} />
  </section>
}
