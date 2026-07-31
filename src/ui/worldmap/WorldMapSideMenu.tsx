import { th } from '../../content/th'
import { generatedAssets } from '../generatedAssets'

const menuItems = [
  { label: th.landingMap.menuMissions, icon: generatedAssets.icons.mission },
  { label: th.landingMap.menuStats, icon: generatedAssets.icons.stats },
  { label: th.landingMap.menuCollection, icon: generatedAssets.icons.collection },
  { label: th.landingMap.menuSettings, icon: generatedAssets.icons.settings },
] as const

export function WorldMapSideMenu() {
  return (
    <nav className="world-map-side-menu" aria-label="World map menu">
      {menuItems.map((item) => (
        <button type="button" key={item.label} aria-label={item.label}>
          <img src={item.icon} alt="" aria-hidden="true" />
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  )
}
