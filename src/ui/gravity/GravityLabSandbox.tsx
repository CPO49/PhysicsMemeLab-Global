import { useCallback, useEffect, useRef, useState } from 'react'
import { audioManager } from '../../audio/audioManager'
import { getGravityHandIntent } from '../../gestures/gravityHandControl'
import { useCameraGesture } from '../../hooks/useCameraGesture'
import {
  clampGravity,
  clampMass,
  createGravityBody,
  defaultGravityEnvironment,
  releaseGravityBody,
  stepGravityBody,
  type GravityBody,
  type GravityObjectKind,
} from '../../physics/gravity'
import './GravityLabSandbox.css'

type ObstacleType = 'wall' | 'platform'
type Obstacle = { id: string; type: ObstacleType; x: number; y: number; width: number; height: number; held: boolean }

const WORLD_WIDTH = defaultGravityEnvironment.width
const WORLD_HEIGHT = defaultGravityEnvironment.height
const MAX_OBJECTS = 3

const objectAssets: Record<GravityObjectKind, string> = {
  ball: '/assets/generated/gravity/ball.svg',
  paper: '/assets/generated/gravity/paper.svg',
  feather: '/assets/generated/gravity/feather.svg',
}
const objectNames: Record<GravityObjectKind, string> = { ball: 'Ball', paper: 'Paper', feather: 'Feather' }

type HandState = {
  heldId: string | null
  heldType: 'object' | 'obstacle' | null
  x: number
  y: number
  time: number
  vx: number
  vy: number
  lastPinchTime: number
}

export function GravityLabSandbox({ onExit }: { onExit: () => void }) {
  const [gravity, setGravity] = useState(9.8)
  const [bodies, setBodies] = useState<GravityBody[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [obstacles, setObstacles] = useState<Obstacle[]>([])
  const [handCursor, setHandCursor] = useState<{ x: number; y: number; pinching: boolean } | null>(null)

  const sceneRef = useRef<HTMLDivElement>(null)
  const handRef = useRef<HandState>({ heldId: null, heldType: null, x: 0, y: 0, time: 0, vx: 0, vy: 0, lastPinchTime: 0 })
  const bodiesRef = useRef(bodies)
  const obstaclesRef = useRef(obstacles)
  const nextIdRef = useRef(1)
  const nextObstacleIdRef = useRef(1)

  const {
    videoRef,
    status: cameraStatus,
    landmarks: cameraLandmarks,
    start: startCameraControl,
    stop: stopCameraControl,
  } = useCameraGesture(useCallback(() => undefined, []))

  const selectedBody = bodies.find((b) => b.id === selectedId)

  useEffect(() => { bodiesRef.current = bodies }, [bodies])
  useEffect(() => { obstaclesRef.current = obstacles }, [obstacles])

  // Physics loop
  useEffect(() => {
    let frameId = 0
    let previous = performance.now()
    const tick = (now: number) => {
      const dt = Math.min((now - previous) / 1000, 1 / 30)
      previous = now
      setBodies((current) => current.map((body) => {
        if (body.held) return body

        // Apply physics
        let updated = stepGravityBody(body, {
          ...defaultGravityEnvironment,
          g: gravity,
        }, dt)

        // Check collision with obstacles
        obstaclesRef.current.forEach((obs) => {
          const bodyLeft = updated.x - updated.radius
          const bodyRight = updated.x + updated.radius
          const bodyTop = updated.y - updated.radius
          const bodyBottom = updated.y + updated.radius
          const obsLeft = obs.x - obs.width / 2
          const obsRight = obs.x + obs.width / 2
          const obsTop = obs.y - obs.height / 2
          const obsBottom = obs.y + obs.height / 2

          if (bodyRight > obsLeft && bodyLeft < obsRight && bodyBottom > obsTop && bodyTop < obsBottom) {
            // Collision detected - simple bounce
            const overlapLeft = bodyRight - obsLeft
            const overlapRight = obsRight - bodyLeft
            const overlapTop = bodyBottom - obsTop
            const overlapBottom = obsBottom - bodyTop
            const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom)

            if (minOverlap === overlapLeft) {
              updated = { ...updated, x: obsLeft - updated.radius, vx: -Math.abs(updated.vx) * 0.6 }
            } else if (minOverlap === overlapRight) {
              updated = { ...updated, x: obsRight + updated.radius, vx: Math.abs(updated.vx) * 0.6 }
            } else if (minOverlap === overlapTop) {
              updated = { ...updated, y: obsTop - updated.radius, vy: -Math.abs(updated.vy) * 0.6 }
            } else {
              updated = { ...updated, y: obsBottom + updated.radius, vy: Math.abs(updated.vy) * 0.6 }
            }
          }
        })

        return updated
      }))
      frameId = requestAnimationFrame(tick)
    }
    frameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameId)
  }, [gravity, obstacles])

  // Hand tracking
  useEffect(() => {
    if (!cameraLandmarks) return

    const intent = getGravityHandIntent(cameraLandmarks)
    const x = Math.max(0.3, Math.min(WORLD_WIDTH - 0.3, intent.cursor.x * WORLD_WIDTH))
    const y = Math.max(0.3, Math.min(WORLD_HEIGHT - 0.3, intent.cursor.y * WORLD_HEIGHT))
    const now = performance.now()
    const previous = handRef.current
    const dt = Math.max(0.016, (now - previous.time) / 1000)
    const vx = Math.max(-18, Math.min(18, (x - previous.x) / dt))
    const vy = Math.max(-18, Math.min(18, (y - previous.y) / dt))
    let heldId = previous.heldId
    let heldType = previous.heldType

    if (intent.pinching && !heldId) {
      const nearestBody = bodiesRef.current
        .map((body) => ({ body, distance: Math.hypot(body.x - x, body.y - y) }))
        .filter(({ distance }) => distance < 1.1)
        .sort((a, b) => a.distance - b.distance)[0]

      if (nearestBody) {
        heldId = nearestBody.body.id
        heldType = 'object'
        setSelectedId(heldId)
        audioManager.play('click')
      } else {
        const nearestObstacle = obstaclesRef.current
          .map((obs) => ({ obs, distance: Math.hypot(obs.x - x, obs.y - y) }))
          .filter(({ distance }) => distance < 1.5)
          .sort((a, b) => a.distance - b.distance)[0]

        if (nearestObstacle) {
          heldId = nearestObstacle.obs.id
          heldType = 'obstacle'
          audioManager.play('click')
        }
      }
    }

    if (heldId) {
      if (intent.pinching) {
        if (heldType === 'object') {
          const massDelta = intent.massGesture === 'increase' ? dt * 0.9 : intent.massGesture === 'decrease' ? -dt * 0.9 : 0
          setBodies((current) => current.map((body) => body.id === heldId
            ? { ...body, x, y, vx: 0, vy: 0, held: true, mass: clampMass(body.mass + massDelta) }
            : body))
        } else if (heldType === 'obstacle') {
          setObstacles((current) => current.map((obs) => obs.id === heldId
            ? { ...obs, x, y, held: true }
            : obs))
        }
      } else {
        const releasedId = heldId
        const releasedType = heldType
        heldId = null
        heldType = null

        if (releasedType === 'object') {
          setBodies((current) => current.map((body) => body.id === releasedId ? releaseGravityBody(body) : body))
          audioManager.play('launch')
        } else if (releasedType === 'obstacle') {
          setObstacles((current) => current.map((obs) => obs.id === releasedId ? { ...obs, held: false } : obs))
        }
      }
    }

    const lastPinchTime = intent.pinching ? now : previous.lastPinchTime
    handRef.current = { heldId, heldType, x, y, time: now, vx, vy, lastPinchTime }
    setHandCursor({ x, y, pinching: intent.pinching })
  }, [cameraLandmarks, gravity])

  useEffect(() => () => stopCameraControl(), [stopCameraControl])

  const addObject = (kind: GravityObjectKind) => {
    if (bodies.length >= MAX_OBJECTS) return
    const id = `obj-${nextIdRef.current++}`
    const x = 2 + ((bodies.length * 1.8) % 8)
    setBodies((current) => [...current, createGravityBody(kind, id, x, 1.2)])
    setSelectedId(id)
    audioManager.play('click')
  }

  const removeObject = (id: string) => {
    setBodies((current) => current.filter((b) => b.id !== id))
    if (selectedId === id) setSelectedId(null)
  }

  const addObstacle = (type: ObstacleType) => {
    const id = `obs-${nextObstacleIdRef.current++}`
    const newObstacle: Obstacle = {
      id,
      type,
      x: WORLD_WIDTH / 2,
      y: WORLD_HEIGHT / 2,
      width: type === 'wall' ? 0.3 : 3,
      height: type === 'wall' ? 4 : 0.3,
      held: false,
    }
    setObstacles((current) => [...current, newObstacle])
    audioManager.play('click')
  }

  const removeObstacle = (id: string) => {
    setObstacles((current) => current.filter((o) => o.id !== id))
  }

  const resetAll = () => {
    setBodies([])
    setObstacles([])
    setSelectedId(null)
    handRef.current.heldId = null
    handRef.current.heldType = null
    audioManager.play('click')
  }

  const toggleCameraControl = () => {
    if (cameraStatus === 'ready') {
      stopCameraControl()
      setHandCursor(null)
      handRef.current.heldId = null
      handRef.current.heldType = null
      setBodies((current) => current.map((body) => ({ ...body, held: false })))
      setObstacles((current) => current.map((obs) => ({ ...obs, held: false })))
      return
    }
    startCameraControl()
  }

  return (
    <section className="gravity-sandbox">
      <header className="gravity-sandbox__header">
        <div>
          <button className="gravity-sandbox__back" type="button" onClick={onExit}>← Back</button>
          <h1>Lab Sandbox</h1>
        </div>
        <div className="gravity-sandbox__status">
          <span className={`status-badge status-badge--${cameraStatus === 'ready' ? 'live' : 'idle'}`}>
            {cameraStatus === 'ready' ? '🟢 LIVE AR' : '⚪ '}
          </span>
        </div>
      </header>

      <div className="gravity-sandbox__layout">
        <main className="gravity-sandbox__stage">
          <div className="gravity-sandbox__camera-view">
            <video ref={videoRef} muted playsInline />
            {cameraLandmarks?.map((point, index) => (
              <i key={index} style={{ left: `${(1 - point.x) * 100}%`, top: `${point.y * 100}%` }} />
            ))}

            <div className="gravity-sandbox__scene" ref={sceneRef}>
              {obstacles.map((obs) => (
                <div
                  key={obs.id}
                  className={`gravity-obstacle gravity-obstacle--${obs.type}${obs.held ? ' is-held' : ''}`}
                  style={{
                    left: `${(obs.x / WORLD_WIDTH) * 100}%`,
                    top: `${(obs.y / WORLD_HEIGHT) * 100}%`,
                    width: `${(obs.width / WORLD_WIDTH) * 100}%`,
                    height: `${(obs.height / WORLD_HEIGHT) * 100}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                />
              ))}

              {bodies.map((body) => (
                <div
                  key={body.id}
                  className={`gravity-object gravity-object--${body.kind}${body.id === selectedId ? ' is-selected' : ''}${body.held ? ' is-held' : ''}`}
                  style={{
                    left: `${(body.x / WORLD_WIDTH) * 100}%`,
                    top: `${(body.y / WORLD_HEIGHT) * 100}%`,
                    '--object-size': `${Math.max(40, body.radius * 140)}px`,
                  } as React.CSSProperties}
                >
                  <img src={objectAssets[body.kind]} alt="" />
                </div>
              ))}

              {handCursor && cameraLandmarks && (
                <div
                  className={`gravity-hand-cursor${handCursor.pinching ? ' is-pinching' : ''}`}
                  style={{
                    left: `${(handCursor.x / WORLD_WIDTH) * 100}%`,
                    top: `${(handCursor.y / WORLD_HEIGHT) * 100}%`,
                  }}
                />
              )}
            </div>

            {cameraStatus !== 'ready' && (
              <div className="gravity-sandbox__camera-placeholder">
                <p>📷 Camera Off</p>
                <button type="button" onClick={toggleCameraControl}>Start Camera</button>
              </div>
            )}
          </div>
        </main>

        <aside className="gravity-sandbox__sidebar">
          <section className="sandbox-panel">
            <div className="sandbox-panel__header">
              <h2>OBJECTS</h2>
              <span>{bodies.length} / {MAX_OBJECTS}</span>
            </div>
            <div className="sandbox-panel__content">
              {bodies.length === 0 && <p className="sandbox-panel__empty">No objects spawned</p>}
              {bodies.map((body) => (
                <div key={body.id} className={`object-item${body.id === selectedId ? ' is-selected' : ''}`} onClick={() => setSelectedId(body.id)}>
                  <div>
                    <strong>{objectNames[body.kind]}</strong>
                    <small>m = {body.mass.toFixed(2)} kg</small>
                  </div>
                  <button type="button" onClick={(e) => { e.stopPropagation(); removeObject(body.id) }}>×</button>
                </div>
              ))}
              <div className="object-add-buttons">
                {(Object.keys(objectAssets) as GravityObjectKind[]).map((kind) => (
                  <button key={kind} type="button" disabled={bodies.length >= MAX_OBJECTS} onClick={() => addObject(kind)}>
                    + {objectNames[kind]}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="sandbox-panel">
            <div className="sandbox-panel__header">
              <h2>ARENA</h2>
            </div>
            <div className="sandbox-panel__content">
              {obstacles.length === 0 && <p className="sandbox-panel__empty">No obstacles</p>}
              {obstacles.map((obs) => (
                <div key={obs.id} className="arena-item">
                  <div>
                    <strong>{obs.type === 'wall' ? 'Wall' : 'Platform'}</strong>
                    <small>Static - {obs.type === 'wall' ? 'vertical' : 'horizontal'}</small>
                  </div>
                  <button type="button" onClick={() => removeObstacle(obs.id)}>×</button>
                </div>
              ))}
              <div className="obstacle-add-buttons">
                <button type="button" onClick={() => addObstacle('wall')}>+ Wall</button>
                <button type="button" onClick={() => addObstacle('platform')}>+ Platform</button>
              </div>
            </div>
          </section>

          <section className="sandbox-panel">
            <div className="sandbox-panel__header">
              <h2>SETTINGS</h2>
            </div>
            <div className="sandbox-panel__content">
              <div className="setting-row">
                <label>Gravity (g)</label>
                <output>{gravity.toFixed(1)} m/s²</output>
              </div>
              <input
                type="range"
                min="1.6"
                max="24.8"
                step="0.1"
                value={gravity}
                onInput={(e) => setGravity(clampGravity(e.currentTarget.valueAsNumber))}
              />
              <div className="preset-buttons">
                <button type="button" className={gravity === 1.62 ? 'is-active' : ''} onClick={() => setGravity(1.62)}>Moon</button>
                <button type="button" className={Math.abs(gravity - 9.8) < 0.1 ? 'is-active' : ''} onClick={() => setGravity(9.8)}>Earth</button>
                <button type="button" className={gravity === 24.79 ? 'is-active' : ''} onClick={() => setGravity(24.79)}>Jupiter</button>
              </div>
              <button type="button" className="reset-button" onClick={resetAll}>Reset All</button>
            </div>
          </section>

          {selectedBody && (
            <section className="sandbox-panel sandbox-panel--physics">
              <div className="sandbox-panel__header">
                <h2>PHYSICS LIVE</h2>
              </div>
              <div className="sandbox-panel__content">
                <div className="physics-readout">
                  <div className="readout-item">
                    <span>F</span>
                    <strong>{(selectedBody.mass * gravity).toFixed(2)} N</strong>
                  </div>
                  <div className="readout-item">
                    <span>v</span>
                    <strong>{Math.hypot(selectedBody.vx, selectedBody.vy).toFixed(2)} m/s</strong>
                  </div>
                  <div className="readout-item">
                    <span>a</span>
                    <strong>{gravity.toFixed(2)} m/s²</strong>
                  </div>
                </div>
              </div>
            </section>
          )}
        </aside>
      </div>
    </section>
  )
}
