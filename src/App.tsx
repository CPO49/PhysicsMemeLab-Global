import { useEffect, useState } from 'react'
import { audioManager } from './audio/audioManager'
import { activateTrajectoryVision, addPump, initialGameSession, startSkillSign } from './learning/gameSession'
import { th } from './content/th'
import { initialUiState, closeUiOverlay, openMapPanel, setSoundVolume, toggleAnimations, toggleProfile, toggleSound } from './state/uiState'
import { completeElectricMission, completeProjectileMission, loadGameState, saveGameState } from './state/gameState'
import { assets } from './ui/assets'
import { assetFallbacks } from './ui/assetFallbacks'
import { Button } from './ui/components/Button'
import { EnergyBar, GesturePrompt, SkillSlot, TrajectoryVisionOverlay } from './ui/components/GameHud'
import { IllustratedAsset } from './ui/components/IllustratedAsset'
import { TopBar } from './ui/components/TopBar'
import { LandingPage } from './ui/landing/LandingPage'
import { LandingLayoutStudio } from './ui/landing/LandingLayoutStudio'
import './ui/landing/Landing.css'
import './ui/motion.css'
import { ProjectileMission } from './ui/ProjectileMission'
import { ElectricMission } from './ui/electric/ElectricMission'
import { WorldMapPage } from './ui/worldmap/WorldMapPage'

type Screen = 'landing' | 'map' | 'hub' | 'mission' | 'electric'

export function App() {
  const [layoutStudio, setLayoutStudio] = useState(() => window.location.pathname === '/layout-editor')
  const [screen, setScreen] = useState<Screen>('landing')
  const [session, setSession] = useState(initialGameSession)
  const [ui, setUi] = useState(() => {
    const audioSettings = audioManager.getSettings()
    return { ...initialUiState, soundEnabled: audioSettings.enabled, soundVolume: Math.round(audioSettings.masterVolume * 100) }
  })
  const [demoMode, setDemoMode] = useState(false)
  const [gameState, setGameState] = useState(loadGameState)

  useEffect(() => {
    const unlock = () => audioManager.unlock()
    window.addEventListener('pointerdown', unlock, { once: true })
    window.addEventListener('keydown', unlock, { once: true })
    return () => { window.removeEventListener('pointerdown', unlock); window.removeEventListener('keydown', unlock) }
  }, [])
  useEffect(() => {
    document.documentElement.classList.toggle('animations-disabled', !ui.animationsEnabled)
    return () => document.documentElement.classList.remove('animations-disabled')
  }, [ui.animationsEnabled])
  useEffect(() => { audioManager.setScene(screen === 'landing' ? 'landing' : screen === 'map' ? 'worldMap' : 'projectile') }, [screen])
  const go = (next: Screen) => () => { audioManager.play('click'); setScreen(next); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const enterMission = (demo = false) => { audioManager.play('missionStart'); setDemoMode(demo); setScreen('mission'); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const toggleSoundSetting = () => setUi((current) => { const next = toggleSound(current); audioManager.updateSettings({ enabled: next.soundEnabled }); return next })
  const changeSoundVolume = (volume: number) => setUi((current) => {
    const next = setSoundVolume(current, volume)
    audioManager.updateSettings({ masterVolume: next.soundVolume / 100 })
    return next
  })
  const leaveLayoutStudio = () => { window.history.replaceState({}, '', '/'); setLayoutStudio(false) }

  if (layoutStudio) return <LandingLayoutStudio onExit={leaveLayoutStudio} onApply={leaveLayoutStudio} />

  return <main className="app">
    {(screen === 'hub' || screen === 'mission' || screen === 'electric') && <TopBar onMap={go('map')} />}
    {screen === 'landing' && <LandingPage onStart={go('map')} onQuickDemo={() => enterMission(true)} />}
    {screen === 'map' && <WorldMapPage ui={ui} progress={gameState.progress} completedMissions={gameState.completedMissions} onToggleProfile={() => setUi(toggleProfile)} onCloseOverlay={() => setUi(closeUiOverlay)} onOpenPanel={(panel) => setUi((current) => openMapPanel(current, panel))} onToggleSound={toggleSoundSetting} onChangeSoundVolume={changeSoundVolume} onToggleAnimations={() => setUi(toggleAnimations)} onEnterProjectile={go('hub')} onEnterElectric={go('electric')} />}
    {screen === 'hub' && <Hub onMission={() => enterMission(false)} onBack={go('map')} session={session} onPump={() => setSession((current) => addPump(current, 25))} onSkill={() => setSession((current) => current.skill === 'sign-step-1' ? activateTrajectoryVision(current) : startSkillSign(current))} />}
    {screen === 'mission' && <ProjectileMission onExit={go('map')} demoMode={demoMode} onComplete={(stars) => setGameState((current) => { const next = completeProjectileMission(current, stars); saveGameState(next); return next })} />}
    {screen === 'electric' && <ElectricMission onExit={go('map')} onComplete={(stars) => setGameState((current) => { const next = completeElectricMission(current, stars); saveGameState(next); return next })} />}
  </main>
}

function Hub({ onMission, onBack, session, onPump, onSkill }: {
  onMission: () => void
  onBack: () => void
  session: typeof initialGameSession
  onPump: () => void
  onSkill: () => void
}) {
  return <section className="hub-page">
    <div className="hub-scene">
      <IllustratedAsset className="hub-guide-asset" src={assets.mascot.guide} debugSrc={assetFallbacks.mascot} alt={th.mascotAlt} />
    </div>
    <div className="hub-content">
      <button className="text-button" onClick={onBack}>{th.mapBack}</button>
      <h1>{th.hubTitle}</h1>
      <p>{th.hubBody}</p>
      <EnergyBar value={session.energy} />
      <SkillSlot skill={session.skill} />
      <GesturePrompt>{th.fallback}</GesturePrompt>
      <div className="landing-actions">
        <Button href="#mission" onClick={(event) => { event.preventDefault(); onMission() }}>{th.startMission}</Button>
        <button className="text-button" onClick={onPump}>{th.pumpButton}</button>
        <button className="text-button" onClick={onSkill}>{th.skillButton}</button>
      </div>
      <TrajectoryVisionOverlay active={session.skill === 'active'} />
    </div>
  </section>
}
