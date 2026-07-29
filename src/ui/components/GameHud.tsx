import type {
  GestureMode,
  SkillState,
} from '../../learning/gameSession'
import { th } from '../../content/th'

type EnergyBarProps = {
  value?: number
  energy?: number
  large?: boolean
  pulsing?: boolean
}

export function EnergyBar({
  value,
  energy,
  large = false,
  pulsing = false,
}: EnergyBarProps) {
  const resolvedValue = value ?? energy ?? 0

  return (
    <section className={`energy-bar ${large ? 'energy-bar-large' : ''} ${pulsing ? 'is-pulsing' : ''}`}>
      <div className="hud-label-row">
        <strong>{th.energy}</strong>
        <span>{Math.round(resolvedValue)}%</span>
      </div>
      <div
        className="energy-track"
        role="progressbar"
        aria-label={th.energy}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(resolvedValue)}
      >
        <span style={{ width: `${resolvedValue}%` }} />
      </div>
    </section>
  )
}

export function SkillSlot({
  skill,
  state,
}: {
  skill?: SkillState
  state?: SkillState
}) {
  const resolvedSkill = skill ?? state ?? 'locked'
  const stateLabel =
    resolvedSkill === 'active'
      ? th.visionActive
      : resolvedSkill === 'ready' || resolvedSkill === 'sign-step-1'
        ? th.ready
        : th.charging

  return (
    <section className={`skill-slot skill-${resolvedSkill}`}>
      <span className="skill-slot-icon" aria-hidden="true">
        67
      </span>
      <span>
        <small>{th.skill}</small>
        <strong>Trajectory Vision</strong>
        <em>{stateLabel}</em>
      </span>
    </section>
  )
}

type GesturePromptProps = {
  children?: React.ReactNode
  mode?: GestureMode
  onPump?: () => void
  onSkill?: () => void
}

export function GesturePrompt({
  children,
  mode,
  onPump,
  onSkill,
}: GesturePromptProps) {
  if (children) return <p className="gesture-prompt">{children}</p>

  return (
    <section className="gesture-prompt">
      <span>{mode ?? 'idle'}</span>
      {onPump && <button onClick={onPump}>{th.pumpButton}</button>}
      {onSkill && <button onClick={onSkill}>{th.skillButton}</button>}
    </section>
  )
}

export function TrajectoryVisionOverlay({ active }: { active: boolean }) {
  if (!active) return null

  return (
    <div className="trajectory-vision-status" role="status">
      <strong>Trajectory Vision</strong>
      <span>{th.visionActive}</span>
    </div>
  )
}
