import { useState } from 'react'
import { activateTrajectoryVision, addPump, initialGameSession, startSkillSign } from './learning/gameSession'
import { th } from './content/th'
import { initialUiState, closeUiOverlay, openMapPanel, toggleAnimations, toggleProfile, toggleSound } from './state/uiState'
import { initialWorldMapProgress } from './state/worldMapState'
import { assets } from './ui/assets'
import { assetFallbacks } from './ui/assetFallbacks'
import { Button } from './ui/components/Button'
import { EnergyBar, GesturePrompt, SkillSlot, TrajectoryVisionOverlay } from './ui/components/GameHud'
import { IllustratedAsset } from './ui/components/IllustratedAsset'
import { TopBar } from './ui/components/TopBar'
import { LandingPage } from './ui/landing/LandingPage'
import './ui/landing/Landing.css'
import { ProjectileMission } from './ui/ProjectileMission'
import { WorldMapPage } from './ui/worldmap/WorldMapPage'

type Screen = 'landing' | 'map' | 'hub' | 'mission'

export function App() {
  const [screen, setScreen] = useState<Screen>('landing')
  const [session, setSession] = useState(initialGameSession)
  const [ui, setUi] = useState(initialUiState)
  const [demoMode, setDemoMode] = useState(false)

  const go = (next: Screen) => () => { setScreen(next); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const enterMission = (demo = false) => { setDemoMode(demo); setScreen('mission'); window.scrollTo({ top: 0, behavior: 'smooth' }) }

  return <main className="app">
    {(screen === 'hub' || screen === 'mission') && <TopBar onMap={go('map')} />}
    {screen === 'landing' && <LandingPage onStart={go('map')} onQuickDemo={() => enterMission(true)} />}
    {screen === 'map' && <WorldMapPage ui={ui} progress={initialWorldMapProgress} onToggleProfile={() => setUi(toggleProfile)} onCloseOverlay={() => setUi(closeUiOverlay)} onOpenPanel={(panel) => setUi((current) => openMapPanel(current, panel))} onToggleSound={() => setUi(toggleSound)} onToggleAnimations={() => setUi(toggleAnimations)} onEnterProjectile={go('hub')} />}
    {screen === 'hub' && <Hub onMission={() => enterMission(false)} onBack={go('map')} session={session} onPump={() => setSession((current) => addPump(current, 25))} onSkill={() => setSession((current) => current.skill === 'sign-step-1' ? activateTrajectoryVision(current) : startSkillSign(current))} />}
    {screen === 'mission' && <ProjectileMission onExit={go('map')} demoMode={demoMode} />}
  </main>
}

function Hub({ onMission, onBack, session, onPump, onSkill }: { onMission: () => void; onBack: () => void; session: typeof initialGameSession; onPump: () => void; onSkill: () => void }) {
  return <section className="hub-page"><div className="hub-scene"><IllustratedAsset className="hub-guide-asset" src={assets.mascot.guide} debugSrc={assetFallbacks.mascot} alt={th.mascotAlt} /></div><div className="hub-content"><button className="text-button" onClick={onBack}>{th.mapBack}</button><h1>{th.hubTitle}</h1><p>{th.hubBody}</p><EnergyBar value={session.energy} /><SkillSlot skill={session.skill} /><GesturePrompt>{th.fallback}</GesturePrompt><div className="landing-actions"><Button href="#mission" onClick={(event) => { event.preventDefault(); onMission() }}>{th.startMission}</Button><button className="text-button" onClick={onPump}>{th.pumpButton}</button><button className="text-button" onClick={onSkill}>{th.skillButton}</button></div><TrajectoryVisionOverlay active={session.skill === 'active'} /></div></section>
}
