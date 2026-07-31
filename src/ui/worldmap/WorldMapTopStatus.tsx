import { th } from '../../content/th'
import { generatedAssets } from '../generatedAssets'

function StatusValue({ icon, children }: { icon: string; children: string }) {
  return (
    <span className="world-map-status__value">
      <img src={icon} alt="" aria-hidden="true" />
      <strong>{children}</strong>
    </span>
  )
}

export function WorldMapTopStatus() {
  return (
    <header className="world-map-status" aria-label="Player status">
      <StatusValue icon={generatedAssets.icons.energy}>67</StatusValue>
      <StatusValue icon={generatedAssets.icons.diamond}>670</StatusValue>
      <button className="world-map-status__profile" type="button" aria-label={th.landingMap.playerName}>
        <img src={generatedAssets.ui.profile} alt="" aria-hidden="true" />
        <span>{th.landingMap.playerName}</span>
        <img className="world-map-status__chevron" src={generatedAssets.icons.chevron} alt="" aria-hidden="true" />
      </button>
    </header>
  )
}
