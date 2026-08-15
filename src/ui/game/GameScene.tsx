import { useRef, type PointerEvent } from 'react'
import type { AimInput } from '../../gestures/landmarkToAim'
import { aimFromDrag } from '../../missions/fallbackInput'
import type { Shot } from '../../physics/projectile'
import type { GesturePhase } from '../../gestures/gestureStateMachine'
import './GameScene.css'

interface GameSceneProps {
  angle: number
  speed: number
  gesturePhase: GesturePhase
  showTrajectory: boolean
  isAnimating: boolean
  projectilePosition?: { x: number; y: number }
  lastShot?: Shot | null
  onFallbackAim?: (aim: AimInput) => void
  onFallbackFire?: (aim: AimInput) => void
}

// Slingshot geometry
const PRONG_LEFT = { x: 65, y: 258 }
const PRONG_RIGHT = { x: 97, y: 258 }
const POCKET = { x: 81, y: 258 }

function getBallPosition(phase: GesturePhase, angle: number, speed: number) {
  if (phase !== 'grabbed' && phase !== 'aiming') return POCKET
  const rad = (angle * Math.PI) / 180
  const pullDist = 20 + ((speed - 12) / 26) * 40
  return {
    x: POCKET.x - Math.cos(rad) * pullDist,
    y: POCKET.y + Math.sin(rad) * pullDist,
  }
}

function getTrajectoryPath(angle: number, speed: number): string {
  const rad = (angle * Math.PI) / 180
  const vx = speed * Math.cos(rad)
  const vy = speed * Math.sin(rad)
  const g = 9.8
  const scaleX = 9
  const scaleY = 12
  const sx = 100
  const sy = 300
  const pts: string[] = []
  for (let t = 0; t <= 4; t += 0.08) {
    const px = sx + vx * t * scaleX
    const py = sy - (vy * t - 0.5 * g * t * t) * scaleY
    if (py > 385) break
    pts.push(`${pts.length === 0 ? 'M' : 'L'} ${px.toFixed(1)} ${py.toFixed(1)}`)
  }
  return pts.join(' ')
}

export function GameScene({
  angle, speed, gesturePhase, showTrajectory, isAnimating, projectilePosition, lastShot, onFallbackAim, onFallbackFire,
}: GameSceneProps) {
  const dragStartRef = useRef<{ x: number; y: number } | null>(null)
  const isGrabbing = gesturePhase === 'grabbed' || gesturePhase === 'aiming'
  const ballPos = isAnimating || gesturePhase === 'released'
    ? POCKET
    : getBallPosition(gesturePhase, angle, speed)
  const trajectoryPath = showTrajectory ? getTrajectoryPath(angle, speed) : ''
  const hit = !!lastShot?.hit
  const pointerToScene = (event: PointerEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    return {
      x: ((event.clientX - rect.left) / rect.width) * 800,
      y: ((event.clientY - rect.top) / rect.height) * 450,
    }
  }
  const updateFallbackAim = (event: PointerEvent<SVGSVGElement>) => {
    const start = dragStartRef.current
    if (!start) return null
    const fallbackAim = aimFromDrag(start, pointerToScene(event))
    onFallbackAim?.(fallbackAim)
    return fallbackAim
  }

  return (
    <div className="game-scene">
      <svg
        viewBox="0 0 800 450"
        className="game-canvas"
        preserveAspectRatio="xMidYMid meet"
        onPointerDown={(event) => {
          if (isAnimating || !onFallbackFire) return
          dragStartRef.current = pointerToScene(event)
          event.currentTarget.setPointerCapture(event.pointerId)
        }}
        onPointerMove={(event) => { if (!isAnimating) updateFallbackAim(event) }}
        onPointerUp={(event) => {
          if (isAnimating || !onFallbackFire) return
          const fallbackAim = updateFallbackAim(event)
          dragStartRef.current = null
          if (fallbackAim) onFallbackFire(fallbackAim)
        }}
        onPointerCancel={() => { dragStartRef.current = null }}
      >
        <defs>
          <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#87CEEB" />
            <stop offset="100%" stopColor="#c8ecf7" />
          </linearGradient>
          <linearGradient id="groundGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#9B7A4E" />
            <stop offset="100%" stopColor="#6B4B27" />
          </linearGradient>
          <radialGradient id="ballGrad" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#FF9A6C" />
            <stop offset="100%" stopColor="#CC3300" />
          </radialGradient>
        </defs>

        {/* Background */}
        <rect x="0" y="0" width="800" height="385" fill="url(#skyGrad)" />
        <rect x="0" y="385" width="800" height="65" fill="url(#groundGrad)" />

        {/* Ground line */}
        <line x1="0" y1="385" x2="800" y2="385" stroke="#6B4B27" strokeWidth="2" />

        {/* Slingshot stick */}
        <line x1="81" y1="385" x2="81" y2="310" stroke="#6B3A2A" strokeWidth="10" strokeLinecap="round" />
        <line x1="81" y1="310" x2="63" y2="258" stroke="#6B3A2A" strokeWidth="7" strokeLinecap="round" />
        <line x1="81" y1="310" x2="99" y2="258" stroke="#6B3A2A" strokeWidth="7" strokeLinecap="round" />
        {/* Prong caps */}
        <circle cx={PRONG_LEFT.x} cy={PRONG_LEFT.y} r="5" fill="#8B4513" />
        <circle cx={PRONG_RIGHT.x} cy={PRONG_RIGHT.y} r="5" fill="#8B4513" />

        {/* Elastic band */}
        {isGrabbing ? (
          <>
            <line
              x1={PRONG_LEFT.x} y1={PRONG_LEFT.y}
              x2={ballPos.x} y2={ballPos.y}
              stroke="#CC8800" strokeWidth="3"
            />
            <line
              x1={PRONG_RIGHT.x} y1={PRONG_RIGHT.y}
              x2={ballPos.x} y2={ballPos.y}
              stroke="#CC8800" strokeWidth="3"
            />
          </>
        ) : (
          <line
            x1={PRONG_LEFT.x} y1={PRONG_LEFT.y}
            x2={PRONG_RIGHT.x} y2={PRONG_RIGHT.y}
            stroke="#CC8800" strokeWidth="2"
          />
        )}

        {/* Trajectory preview arc */}
        {showTrajectory && trajectoryPath && (
          <path
            d={trajectoryPath}
            fill="none"
            stroke="#FFD700"
            strokeWidth="3"
            strokeDasharray="10 7"
            opacity="0.85"
          />
        )}

        {/* Bottles (topple when hit) */}
        <Bottle x={365} y={352} hit={hit} delay={0} />
        <Bottle x={395} y={352} hit={hit} delay={100} />
        <Bottle x={380} y={325} hit={hit} delay={200} />

        {/* Wall — bricks */}
        <Wall hit={false} />

        {/* Target */}
        <Target hit={hit} />

        {/* Hit flash */}
        {hit && (
          <g>
            <circle cx={680} cy={330} r="55" fill="#FFD700" opacity="0.35">
              <animate attributeName="r" values="40;70;40" dur="0.5s" repeatCount="2" />
              <animate attributeName="opacity" values="0.5;0;0.5" dur="0.5s" repeatCount="2" />
            </circle>
            <text x="680" y="260" textAnchor="middle" fontSize="36" fontWeight="bold" fill="#FFD700" stroke="#8B4500" strokeWidth="2">
              🎯 โดน!
            </text>
          </g>
        )}

        {/* Projectile (at slingshot or animating) */}
        {isAnimating && projectilePosition ? (
          <circle
            cx={projectilePosition.x}
            cy={projectilePosition.y}
            r="14"
            fill="url(#ballGrad)"
            stroke="#8B0000"
            strokeWidth="2"
          />
        ) : (
          <circle
            cx={ballPos.x}
            cy={ballPos.y}
            r="14"
            fill="url(#ballGrad)"
            stroke="#8B0000"
            strokeWidth="2"
          />
        )}

        {/* Angle/speed HUD overlay */}
        <rect x="630" y="12" width="160" height="52" rx="8" fill="rgba(7,28,49,0.85)" />
        <text x="642" y="32" fontSize="13" fill="#aac" fontFamily="monospace">มุม</text>
        <text x="700" y="32" fontSize="16" fontWeight="bold" fill="#fff" fontFamily="monospace">{angle}°</text>
        <text x="642" y="54" fontSize="13" fill="#aac" fontFamily="monospace">แรง</text>
        <text x="700" y="54" fontSize="16" fontWeight="bold" fill="#fff" fontFamily="monospace">{speed}</text>
      </svg>
    </div>
  )
}

function Bottle({ x, y, hit, delay }: { x: number; y: number; hit: boolean; delay: number }) {
  const transform = hit ? `rotate(90, ${x + 10}, ${y + 25})` : undefined
  return (
    <g style={{ transform, transformBox: 'fill-box', transition: `transform 0.25s ease ${delay}ms` }}>
      <rect x={x} y={y} width="20" height="28" rx="4" fill="#4A90E2" stroke="#1E5FAA" strokeWidth="1.5" />
      <rect x={x + 6} y={y - 9} width="8" height="9" rx="2" fill="#4A90E2" stroke="#1E5FAA" strokeWidth="1" />
      <rect x={x + 4} y={y - 14} width="12" height="5" rx="2" fill="#777" />
      <line x1={x + 4} y1={y + 8} x2={x + 16} y2={y + 8} stroke="#6BAAE8" strokeWidth="1" opacity="0.6" />
    </g>
  )
}

function Wall({ hit }: { hit: boolean }) {
  const fill = hit ? '#888' : '#666'
  const brickRows = [220, 258, 296, 334, 372]
  return (
    <g>
      {brickRows.map((rowY, ri) => (
        <g key={ri}>
          {[0, 1].map((col) => {
            const bx = 500 + col * 32 + (ri % 2 === 0 ? 0 : 16)
            return (
              <rect
                key={col}
                x={bx}
                y={rowY}
                width={ri % 2 === 0 && col === 1 ? 16 : 30}
                height={36}
                rx="2"
                fill={fill}
                stroke="#333"
                strokeWidth="1.5"
              />
            )
          })}
        </g>
      ))}
    </g>
  )
}

function Target({ hit }: { hit: boolean }) {
  const cx = 680
  const cy = 340
  return (
    <g>
      <circle cx={cx} cy={cy} r="45" fill="#fff" stroke="#333" strokeWidth="2" />
      <circle cx={cx} cy={cy} r="34" fill={hit ? '#ff4444' : '#ee3333'} />
      <circle cx={cx} cy={cy} r="22" fill="#fff" />
      <circle cx={cx} cy={cy} r="12" fill={hit ? '#ff4444' : '#ee3333'} />
      <circle cx={cx} cy={cy} r="5" fill="#fff" />
    </g>
  )
}
