import type { CSSProperties } from 'react'
import { th } from '../../content/th'
import { IllustratedAsset } from '../components/IllustratedAsset'
import { generatedAssets } from '../generatedAssets'
import type { WorldMapIsland } from './worldMapData'

type IslandNodeProps = {
  island: WorldMapIsland
  onEnter: () => void
  onLocked: (island: WorldMapIsland) => void
}

export function IslandNode({ island, onEnter, onLocked }: IslandNodeProps) {
  const style = {
    '--island-x': `${island.position.x}%`,
    '--island-y': `${island.position.y}%`,
    '--island-scale': island.position.scale ?? 1,
  } as CSSProperties

  const handleClick = () => {
    if (island.status === 'active') {
      onEnter()
      return
    }
    onLocked(island)
  }

  return (
    <button
      className={`world-map-island world-map-island--${island.status}`}
      style={style}
      type="button"
      onClick={handleClick}
      aria-label={`${island.localName}, ${island.name}`}
    >
      <span className="world-map-island__art-frame">
        <IllustratedAsset className="world-map-island__art" src={island.asset} debugSrc={island.debugAsset} alt="" />
        {island.isNew && <span className="world-map-island__badge world-map-island__badge--new">NEW</span>}
        {island.status === 'locked' && <img className="world-map-island__lock" src={generatedAssets.ui.lock} alt={th.locked} />}
        {island.status === 'coming-soon' && <span className="world-map-island__badge world-map-island__badge--soon">Coming Soon</span>}
      </span>
      <span className="world-map-island__label">
        <strong>{island.localName}</strong>
        <small>{island.name}</small>
        <span className="world-map-island__progress">
          <img src={generatedAssets.icons.star} alt="" aria-hidden="true" />
          {island.stars}/{island.starTotal} {th.landingMap.progressUnit}
        </span>
      </span>
    </button>
  )
}
