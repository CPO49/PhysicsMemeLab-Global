import { th } from '../../content/th'
import type { InputMode } from '../../state/uiState'
import { assets } from '../assets'
import { assetFallbacks } from '../assetFallbacks'
import { IllustratedAsset } from '../components/IllustratedAsset'
import { InputModeSelector } from './InputModeSelector'
import { LandingActions } from './LandingActions'
import './LandingPage.css'

type LandingPageProps = { inputMode: InputMode; onInputMode: (inputMode: InputMode) => void; onStart: () => void; onQuickDemo: () => void }

export function LandingPage({ inputMode, onInputMode, onStart, onQuickDemo }: LandingPageProps) {
  return <section className="g3-landing" aria-labelledby="landing-title">
    <IllustratedAsset className="g3-landing__background" src={assets.final.landing.background} alt={th.landingSceneAlt} />
    <div className="g3-landing__notebook-zone">
      <h1 id="landing-title" className="visually-hidden">Meme Physics Lab 67</h1>
      <IllustratedAsset className="g3-landing__logo" src={assets.final.landing.logo} alt={th.logoAlt} />
      <h2>{th.g3.landingHeadline.split('\n').map((line) => <span key={line}>{line}</span>)}</h2>
      <p>{th.g3.landingSupport}</p>
      <LandingActions onStart={onStart} onQuickDemo={onQuickDemo} />
      <InputModeSelector value={inputMode} onChange={onInputMode} />
      {inputMode === 'camera' && <p className="g3-landing__camera-note" role="status">{th.g3.cameraReady}</p>}
    </div>
    <div className="g3-landing__mascot-zone" aria-hidden="true">
      <IllustratedAsset className="g3-landing__mascot" src={assets.final.landing.mascot} debugSrc={assetFallbacks.mascot} alt={th.mascotAlt} />
    </div>
  </section>
}
