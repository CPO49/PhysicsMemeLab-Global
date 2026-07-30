import { useState, type CSSProperties } from 'react'
import {
  activateTrajectoryVision,
  addPump,
  initialGameSession,
  startSkillSign,
} from './learning/gameSession'
import { th } from './content/th'
import { assets } from './ui/assets'
import { Button } from './ui/components/Button'
import {
  EnergyBar,
  GesturePrompt,
  SkillSlot,
  TrajectoryVisionOverlay,
} from './ui/components/GameHud'
import { IllustratedAsset } from './ui/components/IllustratedAsset'
import { PaperCard } from './ui/components/PaperCard'
import { TopBar } from './ui/components/TopBar'
import { ProjectileMission } from './ui/ProjectileMission'
import './ui/landing/Landing.css'
import './ui/landing/FinalLandingMap.css'

type Screen = 'landing' | 'map' | 'hub' | 'mission'
type IslandStatus = 'active' | 'locked' | 'coming-soon'

type Island = {
  name: string
  localName: string
  asset: string
  debugAsset: string
  status: IslandStatus
  stars: number
  isNew?: boolean
  position: {
    x: number
    y: number
    scale?: number
  }
}

type MapProgress = {
  completed: number
  total: number
}

const debugAssets = {
  mascot: '/assets/debug/mascot-debug.svg',
  projectileIsland: '/assets/debug/island-projectile-debug.svg',
  lockedIsland: '/assets/debug/island-locked-debug.svg',
} as const

const islands: Island[] = [
  {
    name: 'Projectile Island',
    localName: th.islandProjectile,
    asset: assets.final.worldMap.islands.projectile,
    debugAsset: debugAssets.projectileIsland,
    status: 'active',
    stars: 0,
    isNew: true,
    position: { x: 17, y: 69, scale: 1.04 },
  },
  {
    name: 'Momentum Island',
    localName: th.islandMomentum,
    asset: assets.final.worldMap.islands.momentum,
    debugAsset: debugAssets.lockedIsland,
    status: 'locked',
    stars: 0,
    position: { x: 20, y: 27 },
  },
  {
    name: 'Friction Island',
    localName: th.islandFriction,
    asset: assets.final.worldMap.islands.friction,
    debugAsset: debugAssets.lockedIsland,
    status: 'locked',
    stars: 0,
    position: { x: 49, y: 25, scale: 0.95 },
  },
  {
    name: 'Energy Island',
    localName: th.islandEnergy,
    asset: assets.final.worldMap.islands.energy,
    debugAsset: debugAssets.lockedIsland,
    status: 'locked',
    stars: 0,
    position: { x: 79, y: 26 },
  },
  {
    name: 'Mystery Island',
    localName: th.islandMystery,
    asset: assets.final.worldMap.islands.mystery,
    debugAsset: debugAssets.lockedIsland,
    status: 'coming-soon',
    stars: 0,
    position: { x: 83, y: 69, scale: 0.96 },
  },
  {
    name: '67 Power Island',
    localName: th.islandPower67,
    asset: assets.final.worldMap.islands.power67,
    debugAsset: debugAssets.lockedIsland,
    status: 'locked',
    stars: 0,
    position: { x: 50, y: 69, scale: 1.03 },
  },
]

const mapProgress: MapProgress = {
  completed: 0,
  total: 1,
}

export function App() {
  const [screen, setScreen] = useState<Screen>('landing')
  const [session, setSession] = useState(initialGameSession)
  const [preview, setPreview] = useState<Island | null>(null)

  const go = (next: Screen) => () => {
    setScreen(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <main className="app">
      {screen !== 'landing' && <TopBar onMap={go('map')} />}
      {screen === 'landing' && <Landing onStart={go('map')} />}
      {screen === 'map' && (
        <Map
          onGo={go('hub')}
          onLocked={setPreview}
          progress={mapProgress}
        />
      )}
      {screen === 'hub' && (
        <Hub
          onMission={go('mission')}
          onBack={go('map')}
          session={session}
          onPump={() => setSession((current) => addPump(current, 25))}
          onSkill={() =>
            setSession((current) =>
              current.skill === 'sign-step-1'
                ? activateTrajectoryVision(current)
                : startSkillSign(current),
            )
          }
        />
      )}
      {screen === 'mission' && <ProjectileMission onExit={go('map')} />}

      {preview && (
        <div className="modal-backdrop">
          <PaperCard>
            <h2>{preview.localName}</h2>
            <p>
              {preview.status === 'coming-soon'
                ? th.comingSoon
                : th.locked}
            </p>
            <Button
              href="#map"
              onClick={(event) => {
                event.preventDefault()
                setPreview(null)
              }}
            >
              {th.understood}
            </Button>
          </PaperCard>
        </div>
      )}
    </main>
  )
}

function Landing({ onStart }: { onStart: () => void }) {
  return (
    <section className="landing-page landing-page-final">
      <IllustratedAsset
        className="landing-background"
        src={assets.final.landing.background}
        alt={th.landingSceneAlt}
      />
      <div className="landing-hero">
        <div className="landing-copy">
          <h1 className="visually-hidden">Meme Physics Lab 67</h1>
          <IllustratedAsset
            className="landing-logo-final"
            src={assets.final.landing.logo}
            alt={th.logoAlt}
          />
          <p>{th.hubBody}</p>
          <Button href="#map" onClick={onStart}>
            {th.journey}
          </Button>
        </div>
        <div className="landing-mascot-stage">
          <IllustratedAsset
            className="landing-mascot"
            src={assets.final.landing.mascot}
            debugSrc={debugAssets.mascot}
            alt={th.mascotAlt}
          />
        </div>
      </div>
    </section>
  )
}

function Map({
  onGo,
  onLocked,
  progress,
}: {
  onGo: () => void
  onLocked: (island: Island) => void
  progress: MapProgress
}) {
  return (
    <section className="map-page map-page-final">
      <div className="map-heading">
        <h1>{th.mapTitle}</h1>
        <div className="map-state-summary" aria-label="World progress">
          <strong>
            {progress.completed}/{progress.total}
          </strong>
          <span aria-hidden="true">☆ ☆ ☆</span>
        </div>
      </div>
      <div className="ocean-map ocean-map-final">
        <IllustratedAsset
          className="map-background"
          src={assets.final.worldMap.background}
          alt=""
        />
        {islands.map((island) => {
          const islandStyle = {
            '--island-x': `${island.position.x}%`,
            '--island-y': `${island.position.y}%`,
            '--island-scale': island.position.scale ?? 1,
          } as CSSProperties

          return (
            <button
              className={`map-island state-${island.status}`}
              style={islandStyle}
              key={island.name}
              aria-label={`${island.localName}, ${island.name}`}
              onClick={() =>
                island.status === 'active'
                  ? onGo()
                  : onLocked(island)
              }
            >
              <span className="island-art-frame">
                <IllustratedAsset
                  className="island-art"
                  src={island.asset}
                  debugSrc={island.debugAsset}
                  alt=""
                />
                {island.isNew && (
                  <span className="island-new-badge">NEW</span>
                )}
                {island.status === 'locked' && (
                  <span
                    className="island-lock-icon"
                    aria-label={th.locked}
                  />
                )}
                {island.status === 'coming-soon' && (
                  <span className="island-coming-soon">
                    Coming Soon
                  </span>
                )}
              </span>
              <span className="island-label">
                <strong>{island.localName}</strong>
                <small>{island.name}</small>
                <span
                  className="island-stars"
                  aria-label={`${island.stars} stars`}
                >
                  {[0, 1, 2].map((star) => (
                    <span
                      className={star < island.stars ? 'is-earned' : ''}
                      key={star}
                      aria-hidden="true"
                    >
                      ★
                    </span>
                  ))}
                </span>
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}

function Hub({
  onMission,
  onBack,
  session,
  onPump,
  onSkill,
}: {
  onMission: () => void
  onBack: () => void
  session: typeof initialGameSession
  onPump: () => void
  onSkill: () => void
}) {
  return (
    <section className="hub-page">
      <div className="hub-scene">
        <IllustratedAsset
          className="hub-guide-asset"
          src={assets.mascot.guide}
          debugSrc={debugAssets.mascot}
          alt={th.mascotAlt}
        />
      </div>
      <div className="hub-content">
        <button className="text-button" onClick={onBack}>
          {th.mapBack}
        </button>
        <h1>{th.hubTitle}</h1>
        <p>{th.hubBody}</p>
        <EnergyBar value={session.energy} />
        <SkillSlot skill={session.skill} />
        <GesturePrompt>{th.fallback}</GesturePrompt>
        <div className="landing-actions">
          <Button
            href="#mission"
            onClick={(event) => {
              event.preventDefault()
              onMission()
            }}
          >
            {th.startMission}
          </Button>
          <button className="text-button" onClick={onPump}>
            {th.pumpButton}
          </button>
          <button className="text-button" onClick={onSkill}>
            {th.skillButton}
          </button>
        </div>
        <TrajectoryVisionOverlay active={session.skill === 'active'} />
      </div>
    </section>
  )
}
