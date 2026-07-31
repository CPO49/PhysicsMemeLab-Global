import { th } from '../../content/th'
import { gameUiAssets } from '../gameUiAssets'

export function IslandLabel({ localName, name, progress }: { localName: string; name: string; progress: number }) {
  const stars = Math.min(3, Math.floor(progress / 10))
  return <span className="g3-island-label">
    <img className="g3-island-label__frame" src={gameUiAssets.map.label} alt="" aria-hidden="true" />
    <strong>{localName}</strong><small>{name}</small>
    <span className="g3-island-label__progress"><img src={gameUiAssets.map.progress} alt="" aria-hidden="true" /><b>★</b>{progress}/30 {th.landingMap.progressUnit}<em>{stars}/3</em></span>
  </span>
}
