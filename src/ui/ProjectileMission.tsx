import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { audioManager } from '../audio/audioManager'
import {
  activateTrajectoryVision,
  addPump,
  initialGameSession,
  startSkillSign,
  type GameSession,
} from '../learning/gameSession'
import {
  initialMissionState,
  type MissionState,
  type MissionStep,
} from '../missions/missionState'
import { simulateShot, type Shot } from '../physics/projectile'
import { useCameraGesture } from '../hooks/useCameraGesture'
import { useSixtySevenPump } from '../hooks/useSixtySevenPump'
import { useSkillSign } from '../hooks/useSkillSign'
import type { AimInput } from '../gestures/landmarkToAim'
import { th } from '../content/th'
import { Button } from './components/Button'
import { EnergyBar, SkillSlot } from './components/GameHud'
import { PaperCard } from './components/PaperCard'
import { CameraOverlay, CameraError } from './camera/CameraOverlay'
import { SixtySevenOverlay } from './camera/SixtySevenOverlay'
import { GameScene } from './game/GameScene'
import './missionDebug.css'
import './ProjectileMissionPolish.css'

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

type DebugAdvance = {
  next: MissionStep | null
  reason: string
}

export function ProjectileMission({ onExit, onComplete, demoMode = false }: { onExit: () => void; onComplete?: (stars: number) => void; demoMode?: boolean }) {
  const [mission, setMission] = useState<MissionState>(initialMissionState)
  const [game, setGame] = useState<GameSession>(initialGameSession)
  const [demo, setDemo] = useState(demoMode)
  const [pulse, setPulse] = useState(false)
  const [animating, setAnimating] = useState(false)
  const [projectilePos, setProjectilePos] = useState<{ x: number; y: number } | null>(null)
  const [lastShot, setLastShot] = useState<Shot | null>(null)
  const [fallbackAim, setFallbackAim] = useState<AimInput>({ angle: 45, speed: 25 })
  const [usingFallbackInput, setUsingFallbackInput] = useState(false)
  const animFrameRef = useRef<number>(0)
  const isFiringRef = useRef(false)
  const missionStepRef = useRef<MissionStep>(initialMissionState.step)
  const visualDebug = useMemo(
    () => new URLSearchParams(window.location.search).get('visualDebug') === '1',
    [],
  )

  useEffect(() => {
    missionStepRef.current = mission.step
  }, [mission.step])

  const fireShot = useCallback((aim: AimInput) => {
    if (isFiringRef.current || (missionStepRef.current !== 'shot1' && missionStepRef.current !== 'shot2')) return
    isFiringRef.current = true
    const shot = simulateShot(aim.angle, aim.speed)
    setLastShot(shot)
    setAnimating(true)

    const rad = (aim.angle * Math.PI) / 180
    const vx = aim.speed * Math.cos(rad)
    const vy = aim.speed * Math.sin(rad)
    const g = 9.8
    // Must match GameScene.tsx getTrajectoryPath scales exactly
    const SCALE_X = 9
    const SCALE_Y = 12
    const startX = 100
    const startY = 300

    // Actual physics flight time before ball hits ground
    const flightTime = (2 * vy) / g
    // Map flight time → animation duration (min 700ms, max 2000ms)
    const duration = Math.max(700, Math.min(2000, flightTime * 380))
    const startTime = performance.now()

    const step = (now: number) => {
      const progress = Math.min(1, (now - startTime) / duration)
      const t = progress * flightTime
      const x = startX + vx * t * SCALE_X
      const y = startY - (vy * t - 0.5 * g * t * t) * SCALE_Y
      setProjectilePos({ x, y })

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(step)
      } else {
        isFiringRef.current = false
        setAnimating(false)
        setProjectilePos(null)
        audioManager.play(shot.hit ? 'hit' : 'miss')
        if (missionStepRef.current !== 'shot1' && missionStepRef.current !== 'shot2') return
        setMission((current) => ({
          ...current,
          attempts: [...current.attempts, shot],
          step: current.attempts.length ? 'compare' : 'charge',
        }))
      }
    }
    audioManager.play('launch')
    animFrameRef.current = requestAnimationFrame(step)
  }, [])

  useEffect(() => () => {
    cancelAnimationFrame(animFrameRef.current)
    isFiringRef.current = false
  }, [])

  const camera = useCameraGesture(useCallback((gestureAim) => {
    fireShot(gestureAim)
  }, [fireShot]))

  const pump67 = useSixtySevenPump(useCallback(() => {
    audioManager.play('charge')
    setGame((current) => (current.energy < 100 ? addPump(current, 10) : current))
    setPulse(true)
    window.setTimeout(() => setPulse(false), 120)
  }, []))

  // Start/stop 67 pump camera on charge step
  const { start: pump67Start, stop: pump67Stop, status: pump67Status } = pump67
  useEffect(() => {
    if (mission.step === 'charge') {
      if (pump67Status === 'idle') pump67Start()
    } else {
      if (pump67Status !== 'idle') pump67Stop()
    }
  }, [mission.step, pump67Start, pump67Stop, pump67Status])

  const skillSign = useSkillSign(
    useCallback(() => {
      audioManager.play('click')
      setGame((current) => (current.skill === 'ready' ? { ...current, skill: 'sign-step-1' as const, gestureMode: 'skill-sign' as const } : current))
    }, []),
    useCallback(() => {
      audioManager.play('skillUnlocked')
      setGame((current) => (current.skill === 'sign-step-1' ? { ...current, energy: 0, skill: 'active' as const } : current))
      // Advance to shot2 directly from the gesture callback (not in a useEffect)
      setMission((current) => current.step === 'sign' ? { ...current, step: 'shot2' as const } : current)
    }, []),
  )
  const { start: signStart, stop: signStop, status: signStatus } = skillSign
  useEffect(() => {
    if (mission.step === 'sign') {
      if (signStatus === 'idle') signStart()
    } else {
      if (signStatus !== 'idle') signStop()
    }
  }, [mission.step, signStart, signStop, signStatus])

  const resetMission = () => {
    cancelAnimationFrame(animFrameRef.current)
    isFiringRef.current = false
    setMission(initialMissionState)
    setGame(initialGameSession)
    setPulse(false)
    setAnimating(false)
    setProjectilePos(null)
    setLastShot(null)
    setFallbackAim({ angle: 45, speed: 25 })
    setUsingFallbackInput(false)
  }

  const pumpEnergy = useCallback(() => {
    audioManager.play('charge')
    setGame((current) => (current.energy < 100 ? addPump(current, 25) : current))
    setPulse(true)
    window.setTimeout(() => setPulse(false), 180)
  }, [])

  const advanceSkillSign = useCallback(() => {
    audioManager.play(game.skill === 'sign-step-1' ? 'skillUnlocked' : 'click')
    setGame((current) =>
      current.skill === 'sign-step-1'
        ? activateTrajectoryVision(current)
        : startSkillSign(current),
    )
  }, [game.skill])

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
  }, [advanceSkillSign, mission.step, pumpEnergy])

  const go = (step: MissionStep) => {
    setMission((current) => ({ ...current, step }))
  }

  const updateFallbackAim = useCallback((aim: AimInput) => {
    setFallbackAim(aim)
    setUsingFallbackInput(true)
  }, [])
  const fireFallback = useCallback((aim: AimInput) => {
    updateFallbackAim(aim)
    fireShot(aim)
  }, [fireShot, updateFallbackAim])
  const activeAim = usingFallbackInput ? fallbackAim : camera.aim
  const fire = () => { fireShot(activeAim) }

  // Start/stop camera when entering/leaving the shooting steps
  const { start: cameraStart, stop: cameraStop, status: cameraStatus } = camera
  useEffect(() => {
    if (mission.step === 'shot1' || mission.step === 'shot2') {
      if (cameraStatus === 'idle') cameraStart()
    } else {
      if (cameraStatus !== 'idle') cameraStop()
    }
  }, [mission.step, cameraStart, cameraStop, cameraStatus])

  const debugAdvance = getDebugAdvance(mission, game)
  const missionStars = calculateMissionStars(mission)

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
        {camera.status === 'error' && camera.error && (
          <CameraError message={camera.error} onDismiss={() => cameraStop()} />
        )}
        <div className="gameplay-split">
          {/* Left: Camera with hand tracking */}
          <div className="gameplay-split__camera">
            {camera.status !== 'error' && (
              <CameraOverlay
                videoRef={camera.videoRef}
                canvasRef={camera.canvasRef}
                gesturePhase={camera.gesturePhase}
                landmarks={camera.landmarks}
              />
            )}
            {camera.status === 'loading' && <p className="camera-loading">กำลังเปิดกล้อง...</p>}
          </div>
          {/* Right: Game scene */}
          <div className="gameplay-split__scene">
            <GameScene
              angle={activeAim.angle}
              speed={activeAim.speed}
              gesturePhase={camera.gesturePhase}
              showTrajectory={camera.gesturePhase === 'grabbed' || camera.gesturePhase === 'aiming'}
              isAnimating={animating}
              projectilePosition={projectilePos ?? undefined}
              lastShot={lastShot}
              onFallbackAim={updateFallbackAim}
              onFallbackFire={fireFallback}
            />
          </div>
        </div>
        <p className="gameplay-hint">กำมือเพื่อจับ → ขยับเพื่อเล็ง → เปิดมือเพื่อยิง</p>
        <p className="gameplay-hint">{th.mission.dragGuide}</p>
        <div className="shot-hud">
          <span><small>{th.mission.angle}</small><strong>{activeAim.angle}°</strong></span>
          <span><small>{th.mission.speed}</small><strong>{activeAim.speed}</strong></span>
          {lastShot && (
            <span className={lastShot.hit ? 'is-hit' : 'is-miss'}>
              <small>ผล</small><strong>{lastShot.hit ? '🎯 โดน!' : '❌ พลาด'}</strong>
            </span>
          )}
        </div>
        <div className="attempt-strip">
          <AttemptChip index={0} shot={mission.attempts[0]} />
          <AttemptChip index={1} shot={mission.attempts[1]} />
        </div>
        <Button href="#fire" aria-disabled={animating} onClick={(event) => { event.preventDefault(); fire() }}>
          ยิงด้วยปุ่ม (สำรอง)
        </Button>
      </>
    )
  } else if (mission.step === 'charge') {
    body = (
      <>
        <MissionProgress step={mission.step} />
        <h1>{th.mission.powerTitle}</h1>
        <div className="charge-split">
          {/* Left: 67 gesture camera */}
          <div className="charge-split__camera">
            <SixtySevenOverlay
              videoRef={pump67.videoRef}
              canvasRef={pump67.canvasRef}
              hands={pump67.hands}
              pumpRate={pump67.pumpRate}
            />
            {pump67.status === 'loading' && <p className="camera-loading">กำลังเปิดกล้อง...</p>}
          </div>
          {/* Right: energy bar + instructions */}
          <div className="charge-split__bar">
            <EnergyBar value={game.energy} large pulsing={pulse} />
            <p className="charge-instruction">
              <strong>แบมือหงาย 2 ข้าง</strong><br />
              สลับขึ้น–ลงเร็ว ๆ เพื่อปั้มพลัง 67!
            </p>
            <p className="charge-rate">
              ความเร็ว: {Math.round(pump67.pumpRate * 100)}%
              {pump67.pumpRate > 0.7 ? ' ⚡ สุดยอด!' : pump67.pumpRate > 0.4 ? ' 🔥 ดีมาก!' : ''}
            </p>
            <button className="pump-fallback-btn" onClick={pumpEnergy}>{th.pumpButton}</button>
            {game.energy === 100 && (
              <Button
                href="#skill-sign"
                onClick={(event) => { event.preventDefault(); go('sign') }}
              >
                {th.mission.useSkill}
              </Button>
            )}
          </div>
        </div>
      </>
    )
  } else if (mission.step === 'sign') {
    const signProgress =
      game.skill === 'active' ? 2 : game.skill === 'sign-step-1' ? 1 : 0

    const signInstruction = signProgress < 1
      ? '🤲 ประกบมือทั้ง 2 ข้างเข้าหากัน'
      : '🙌 กางมือออกให้กว้าง!'

    body = (
      <>
        <MissionProgress step={mission.step} />
        <h1>{th.mission.signTitle}</h1>
        <div className="sign-split">
          <div className="sign-split__camera">
            <SixtySevenOverlay
              videoRef={skillSign.videoRef}
              canvasRef={skillSign.canvasRef}
              hands={skillSign.hands}
              pumpRate={0}
            />
            {skillSign.status === 'loading' && <p className="camera-loading">กำลังเปิดกล้อง...</p>}
          </div>
          <div className="sign-split__info">
            <SkillSlot skill={game.skill} />
            <div className="sign-progress-bar">
              <div
                className="sign-progress-fill"
                style={{ width: `${signProgress * 50}%` }}
              />
              <span>{signProgress}/2</span>
            </div>
            <p className="sign-instruction">{signInstruction}</p>
            {signProgress === 0 && (
              <p className="sign-hint">ยกมือขึ้นระดับอก แล้วนำมือมาชนกัน</p>
            )}
            {signProgress === 1 && (
              <p className="sign-hint">ดีมาก! ตอนนี้กางมือออกให้กว้าง ⚡</p>
            )}
            <button className="pump-fallback-btn" onClick={advanceSkillSign}>
              {th.mission.nextSignStep}
            </button>
          </div>
        </div>
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
        <div className="summary-stars" aria-label={`${missionStars} stars earned`}>{[1, 2, 3].map((star) => <span className={star <= missionStars ? 'is-earned' : ''} key={star}>★</span>)}</div>
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
              onComplete?.(missionStars)
              audioManager.play('success')
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
          aim={camera.aim}
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
        <p>â€”</p>
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
  aim: AimInput
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

function calculateMissionStars(mission: MissionState) {
  const hit = mission.attempts.some((shot) => shot.hit)
  const explained = mission.concept.trim().length >= 8
  return 1 + (hit ? 1 : 0) + (explained ? 1 : 0)
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
