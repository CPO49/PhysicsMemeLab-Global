import { useCallback, useEffect, useRef, useState } from 'react'
import { isCameraSupported, startCamera, stopCamera } from '../camera/cameraStream'
import { createHandDetector, type HandDetector, type HandLandmarks } from '../camera/handDetector'
import { detectSixtySeven, initialSixtySevenState, type SixtySevenState } from '../gestures/sixtySevenDetector'

export type PumpCameraStatus = 'idle' | 'loading' | 'ready' | 'error' | 'unsupported'

export interface SixtySevenPumpResult {
  videoRef: React.RefObject<HTMLVideoElement | null>
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  status: PumpCameraStatus
  error: string | null
  hands: HandLandmarks[]
  pumpRate: number // 0–1 how fast they're pumping
  start: () => void
  stop: () => void
}

export function useSixtySevenPump(onPump: () => void): SixtySevenPumpResult {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const detectorRef = useRef<HandDetector | null>(null)
  const gestureStateRef = useRef<SixtySevenState>(initialSixtySevenState)
  const pumpTimestampsRef = useRef<number[]>([])
  const rafRef = useRef<number>(0)
  const runIdRef = useRef(0)
  const onPumpRef = useRef(onPump)

  const [status, setStatus] = useState<PumpCameraStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const [hands, setHands] = useState<HandLandmarks[]>([])
  const [pumpRate, setPumpRate] = useState(0)

  useEffect(() => { onPumpRef.current = onPump }, [onPump])

  const stop = useCallback(() => {
    runIdRef.current += 1
    cancelAnimationFrame(rafRef.current)
    detectorRef.current?.close()
    detectorRef.current = null
    const video = videoRef.current
    if (video) stopCamera(video)
    gestureStateRef.current = initialSixtySevenState
    pumpTimestampsRef.current = []
    setStatus('idle')
    setHands([])
    setPumpRate(0)
  }, [])

  const start = useCallback(async () => {
    if (!isCameraSupported()) {
      setStatus('unsupported')
      setError('อุปกรณ์นี้ไม่รองรับกล้อง')
      return
    }
    setStatus('loading')
    setError(null)

    const runId = ++runIdRef.current
    let video: HTMLVideoElement | null = null
    let stream: MediaStream | null = null
    let detector: HandDetector | null = null

    try {
      video = videoRef.current
      if (!video) throw new Error('unknown')
      stream = await startCamera(video)
      if (runId !== runIdRef.current) {
        stopCamera(video, stream)
        return
      }

      detector = await createHandDetector()
      if (runId !== runIdRef.current) {
        detector.close()
        stopCamera(video, stream)
        return
      }

      detectorRef.current = detector
      setStatus('ready')

      const runTick = () => {
        if (runId !== runIdRef.current) return
        const vid = videoRef.current
        const det = detectorRef.current
        if (!vid || !det || vid.readyState < 2) {
          rafRef.current = requestAnimationFrame(runTick)
          return
        }

        const detected = det.detectFrameMulti(vid)
        setHands(detected)

        const now = performance.now()
        const { state: nextState, pumped } = detectSixtySeven(
          gestureStateRef.current,
          detected,
          now,
        )
        gestureStateRef.current = nextState

        if (pumped) {
          pumpTimestampsRef.current = [
            ...pumpTimestampsRef.current.filter((t) => now - t < 1000),
            now,
          ]
          onPumpRef.current()
        }

        // Update pump rate display
        const recentCount = pumpTimestampsRef.current.filter((t) => now - t < 1000).length
        setPumpRate(Math.min(1, recentCount / 6))

        rafRef.current = requestAnimationFrame(runTick)
      }
      rafRef.current = requestAnimationFrame(runTick)
    } catch (err) {
      detector?.close()
      if (video && stream) stopCamera(video, stream)
      if (runId !== runIdRef.current) return
      const msg = err instanceof Error ? err.message : 'unknown'
      const readable: Record<string, string> = {
        'permission-denied': 'กรุณาอนุญาตการใช้กล้อง',
        'not-found': 'ไม่พบกล้องในอุปกรณ์นี้',
        'not-readable': 'กล้องถูกใช้งานโดยโปรแกรมอื่นอยู่',
        'unknown': 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง',
      }
      setError(readable[msg] ?? readable['unknown'])
      setStatus('error')
    }
  }, [])

  useEffect(() => () => stop(), [stop])

  return { videoRef, canvasRef, status, error, hands, pumpRate, start, stop }
}
