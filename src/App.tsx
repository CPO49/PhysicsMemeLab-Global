import { useState } from 'react'
import { initialGameSession, addPump, activateTrajectoryVision, startSkillSign } from './learning/gameSession'
import { th } from './content/th'
import { assets } from './ui/assets'
import { Button } from './ui/components/Button'
import { EnergyBar, GesturePrompt, SkillSlot, TrajectoryVisionOverlay } from './ui/components/GameHud'
import { IllustratedAsset } from './ui/components/IllustratedAsset'
import { PaperCard } from './ui/components/PaperCard'
import { TopBar } from './ui/components/TopBar'
import { ProjectileMission } from './ui/ProjectileMission'
import './ui/landing/Landing.css'

type Screen = 'landing' | 'map' | 'hub' | 'mission'
type Island = { name: string; topic: string; asset: string; playable?: boolean }
const islands: Island[] = [
  { name: 'Projectile Island', topic: th.projectile, asset: assets.islands.projectile, playable: true },
  { name: 'Momentum Island', topic: 'แรงดลและโมเมนตัม', asset: assets.islands.momentumLocked },
  { name: 'Balance 67', topic: 'สมดุลและแรงบิด', asset: assets.islands.balance67Locked },
  { name: 'Friction Island', topic: 'แรงเสียดทาน', asset: assets.islands.frictionLocked },
  { name: 'Energy Island', topic: 'พลังงาน', asset: assets.islands.energyLocked },
]
export function App() {
  const [screen, setScreen] = useState<Screen>('landing')
  const [session, setSession] = useState(initialGameSession)
  const [preview, setPreview] = useState<string | null>(null)
  const go = (next: Screen) => () => { setScreen(next); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  return <main className="app">{screen !== 'landing' && <TopBar onMap={go('map')} />}
    {screen === 'landing' && <Landing onStart={go('map')} />}
    {screen === 'map' && <Map onGo={go('hub')} onLocked={setPreview} />}
    {screen === 'hub' && <Hub onMission={go('mission')} onBack={go('map')} session={session} onPump={() => setSession(s => addPump(s, 25))} onSkill={() => setSession(s => s.skill === 'sign-step-1' ? activateTrajectoryVision(s) : startSkillSign(s))} />}
    {screen === 'mission' && <ProjectileMission onExit={go('map')} />}
    {preview && <div className="modal-backdrop"><PaperCard><h2>{preview}</h2><p>{th.locked}</p><Button href="#map" onClick={e => { e.preventDefault(); setPreview(null) }}>เข้าใจแล้ว</Button></PaperCard></div>}
  </main>
}
function Landing({ onStart }: { onStart: () => void }) { return <section className="landing-page"><IllustratedAsset className="landing-background" src={assets.backgrounds.landing} alt="ฉากหมู่เกาะฟิสิกส์" /><div className="landing-hero"><div><h1>Meme Physics Archipelago</h1><p>{th.hubBody}</p><Button href="#map" onClick={onStart}>{th.journey}</Button></div><IllustratedAsset className="landing-mascot" src={assets.branding.mascotHero} alt="มาสคอต" /></div></section> }
function Map({ onGo, onLocked }: { onGo: () => void; onLocked: (name: string) => void }) { return <section className="map-page"><h1>{th.mapTitle}</h1><div className="ocean-map">{islands.map(island => <button className="map-island" key={island.name} onClick={() => island.playable ? onGo() : onLocked(island.name)}><IllustratedAsset className="island-art" src={island.asset} alt="" /><b>{island.name}</b><small>{island.topic}</small></button>)}</div></section> }
function Hub({ onMission, onBack, session, onPump, onSkill }: { onMission: () => void; onBack: () => void; session: typeof initialGameSession; onPump: () => void; onSkill: () => void }) { return <section className="hub-page"><div className="hub-content"><button className="text-button" onClick={onBack}>{th.mapBack}</button><h1>{th.hubTitle}</h1><p>{th.hubBody}</p><EnergyBar energy={session.energy} /><SkillSlot state={session.skill} /><GesturePrompt mode={session.gestureMode} onPump={onPump} onSkill={onSkill} /><TrajectoryVisionOverlay active={session.skill === 'active'} /><Button href="#mission" onClick={e => { e.preventDefault(); onMission() }}>{th.startMission}</Button></div></section> }
