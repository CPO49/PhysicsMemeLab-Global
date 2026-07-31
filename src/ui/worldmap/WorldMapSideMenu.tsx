import { th } from '../../content/th'
import type { MapPanel } from '../../state/uiState'
import { gameUiAssets } from '../gameUiAssets'

const items = [
  ['missions', th.landingMap.menuMissions, gameUiAssets.menu.mission],
  ['statistics', th.landingMap.menuStats, gameUiAssets.menu.statistics],
  ['collection', th.landingMap.menuCollection, gameUiAssets.menu.collection],
  ['settings', th.landingMap.menuSettings, gameUiAssets.menu.settings],
] as const

export function WorldMapSideMenu({ activePanel, onOpen }: { activePanel: MapPanel; onOpen: (panel: Exclude<MapPanel, null>) => void }) {
  return <nav className="g3-map-menu" aria-label="เมนูแผนที่">{items.map(([id, label, icon]) => <button type="button" key={id} className={activePanel === id ? 'is-active' : ''} onClick={() => onOpen(id)} aria-label={label}>
    <img className="g3-map-menu__frame" src={activePanel === id ? gameUiAssets.menu.active : gameUiAssets.menu.default} alt="" /><img className="g3-map-menu__icon" src={icon} alt="" /><span>{label}</span>
  </button>)}</nav>
}
