import { th } from '../../content/th'
import type { InputMode } from '../../state/uiState'
import { gameUiAssets } from '../gameUiAssets'

type InputModeSelectorProps = { value: InputMode; onChange: (value: InputMode) => void }

const options = [
  { value: 'camera' as const, icon: gameUiAssets.landing.camera, label: th.g3.inputCamera, hint: th.g3.inputCameraHint },
  { value: 'gesture' as const, icon: gameUiAssets.landing.hand, label: th.g3.inputGesture, hint: th.g3.inputGestureHint },
  { value: 'mouse' as const, icon: gameUiAssets.landing.mouse, label: th.g3.inputMouse, hint: th.g3.inputMouseHint },
]

export function InputModeSelector({ value, onChange }: InputModeSelectorProps) {
  return <div className="g3-input-selector" role="group" aria-label="เลือกวิธีควบคุม">
    {options.map((option) => <button key={option.value} type="button" className={value === option.value ? 'is-selected' : ''} onClick={() => onChange(option.value)} aria-pressed={value === option.value}>
      <img className="g3-input-selector__frame" src={gameUiAssets.landing.card} alt="" aria-hidden="true" />
      <img className="g3-input-selector__icon" src={option.icon} alt="" aria-hidden="true" />
      <span><strong>{option.label}</strong><small>{option.hint}</small></span>
    </button>)}
  </div>
}
