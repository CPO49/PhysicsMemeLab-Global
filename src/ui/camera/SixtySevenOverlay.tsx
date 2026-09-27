import { useEffect, useRef } from 'react'
import type { HandLandmarks } from '../../camera/handDetector'
import './SixtySevenOverlay.css'

const CONNECTIONS: [number, number][] = [
  [0,1],[1,2],[2,3],[3,4],
  [0,5],[5,6],[6,7],[7,8],
  [0,9],[9,10],[10,11],[11,12],
  [0,13],[13,14],[14,15],[15,16],
  [0,17],[17,18],[18,19],[19,20],
  [5,9],[9,13],[13,17],
]

function drawHand(ctx: CanvasRenderingContext2D, lm: HandLandmarks, color: string, w: number, h: number) {
  ctx.strokeStyle = color
  ctx.lineWidth = 5
  ctx.lineCap = 'round'
  ctx.shadowBlur = 10
  ctx.shadowColor = color
  for (const [a, b] of CONNECTIONS) {
    ctx.beginPath()
    ctx.moveTo(lm[a].x * w, lm[a].y * h)
    ctx.lineTo(lm[b].x * w, lm[b].y * h)
    ctx.stroke()
  }
  ctx.shadowBlur = 14
  for (let i = 0; i < lm.length; i++) {
    const r = i === 0 ? 9 : 5
    ctx.fillStyle = i === 0 ? '#ffc928' : '#fff'
    ctx.beginPath()
    ctx.arc(lm[i].x * w, lm[i].y * h, r, 0, Math.PI * 2)
    ctx.fill()
  }
}

interface SixtySevenOverlayProps {
  videoRef: React.RefObject<HTMLVideoElement | null>
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  hands: HandLandmarks[]
  pumpRate: number // 0–1
}

export function SixtySevenOverlay({ videoRef, canvasRef, hands, pumpRate }: SixtySevenOverlayProps) {
  const lastHandsRef = useRef<HandLandmarks[]>([])

  useEffect(() => {
    if (hands.length > 0) lastHandsRef.current = hands
  }, [hands])

  useEffect(() => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return
    const syncSize = () => {
      if (video.videoWidth > 0) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
      }
    }
    video.addEventListener('loadedmetadata', syncSize)
    syncSize()
    return () => video.removeEventListener('loadedmetadata', syncSize)
  }, [videoRef, canvasRef])

  const pumpRateRef = useRef(pumpRate)
  useEffect(() => { pumpRateRef.current = pumpRate }, [pumpRate])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    let raf: number
    const COLORS = ['#00d4ff', '#55ff6a']
    const draw = () => {
      const w = canvas.width
      const h = canvas.height
      if (w > 0 && h > 0) {
        ctx.clearRect(0, 0, w, h)
        lastHandsRef.current.forEach((lm, i) => {
          drawHand(ctx, lm, COLORS[i % 2], w, h)
        })
        // Pump pulse overlay
        const rate = pumpRateRef.current
        if (rate > 0.2) {
          ctx.fillStyle = `rgba(255, 201, 40, ${rate * 0.15})`
          ctx.fillRect(0, 0, w, h)
        }
      }
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [canvasRef])

  const handsCount = hands.length
  const label = handsCount < 2
    ? handsCount === 0 ? 'Raise both hands...' : 'Raise your other hand...'
    : pumpRate > 0.5 ? '⚡ Awesome! Keep going!' : '✊ Alternate hands up and down!'

  return (
    <div className="sixtyseven-overlay">
      <video ref={videoRef} className="sixtyseven-video" playsInline muted />
      <canvas ref={canvasRef} className="sixtyseven-canvas" />
      <div className="sixtyseven-status">
        <span className={`sixtyseven-label ${pumpRate > 0.4 ? 'is-pumping' : ''}`}>{label}</span>
      </div>
    </div>
  )
}
