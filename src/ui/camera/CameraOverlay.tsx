import { useEffect, useRef } from 'react'
import type { HandLandmarks } from '../../camera/handDetector'
import type { GesturePhase } from '../../gestures/gestureStateMachine'
import './CameraOverlay.css'

interface CameraOverlayProps {
  videoRef: React.RefObject<HTMLVideoElement | null>
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  gesturePhase: GesturePhase
  landmarks: HandLandmarks | null
}

const CONNECTIONS: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [0, 9], [9, 10], [10, 11], [11, 12],
  [0, 13], [13, 14], [14, 15], [15, 16],
  [0, 17], [17, 18], [18, 19], [19, 20],
  [5, 9], [9, 13], [13, 17],
]
const KEY_POINTS = [0, 4, 8, 12, 16, 20]

function drawLandmarks(
  ctx: CanvasRenderingContext2D,
  landmarks: HandLandmarks,
  phase: GesturePhase,
  w: number,
  h: number,
) {
  const isGrabbing = phase === 'grabbed' || phase === 'aiming'
  const lineColor = isGrabbing ? '#55ff6a' : '#00d4ff'

  ctx.strokeStyle = lineColor
  ctx.lineWidth = 5
  ctx.lineCap = 'round'
  ctx.shadowBlur = 10
  ctx.shadowColor = lineColor

  for (const [a, b] of CONNECTIONS) {
    const s = landmarks[a]
    const e = landmarks[b]
    ctx.beginPath()
    ctx.moveTo(s.x * w, s.y * h)
    ctx.lineTo(e.x * w, e.y * h)
    ctx.stroke()
  }

  ctx.shadowBlur = 14
  for (const idx of KEY_POINTS) {
    const p = landmarks[idx]
    const x = p.x * w
    const y = p.y * h
    const r = idx === 0 ? 10 : 7
    ctx.fillStyle = idx === 0 ? '#ffc928' : '#ffffff'
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = lineColor
    ctx.lineWidth = 3
    ctx.shadowBlur = 8
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.stroke()
  }
}

export function CameraOverlay({ videoRef, canvasRef, gesturePhase, landmarks }: CameraOverlayProps) {
  // Use refs so rAF loop always reads latest values without restarting
  const lastLandmarksRef = useRef<HandLandmarks | null>(null)
  const gesturePhaseRef = useRef<GesturePhase>(gesturePhase)

  useEffect(() => {
    if (landmarks) lastLandmarksRef.current = landmarks
  }, [landmarks])

  useEffect(() => {
    gesturePhaseRef.current = gesturePhase
  }, [gesturePhase])

  // Set canvas dimensions once when video loads
  useEffect(() => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    const syncSize = () => {
      if (video.videoWidth > 0 && (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight)) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
      }
    }
    video.addEventListener('loadedmetadata', syncSize)
    syncSize()
    return () => video.removeEventListener('loadedmetadata', syncSize)
  }, [videoRef, canvasRef])

  // Single rAF loop — never restarts (refs keep values fresh)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let rafId: number
    const draw = () => {
      const w = canvas.width
      const h = canvas.height
      if (w > 0 && h > 0) {
        ctx.clearRect(0, 0, w, h)
        const lm = lastLandmarksRef.current
        if (lm) {
          ctx.save()
          drawLandmarks(ctx, lm, gesturePhaseRef.current, w, h)
          ctx.restore()
        }
      }
      rafId = requestAnimationFrame(draw)
    }

    rafId = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(rafId)
  }, [canvasRef]) // Only canvas ref — never restarts mid-game

  const gestureLabel: Record<GesturePhase, string> = {
    idle: 'Waiting for a hand...',
    hover: 'Make a fist to grab',
    grabbed: '✊ Grabbed!',
    aiming: '🎯 Aiming...',
    released: '🚀 Launch!',
  }

  return (
    <div className="camera-overlay">
      <video ref={videoRef} className="camera-video" playsInline muted />
      <canvas ref={canvasRef} className="camera-canvas" />
      <div className="camera-status">
        <span className={`gesture-label gesture-${gesturePhase}`}>
          {gestureLabel[gesturePhase]}
        </span>
      </div>
    </div>
  )
}

interface CameraErrorProps {
  message: string
  onDismiss: () => void
}

export function CameraError({ message, onDismiss }: CameraErrorProps) {
  return (
    <div className="camera-error">
      <strong>Could not open the camera</strong>
      <p>{message}</p>
      <button onClick={onDismiss}>Try again</button>
    </div>
  )
}
