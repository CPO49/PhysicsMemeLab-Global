import { th } from '../../content/th'
import { generatedAssets } from '../generatedAssets'

const controls = [
  {
    icon: generatedAssets.icons.camera,
    title: th.landingMap.cameraControl,
    hint: th.landingMap.cameraControlHint,
  },
  {
    icon: generatedAssets.icons.hand,
    title: th.landingMap.handControl,
    hint: th.landingMap.handControlHint,
  },
  {
    icon: generatedAssets.icons.mouse,
    title: th.landingMap.mouseControl,
    hint: th.landingMap.mouseControlHint,
  },
] as const

export function LandingControls() {
  return (
    <div className="landing-controls" aria-label="Control options">
      {controls.map((control) => (
        <article className="landing-control-card" key={control.title}>
          <img src={control.icon} alt="" aria-hidden="true" />
          <div>
            <strong>{control.title}</strong>
            <small>{control.hint}</small>
          </div>
        </article>
      ))}
    </div>
  )
}
