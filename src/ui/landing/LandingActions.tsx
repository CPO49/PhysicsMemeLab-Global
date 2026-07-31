import { th } from '../../content/th'
import { gameUiAssets } from '../gameUiAssets'

export function LandingActions({ onStart, onQuickDemo }: { onStart: () => void; onQuickDemo: () => void }) {
  return <div className="g3-landing-actions">
    <button type="button" className="g3-landing-actions__primary" onClick={onStart}>
      <img className="g3-landing-actions__frame" src={gameUiAssets.landing.primary} alt="" aria-hidden="true" />
      <img className="g3-landing-actions__play" src={gameUiAssets.landing.play} alt="" aria-hidden="true" />
      <span>{th.journey}</span>
    </button>
    <button type="button" className="g3-landing-actions__secondary" onClick={onQuickDemo}>
      <img className="g3-landing-actions__frame" src={gameUiAssets.landing.secondary} alt="" aria-hidden="true" />
      <span>{th.g3.quickDemo}</span>
    </button>
  </div>
}
