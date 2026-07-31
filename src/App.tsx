import { useState } from 'react'
import {
  activateTrajectoryVision,
  addPump,
  initialGameSession,
  startSkillSign,
} from './learning/gameSession'
import { th } from './content/th'
import { assets } from './ui/assets'
import { assetFallbacks } from './ui/assetFallbacks'
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
import { LandingPage } from './ui/landing/LandingPage'
import './ui/landing/Landing.css'
import './ui/landing/ReferenceLandingWorldMap.css'
import { ProjectileMission } from './ui/ProjectileMission'
import { WorldMapPage } from './ui/worldmap/WorldMapPage'
import type { WorldMapIsland } from './ui/worldmap/worldMapData'

type Screen = 'landing' | 'map' | 'hub' | 'mission'

export function App() {
  const [screen, setScreen] = useState<Screen>('landing')
  const [session, setSession] = useState(initialGameSession)
  const [preview, setPreview] = useState<WorldMapIsland | null>(null)

  const go = (next: Screen) => () => {
    setScreen(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <main className="app">
      {(screen === 'hub' || screen === 'mission') && <TopBar onMap={go('map')} />}
      {screen === 'landing' && <LandingPage onStart={go('map')} />}
      {screen === 'map' && <WorldMapPage onEnterProjectile={go('hub')} onLocked={setPreview} />}
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
            <p>{preview.status === 'coming-soon' ? th.comingSoon : th.locked}</p>
            <Button href="#map" onClick={(event) => {
              event.preventDefault()
              setPreview(null)
            }}>
              {th.understood}
            </Button>
          </PaperCard>
        </div>
      )}
    </main>
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
          debugSrc={assetFallbacks.mascot}
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
          <Button href="#mission" onClick={(event) => {
            event.preventDefault()
            onMission()
          }}>
            {th.startMission}
          </Button>
          <button className="text-button" onClick={onPump}>{th.pumpButton}</button>
          <button className="text-button" onClick={onSkill}>{th.skillButton}</button>
        </div>
        <TrajectoryVisionOverlay active={session.skill === 'active'} />
      </div>
    </section>
  )
}
