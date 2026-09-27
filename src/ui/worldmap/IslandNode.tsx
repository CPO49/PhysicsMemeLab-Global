import type { CSSProperties } from 'react'
import { audioManager } from '../../audio/audioManager'
import type { WorldMapIsland } from '../../data/worldMapData'
import { IllustratedAsset } from '../components/IllustratedAsset'
import { gameUiAssets } from '../gameUiAssets'
import { IslandLabel } from './IslandLabel'

export function IslandNode({ island, progress, onEnter, onLocked }: { island: WorldMapIsland; progress: number; onEnter: (island: WorldMapIsland) => void; onLocked: (island: WorldMapIsland) => void }) {
  const style = { '--island-x': `${island.position.x}%`, '--island-y': `${island.position.y}%`, '--island-scale': island.position.scale ?? 1 } as CSSProperties
  const action = island.status === 'active' ? () => onEnter(island) : () => onLocked(island)
  return <button className={`g3-island g3-island--${island.status}`} style={style} type="button" onPointerEnter={() => audioManager.play('hover')} onClick={action} aria-label={`${island.localName}, ${island.name}`}>
    <span className="g3-island__art"><IllustratedAsset src={island.asset} debugSrc={island.debugAsset} alt="" />
      {island.isNew && <span className="g3-island__new"><img src={gameUiAssets.map.newBadge} alt="" /><b>NEW</b></span>}
      {island.status === 'locked' && <img className="g3-island__lock" src={gameUiAssets.map.lock} alt="Locked" />}
      {island.status === 'coming-soon' && <span className="g3-island__soon"><img src={gameUiAssets.map.soonBadge} alt="" /><b>Coming Soon</b></span>}
    </span><IslandLabel localName={island.localName} name={island.name} progress={progress} />
  </button>
}
