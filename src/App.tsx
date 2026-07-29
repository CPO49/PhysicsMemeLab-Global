import { useState } from 'react'
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

type Screen = 'landing' | 'map' | 'hub' | 'mission'

type Island = {
  name: string
  topic: string
  asset: string
  debugAsset: string
  playable?: boolean
}

const debugAssets = {
  mascot: '/assets/debug/mascot-debug.svg',
  projectileIsland: '/assets/debug/island-projectile-debug.svg',
  lockedIsland: '/assets/debug/island-locked-debug.svg',
} as const

const islands: Island[] = [
  {
    name: 'Projectile Island',
    topic: th.projectile,
    asset: assets.islands.projectile,
    debugAsset: debugAssets.projectileIsland,
    playable: true,
  },
  {
    name: 'Momentum Island',
    topic: th.momentum,
    asset: assets.islands.momentumLocked,
    debugAsset: debugAssets.lockedIsland,
  },
  {
    name: 'Balance 67',
    topic: th.balance,
    asset: assets.islands.balance67Locked,
    debugAsset: debugAssets.lockedIsland,
  },
  {
    name: 'Friction Island',
    topic: th.friction,
    asset: assets.islands.frictionLocked,
    debugAsset: debugAssets.lockedIsland,
  },
  {
    name: 'Energy Island',
    topic: th.energyTopic,
    asset: assets.islands.energyLocked,
    debugAsset: debugAssets.lockedIsland,
  },
]

export function App() {
  const [screen, setScreen] = useState<Screen>('landing')
  const [session, setSession] = useState(initialGameSession)
  const [preview, setPreview] = useState<string | null>(null)

  const go = (next: Screen) => () => {
    setScreen(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <main className="app">
      {screen !== 'landing' && <TopBar onMap={go('map')} />}
      {screen === 'landing' && <Landing onStart={go('map')} />}
      {screen === 'map' && <Map onGo={go('hub')} onLocked={setPreview} />}
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
            <h2>{preview}</h2>
            <p>{th.locked}</p>
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
    <section className="landing-page">
      <IllustratedAsset
        className="landing-background"
        src={assets.backgrounds.landing}
        alt={th.landingSceneAlt}
      />
      <div className="landing-hero">
        <div className="landing-copy">
          <h1>Meme Physics Archipelago</h1>
          <p>{th.hubBody}</p>
          <Button href="#map" onClick={onStart}>
            {th.journey}
          </Button>
        </div>
        <IllustratedAsset
          className="landing-mascot"
          src={assets.branding.mascotHero}
          debugSrc={debugAssets.mascot}
          alt={th.mascotAlt}
        />
      </div>
    </section>
  )
}

function Map({
  onGo,
  onLocked,
}: {
  onGo: () => void
  onLocked: (name: string) => void
}) {
  return (
    <section className="map-page">
      <div className="map-heading">
        <h1>{th.mapTitle}</h1>
      </div>
      <div className="ocean-map">
        <IllustratedAsset
          className="map-background"
          src={assets.backgrounds.worldMap}
          alt=""
        />
        <svg
          className="map-route"
          viewBox="0 0 1000 600"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M160 430 C210 300 150 210 210 140 S420 285 500 420 S700 245 780 145 S820 315 840 430" />
        </svg>
        {islands.map((island) => (
          <button
            className={`map-island ${island.playable ? 'state-active' : 'state-locked'}`}
            key={island.name}
            onClick={() => (island.playable ? onGo() : onLocked(island.name))}
          >
            <IllustratedAsset
              className="island-art"
              src={island.asset}
              debugSrc={island.debugAsset}
              alt={island.name}
            />
            <span className="island-label">
              <strong>{island.name}</strong>
              <small>{island.topic}</small>
            </span>
          </button>
        ))}
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
