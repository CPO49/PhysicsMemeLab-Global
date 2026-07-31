import { useRef, useState } from 'react'
import { th } from '../../content/th'
import { assets } from '../assets'
import { assetFallbacks } from '../assetFallbacks'
import { IllustratedAsset } from '../components/IllustratedAsset'
import { LandingActions } from './LandingActions'
import { LandingInfoCards, type LandingInfoId } from './LandingInfoCards'
import { LandingInfoModal } from './LandingInfoModal'
import './LandingPage.css'

export function LandingPage({ onStart, onQuickDemo }: { onStart: () => void; onQuickDemo: () => void }) {
  const [infoId, setInfoId] = useState<LandingInfoId | null>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const openInfo = (id: LandingInfoId, trigger: HTMLButtonElement) => { triggerRef.current = trigger; setInfoId(id) }
  const closeInfo = () => { setInfoId(null); window.setTimeout(() => triggerRef.current?.focus(), 0) }
  return <section className="g4-stage" aria-label={th.logoAlt}><div className="g4-canvas"><section className="g3-landing">
    <IllustratedAsset className="g3-landing__background" src={assets.final.landing.background} alt={th.landingSceneAlt} />
    <div className="g3-landing__notebook-zone"><IllustratedAsset className="g3-landing__logo" src={assets.final.landing.logo} alt={th.logoAlt} /><h1 className="g4-landing-headline">{th.g3.landingHeadlineLines.map((line) => <span key={line}>{line}</span>)}</h1><p>{th.g3.landingSupport}</p><LandingActions onStart={onStart} onQuickDemo={onQuickDemo} /><LandingInfoCards onOpen={openInfo} /></div>
    <div className="g3-landing__mascot-zone" aria-hidden="true"><IllustratedAsset className="g3-landing__mascot" src={assets.final.landing.mascot} debugSrc={assetFallbacks.mascot} alt={th.mascotAlt} /></div><LandingInfoModal id={infoId} onClose={closeInfo} />
  </section></div></section>
}
