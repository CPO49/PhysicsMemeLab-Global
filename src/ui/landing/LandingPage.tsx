import { th } from '../../content/th'
import { assets } from '../assets'
import { assetFallbacks } from '../assetFallbacks'
import { IllustratedAsset } from '../components/IllustratedAsset'
import { generatedAssets } from '../generatedAssets'
import { LandingControls } from './LandingControls'

type LandingPageProps = {
  onStart: () => void
}

export function LandingPage({ onStart }: LandingPageProps) {
  return (
    <section className="reference-landing" aria-labelledby="landing-title">
      <IllustratedAsset
        className="reference-landing__background"
        src={assets.final.landing.background}
        alt={th.landingSceneAlt}
      />
      <div className="reference-landing__layout">
        <div className="reference-landing__content">
          <h1 className="visually-hidden" id="landing-title">
            Meme Physics Lab 67
          </h1>
          <IllustratedAsset
            className="reference-landing__logo"
            src={assets.final.landing.logo}
            alt={th.logoAlt}
          />
          <h2>{th.landingMap.headline}</h2>
          <p>{th.landingMap.support}</p>
          <div className="reference-landing__actions">
            <a className="reference-primary-action" href="#map" onClick={(event) => {
              event.preventDefault()
              onStart()
            }}>
              <img src={generatedAssets.icons.play} alt="" aria-hidden="true" />
              {th.journey}
            </a>
            <button className="reference-secondary-action" type="button" onClick={onStart}>
              {th.landingMap.quickDemo}
            </button>
          </div>
          <LandingControls />
        </div>
        <div className="reference-landing__mascot-stage" aria-hidden="true">
          <img className="reference-landing__tape" src={generatedAssets.decor.tape} alt="" />
          <IllustratedAsset
            className="reference-landing__mascot"
            src={assets.final.landing.mascot}
            debugSrc={assetFallbacks.mascot}
            alt={th.mascotAlt}
          />
        </div>
      </div>
    </section>
  )
}
