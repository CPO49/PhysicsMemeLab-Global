import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { th } from '../../content/th'
import { assets } from '../assets'
import { assetFallbacks } from '../assetFallbacks'
import { IllustratedAsset } from '../components/IllustratedAsset'
import { LandingActions } from './LandingActions'
import { LandingInfoCards } from './LandingInfoCards'
import type { LandingInfoId } from './landingInfoData'
import { LandingInfoModal } from './LandingInfoModal'
import './LandingPage.css'

export function LandingPage({ onStart, onQuickDemo }: { onStart: () => void; onQuickDemo: () => void }) {
  const [infoId, setInfoId] = useState<LandingInfoId | null>(null)
  const [scale, setScale] = useState(1)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  useEffect(() => { const update = () => { const raw = Math.min(window.innerWidth / 1920, window.innerHeight / 1080); setScale(Number.isFinite(raw) && raw > 0 ? raw : 1) }; update(); window.addEventListener('resize', update); return () => window.removeEventListener('resize', update) }, [])
  const openInfo = (id: LandingInfoId, trigger: HTMLButtonElement) => { triggerRef.current = trigger; setInfoId(id) }
  const closeInfo = () => { setInfoId(null); window.setTimeout(() => triggerRef.current?.focus(), 0) }
  const canvasStyle = { '--landing-scale': scale } as CSSProperties
  return <section className="g4-stage" aria-label={th.logoAlt}><div className="g4-canvas" style={canvasStyle}><section className="g3-landing"><IllustratedAsset className="g3-landing__background" src={assets.final.landing.background} alt={th.landingSceneAlt} /><div className="g3-landing__notebook-zone"><IllustratedAsset className="g3-landing__logo" src={assets.final.landing.logo} alt={th.logoAlt} /><h1 className="g4-landing-headline">{th.g3.landingHeadlineLines.map((line) => <span key={line}>{line}</span>)}</h1><p>{th.g3.landingSupport}</p><LandingActions onStart={onStart} onQuickDemo={onQuickDemo} /><LandingInfoCards onOpen={openInfo} /></div><div className="g3-landing__mascot-zone" aria-hidden="true"><IllustratedAsset className="g3-landing__mascot" src={assets.final.landing.mascot} debugSrc={assetFallbacks.mascot} alt={th.mascotAlt} /></div><LandingInfoModal id={infoId} onClose={closeInfo} /></section></div></section>
}
