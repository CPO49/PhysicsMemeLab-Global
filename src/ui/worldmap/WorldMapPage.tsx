import { assets } from '../assets'
import { IllustratedAsset } from '../components/IllustratedAsset'
import { generatedAssets } from '../generatedAssets'
import { IslandNode } from './IslandNode'
import type { WorldMapIsland } from './worldMapData'
import { worldMapIslands } from './worldMapData'
import { WorldMapSideMenu } from './WorldMapSideMenu'
import { WorldMapTopStatus } from './WorldMapTopStatus'

type WorldMapPageProps = {
  onEnterProjectile: () => void
  onLocked: (island: WorldMapIsland) => void
}

export function WorldMapPage({ onEnterProjectile, onLocked }: WorldMapPageProps) {
  return (
    <section className="reference-world-map" aria-label="World Map">
      <WorldMapTopStatus />
      <div className="reference-world-map__scene">
        <IllustratedAsset className="reference-world-map__background" src={assets.final.worldMap.background} alt="" />
        <div className="reference-world-map__islands">
          {worldMapIslands.map((island) => (
            <IslandNode key={island.id} island={island} onEnter={onEnterProjectile} onLocked={onLocked} />
          ))}
        </div>
        <img className="reference-world-map__wheel" src={generatedAssets.decor.wheel} alt="" aria-hidden="true" />
        <img className="reference-world-map__note" src={generatedAssets.decor.stickyNote} alt="" aria-hidden="true" />
      </div>
      <WorldMapSideMenu />
    </section>
  )
}
