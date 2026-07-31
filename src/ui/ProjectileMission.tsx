import { useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  activateTrajectoryVision,
  addPump,
  initialGameSession,
  startSkillSign,
  type GameSession,
} from '../learning/gameSession'
import { aimFromDrag } from '../missions/fallbackInput'
import {
  initialMissionState,
  type MissionState,
  type MissionStep,
} from '../missions/missionState'
import { simulateShot, type Shot } from '../physics/projectile'
import { th } from '../content/th'
import { assets } from './assets'
import { Button } from './components/Button'
import { EnergyBar, SkillSlot } from './components/GameHud'
import { IllustratedAsset } from './components/IllustratedAsset'
import { PaperCard } from './components/PaperCard'
import './missionDebug.css'

const gameplayDebugAssets = {
  launcher: '/assets/debug/launcher-debug.svg',
  projectile: '/assets/debug/projectile-debug.svg',
  wall: '/assets/debug/wall-debug.svg',
  target: '/assets/debug/target-debug.svg',
  trajectory: '/assets/debug/trajectory-debug.svg',
  energyEffect: '/assets/debug/energy-effect-debug.svg',
  skillVision: '/assets/debug/skill-vision-debug.svg',
} as const

const activeAssetPaths = {
  launcher: gameplayDebugAssets.launcher,
  projectile: gameplayDebugAssets.projectile,
  wall: gameplayDebugAssets.wall,
  target: gameplayDebugAssets.target,
  trajectory: gameplayDebugAssets.trajectory,
  energyEffect: gameplayDebugAssets.energyEffect,
  skillVision: gameplayDebugAssets.skillVision,
} as const

type Aim = {
  angle: number
  speed: number
}

type DragPoint = {
  x: number
  y: number
}

type DebugAdvance = {
  next: MissionStep | null
  reason: string
}

export function ProjectileMission({ onExit, demoMode = false }: { onExit: () => void; demoMode?: boolean }) {
  const [mission, setMission] = useState<MissionState>(initialMissionState)
  const [game, setGame] = useState<GameSession>(initialGameSession)
  const [aim, setAim] = useState<Aim>({ angle: 45, speed: 25 })
  const [dragStart, setDragStart] = useState<DragPoint | null>(null)
  const [demo, setDemo] = useState(demoMode)
  const [pulse, setPulse] = useState(false)
  const visualDebug = useMemo(
    () => new URLSearchParams(window.location.search).get('visualDebug') === '1',
    [],
  )

  const resetMission = () => {
    setMission(initialMissionState)
    setGame(initialGameSession)
    setAim({ angle: 45, speed: 25 })
    setDragStart(null)
    setPulse(false)
  }

  const pumpEnergy = () => {
    setGame((current) => (current.energy < 100 ? addPump(current, 25) : current))
    setPulse(true)
    window.setTimeout(() => setPulse(false), 180)
  }

  const advanceSkillSign = () => {
    setGame((current) =>
      current.skill === 'sign-step-1'
        ? activateTrajectoryVision(current)
        : startSkillSign(current),
    )
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space' && mission.step === 'charge') {
        event.preventDefault()
        if (!event.repeat) pumpEnergy()
      }

      if (event.code === 'Enter' && mission.step === 'sign') {
        event.preventDefault()
        if (!event.repeat) advanceSkillSign()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [mission.step])

  const go = (step: MissionStep) => {
    setMission((current) => ({ ...current, step }))
  }

  const fire = () => {
    const shot = simulateShot(aim.angle, aim.speed)
    setMission((current) => ({
      ...current,
      attempts: [...current.attempts, shot],
      step: current.attempts.length ? 'compare' : 'charge',
    }))
  }

  const debugAdvance = getDebugAdvance(mission, game)

  const fillEnergy = () => {
    setGame((current) => ({
      ...current,
      energy: 100,
      skill: current.skill === 'active' ? 'active' : 'ready',
    }))
  }

  const activateSkillSafely = () => {
    if (mission.step !== 'sign' || game.energy < 100) return
    setGame((current) =>
      activateTrajectoryVision(startSkillSign({ ...current, skill: 'ready' })),
    )
  }

  let body: ReactNode

  if (mission.step === 'brief') {
    body = (
      <>
        <MissionProgress step={mission.step} />
        <h1>{th.mission.briefTitle}</h1>
        <h2>{th.mission.goal}</h2>
        <ol className="gesture-steps">
          <li>{th.mission.gestureGrab}</li>
          <li>{th.mission.gestureAim}</li>
          <li>{th.mission.gestureRelease}</li>
        </ol>
        <p>
          <strong>Learning Goal:</strong> {th.mission.learningGoal}
        </p>
        <Button
          href="#prediction"
          onClick={(event) => {
            event.preventDefault()
            go('prediction')
          }}
        >
          {th.mission.predictionAction}
        </Button>
      </>
    )
  } else if (mission.step === 'prediction') {
    const options = [
      th.mission.predictionLow,
      th.mission.predictionMedium,
      th.mission.predictionHigh,
    ]

    body = (
      <>
        <MissionProgress step={mission.step} />
        <h1>{th.mission.predictionQuestion}</h1>
        <div className="prediction-options">
          {options.map((option) => (
            <button
              className={mission.prediction === option ? 'is-selected' : ''}
              key={option}
              onClick={() =>
                setMission((current) => ({ ...current, prediction: option }))
              }
            >
              {option}
              <span className="prediction-arc" aria-hidden="true" />
            </button>
          ))}
        </div>
        <Button
          href="#tutorial"
          onClick={(event) => {
            event.preventDefault()
            if (mission.prediction) go('tutorial')
          }}
        >
          {th.mission.confirm}
        </Button>
      </>
    )
  } else if (mission.step === 'tutorial') {
    body = (
      <>
        <MissionProgress step={mission.step} />
        <h1>{th.mission.tutorialTitle}</h1>
        <p>{th.mission.tutorialBody}</p>
        <ol className="gesture-steps">
          <li>{th.mission.gestureGrab}</li>
          <li>{th.mission.gestureAim}</li>
          <li>{th.mission.gestureRelease}</li>
        </ol>
        <Button
          href="#shot-1"
          onClick={(event) => {
            event.preventDefault()
            go('shot1')
          }}
        >
          {th.mission.startLab}
        </Button>
      </>
    )
  } else if (mission.step === 'shot1' || mission.step === 'shot2') {
    body = (
      <>
        <MissionProgress step={mission.step} />
        <h1>
          {mission.step === 'shot1'
            ? th.mission.firstShot
            : th.mission.retryShot}
        </h1>
        <GameplayField
          aim={aim}
          game={game}
          attempts={mission.attempts}
          dragStart={dragStart}
          onDragStart={setDragStart}
          onAim={setAim}
          visualDebug={visualDebug}
        />
        <p>{th.mission.dragGuide}</p>
        <div className="attempt-strip">
          <AttemptChip index={0} shot={mission.attempts[0]} />
          <AttemptChip index={1} shot={mission.attempts[1]} />
        </div>
        <Button
          href="#fire"
          onClick={(event) => {
            event.preventDefault()
            fire()
          }}
        >
          {th.mission.releaseFallback}
        </Button>
      </>
    )
  } else if (mission.step === 'charge') {
    body = (
      <>
        <MissionProgress step={mission.step} />
        <h1>{th.mission.powerTitle}</h1>
        <div className="charge-big">
          <EnergyBar value={game.energy} large pulsing={pulse} />
          <IllustratedAsset
            className="mission-energy-effect"
            src={assets.gameplay.chargeEffect}
            debugSrc={gameplayDebugAssets.energyEffect}
            alt=""
          />
        </div>
        <p>{th.mission.powerInstruction}</p>
        <button onClick={pumpEnergy}>{th.pumpButton}</button>
        {game.energy === 100 && (
          <Button
            href="#skill-sign"
            onClick={(event) => {
              event.preventDefault()
              go('sign')
            }}
          >
            {th.mission.useSkill}
          </Button>
        )}
      </>
    )
  } else if (mission.step === 'sign') {
    const signProgress =
      game.skill === 'active' ? 2 : game.skill === 'sign-step-1' ? 1 : 0

    body = (
      <>
        <MissionProgress step={mission.step} />
        <h1>{th.mission.signTitle}</h1>
        <div className="skill-sign-stage">
          <SkillSlot skill={game.skill} />
          <strong>{signProgress}/2</strong>
          <p>
            {signProgress < 1
              ? th.mission.signStepOne
              : th.mission.signStepTwo}
          </p>
          {game.skill === 'active' && (
            <IllustratedAsset
              className="mission-vision-effect"
              src={assets.gameplay.visionEffect}
              debugSrc={gameplayDebugAssets.skillVision}
              alt=""
            />
          )}
        </div>
        <button onClick={advanceSkillSign}>{th.mission.nextSignStep}</button>
        {game.skill === 'active' && (
          <Button
            href="#shot-2"
            onClick={(event) => {
              event.preventDefault()
              go('shot2')
            }}
          >
            {th.mission.visionReady}
          </Button>
        )}
      </>
    )
  } else if (mission.step === 'compare') {
    body = (
      <>
        <MissionProgress step={mission.step} />
        <h1>{th.mission.compareTitle}</h1>
        <div className="attempt-strip">
          <AttemptChip index={0} shot={mission.attempts[0]} detailed />
          <AttemptChip index={1} shot={mission.attempts[1]} detailed />
        </div>
        <p>{th.mission.compareInsight}</p>
        <Button
          href="#concept"
          onClick={(event) => {
            event.preventDefault()
            go('concept')
          }}
        >
          {th.mission.continueAction}
        </Button>
      </>
    )
  } else if (mission.step === 'concept') {
    body = (
      <>
        <MissionProgress step={mission.step} />
        <h1>{th.mission.conceptTitle}</h1>
        <label>
          {th.mission.conceptQuestion}
          <input
            value={mission.concept}
            onChange={(event) =>
              setMission((current) => ({
                ...current,
                concept: event.target.value,
              }))
            }
          />
        </label>
        <Button
          href="#summary"
          onClick={(event) => {
            event.preventDefault()
            if (mission.concept.trim()) go('summary')
          }}
        >
          {th.mission.summaryAction}
        </Button>
      </>
    )
  } else {
    body = (
      <>
        <MissionProgress step={mission.step} />
        <h1>{th.mission.summaryTitle}</h1>
        <p>
          <strong>{th.mission.predictionLabel}:</strong>{' '}
          {mission.prediction || th.mission.noAnswer}
        </p>
        <div className="attempt-strip">
          <AttemptChip index={0} shot={mission.attempts[0]} detailed />
          <AttemptChip index={1} shot={mission.attempts[1]} detailed />
        </div>
        <p>
          <strong>{th.mission.understandingLabel}:</strong>{' '}
          {mission.concept || th.mission.noAnswer}
        </p>
        <p>Badge: Projectile Rookie · Skill Preview: Trajectory Vision</p>
        <div className="landing-actions">
          <Button
            href="#mission"
            onClick={(event) => {
              event.preventDefault()
              resetMission()
            }}
          >
            {th.mission.playAgain}
          </Button>
          <Button
            href="#map"
            onClick={(event) => {
              event.preventDefault()
              onExit()
            }}
          >
            {th.mission.backToMap}
          </Button>
        </div>
      </>
    )
  }

  return (
    <section
      className={`mission-flow ${visualDebug ? 'is-visual-debug' : ''}`}
    >
      <button className="demo-toggle" onClick={() => setDemo((value) => !value)}>
        Demo mode: {demo ? 'ON' : 'OFF'}
      </button>
      {demo && (
        <button
          onClick={() =>
            setMission((current) => ({ ...current, step: 'summary' }))
          }
        >
          Emergency skip
        </button>
      )}
      <PaperCard>{body}</PaperCard>
      {visualDebug && (
        <VisualDebugPanel
          mission={mission}
          game={game}
          aim={aim}
          advance={debugAdvance}
          onNext={() => debugAdvance.next && go(debugAdvance.next)}
          onReset={resetMission}
          onFillEnergy={fillEnergy}
          onActivateSkill={activateSkillSafely}
        />
      )}
    </section>
  )
}

function GameplayField({
  aim,
  game,
  attempts,
  dragStart,
  onDragStart,
  onAim,
  visualDebug,
}: {
  aim: Aim
  game: GameSession
  attempts: Shot[]
  dragStart: DragPoint | null
  onDragStart: (point: DragPoint | null) => void
  onAim: (aim: Aim) => void
  visualDebug: boolean
}) {
  const lastAttempt = attempts.at(-1)
  const showTrajectory = Boolean(lastAttempt) || game.skill === 'active'

  return (
    <div
      className="gameplay-field"
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture(event.pointerId)
        onDragStart({ x: event.clientX, y: event.clientY })
      }}
      onPointerMove={(event) => {
        if (!dragStart) return
        onAim(aimFromDrag(dragStart, { x: event.clientX, y: event.clientY }))
      }}
      onPointerUp={(event) => {
        if (dragStart) {
          onAim(aimFromDrag(dragStart, { x: event.clientX, y: event.clientY }))
        }
        onDragStart(null)
      }}
    >
      <div className="gameplay-hud">
        <span>
          <small>{th.mission.angle}</small>
          <strong>{aim.angle}°</strong>
        </span>
        <span>
          <small>{th.mission.speed}</small>
          <strong>{aim.speed}</strong>
        </span>
        <span>
          <small>{th.energy}</small>
          <strong>{game.energy}%</strong>
        </span>
        <span>
          <small>{th.skill}</small>
          <strong>{game.skill}</strong>
        </span>
      </div>

      {showTrajectory && (
        <IllustratedAsset
          className="mission-object mission-trajectory"
          src={assets.gameplay.trajectoryDot}
          debugSrc={gameplayDebugAssets.trajectory}
          alt={th.mission.trajectoryAhead}
        />
      )}
      {game.skill === 'active' && (
        <IllustratedAsset
          className="mission-effect mission-vision-effect"
          src={assets.gameplay.visionEffect}
          debugSrc={gameplayDebugAssets.skillVision}
          alt=""
        />
      )}
      <IllustratedAsset
        className="mission-object mission-launcher"
        src={assets.gameplay.launcher}
        debugSrc={gameplayDebugAssets.launcher}
        alt={th.mission.launcher}
      />
      <IllustratedAsset
        className="mission-object mission-projectile"
        src={assets.gameplay.projectileOrb}
        debugSrc={gameplayDebugAssets.projectile}
        alt={th.mission.firstShot}
      />
      <IllustratedAsset
        className="mission-object mission-wall"
        src={assets.gameplay.wallBlock}
        debugSrc={gameplayDebugAssets.wall}
        alt={th.mission.wall}
      />
      <IllustratedAsset
        className="mission-object mission-target"
        src={assets.gameplay.target}
        debugSrc={gameplayDebugAssets.target}
        alt={th.mission.target}
      />

      {dragStart && (
        <span
          className="drag-guide"
          style={
            {
              '--guide-angle': aim.angle,
              '--guide-length': `${Math.min(190, aim.speed * 5)}px`,
            } as React.CSSProperties
          }
          aria-hidden="true"
        />
      )}

      {lastAttempt && (
        <span
          className={`shot-feedback ${lastAttempt.hit ? 'is-hit' : 'is-miss'}`}
          role="status"
        >
          {lastAttempt.hit ? th.mission.hit : th.mission.miss}
        </span>
      )}

      {visualDebug && (
        <span className="debug-hitbox" aria-hidden="true" />
      )}
    </div>
  )
}

function MissionProgress({ step }: { step: MissionStep }) {
  const steps: MissionStep[] = [
    'brief',
    'prediction',
    'tutorial',
    'shot1',
    'charge',
    'sign',
    'shot2',
    'compare',
    'concept',
    'summary',
  ]
  return (
    <p className="mission-progress">
      Mission {steps.indexOf(step) + 1} / {steps.length}
    </p>
  )
}

function AttemptChip({
  index,
  shot,
  detailed = false,
}: {
  index: number
  shot?: Shot
  detailed?: boolean
}) {
  return (
    <article className="attempt-chip">
      <strong>
        {th.mission.attempt} {index + 1}
      </strong>
      {!shot ? (
        <p>—</p>
      ) : detailed ? (
        <p>
          {th.mission.angle} {shot.angle}° · {th.mission.speed} {shot.speed} ·{' '}
          {th.mission.range} {shot.range} ·{' '}
          {shot.hit ? th.mission.hit : th.mission.miss}
        </p>
      ) : (
        <p>{shot.hit ? th.mission.hit : th.mission.miss}</p>
      )}
    </article>
  )
}

function VisualDebugPanel({
  mission,
  game,
  aim,
  advance,
  onNext,
  onReset,
  onFillEnergy,
  onActivateSkill,
}: {
  mission: MissionState
  game: GameSession
  aim: Aim
  advance: DebugAdvance
  onNext: () => void
  onReset: () => void
  onFillEnergy: () => void
  onActivateSkill: () => void
}) {
  const signProgress =
    game.skill === 'active' ? 2 : game.skill === 'sign-step-1' ? 1 : 0

  return (
    <aside className="visual-debug-panel" aria-label="Visual debug panel">
      <h2>Visual Debug</h2>
      <div className="visual-debug-grid">
        <span>step</span>
        <strong>{mission.step}</strong>
        <span>angle</span>
        <strong>{aim.angle}°</strong>
        <span>speed</span>
        <strong>{aim.speed}</strong>
        <span>energy</span>
        <strong>{game.energy}%</strong>
        <span>skill sign</span>
        <strong>{signProgress}/2</strong>
        <span>trajectory vision</span>
        <strong>{game.skill === 'active' ? 'active' : 'inactive'}</strong>
      </div>

      <div className="visual-debug-attempts">
        <DebugAttempt label="Attempt 1" shot={mission.attempts[0]} />
        <DebugAttempt label="Attempt 2" shot={mission.attempts[1]} />
      </div>

      <div className="visual-debug-assets">
        <strong>Active fallback asset paths</strong>
        {Object.entries(activeAssetPaths).map(([name, path]) => (
          <code key={name}>
            {name}: {path}
          </code>
        ))}
      </div>

      <div className="visual-debug-controls">
        <button
          onClick={onNext}
          disabled={!advance.next}
          title={advance.reason}
        >
          Next Step
        </button>
        <button onClick={onReset}>Reset Mission</button>
        <button onClick={onFillEnergy}>Fill Energy</button>
        <button
          onClick={onActivateSkill}
          disabled={mission.step !== 'sign' || game.energy < 100}
          title="Available at Skill Sign with full energy"
        >
          Activate Skill
        </button>
      </div>
      {!advance.next && <p className="visual-debug-reason">{advance.reason}</p>}
    </aside>
  )
}

function DebugAttempt({ label, shot }: { label: string; shot?: Shot }) {
  return (
    <p>
      <strong>{label}:</strong>{' '}
      {shot
        ? `${shot.angle}° / ${shot.speed} / ${shot.range} / ${shot.hit ? 'hit' : 'miss'}`
        : 'not recorded'}
    </p>
  )
}

function getDebugAdvance(
  mission: MissionState,
  game: GameSession,
): DebugAdvance {
  switch (mission.step) {
    case 'brief':
      return { next: 'prediction', reason: '' }
    case 'prediction':
      return mission.prediction
        ? { next: 'tutorial', reason: '' }
        : { next: null, reason: 'Select a prediction before continuing.' }
    case 'tutorial':
      return { next: 'shot1', reason: '' }
    case 'shot1':
      return {
        next: null,
        reason: 'Fire Attempt 1 to preserve the mission result.',
      }
    case 'charge':
      return game.energy === 100
        ? { next: 'sign', reason: '' }
        : { next: null, reason: 'Fill energy before opening Skill Sign.' }
    case 'sign':
      return game.skill === 'active'
        ? { next: 'shot2', reason: '' }
        : { next: null, reason: 'Complete both Skill Sign steps first.' }
    case 'shot2':
      return {
        next: null,
        reason: 'Fire Attempt 2 to preserve the mission result.',
      }
    case 'compare':
      return mission.attempts.length >= 2
        ? { next: 'concept', reason: '' }
        : { next: null, reason: 'Two attempts are required for comparison.' }
    case 'concept':
      return mission.concept.trim()
        ? { next: 'summary', reason: '' }
        : { next: null, reason: 'Answer the concept check first.' }
    case 'summary':
      return { next: null, reason: 'Summary is the final mission step.' }
  }
}
