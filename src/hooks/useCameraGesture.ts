import { useCallback, useEffect, useRef, useState } from 'react'
import { isCameraSupported, startCamera, stopCamera } from '../camera/cameraStream'
import { createHandDetector, type HandDetector, type HandLandmarks } from '../camera/handDetector'
import {
  initialGestureState,
  updateGestureState,
  type GesturePhase,
  type GestureState,
} from '../gestures/gestureStateMachine'
import { landmarksToAim, wristToBaseAim, type AimInput } from '../gestures/landmarkToAim'

export type CameraStatus = 'idle' | 'loading' | 'ready' | 'error' | 'unsupported'

export interface CameraGestureResult {
  videoRef: React.RefObject<HTMLVideoElement | null>
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  status: CameraStatus
  error: string | null
  gesturePhase: GesturePhase
  aim: AimInput
  landmarks: HandLandmarks | null
  start: () => void
  stop: () => void
}

export function useCameraGesture(onFire: (aim: AimInput) => void): CameraGestureResult {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const detectorRef = useRef<HandDetector | null>(null)
  const gestureRef = useRef<GestureState>(initialGestureState)
  const grabAnchorRef = useRef<{ x: number; y: number } | null>(null)
  const rafRef = useRef<number>(0)
  const runIdRef = useRef(0)
  const firedRef = useRef(false)
  const onFireRef = useRef(onFire)
  const currentAimRef = useRef<AimInput>({ angle: 45, speed: 25 })

  const [status, setStatus] = useState<CameraStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const [gesturePhase, setGesturePhase] = useState<GesturePhase>('idle')
  const [aim, setAim] = useState<AimInput>({ angle: 45, speed: 25 })
  const [landmarks, setLandmarks] = useState<HandLandmarks | null>(null)

  useEffect(() => {
    onFireRef.current = onFire
  }, [onFire])

  const stop = useCallback(() => {
    runIdRef.current += 1
    cancelAnimationFrame(rafRef.current)
    detectorRef.current?.close()
    detectorRef.current = null
    const video = videoRef.current
    if (video) stopCamera(video)
    gestureRef.current = initialGestureState
    grabAnchorRef.current = null
    firedRef.current = false
    setStatus('idle')
    setGesturePhase('idle')
    setLandmarks(null)
  }, [])

  const start = useCallback(async () => {
    if (!isCameraSupported()) {
      setStatus('unsupported')
      setError('This device does not support a camera')
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

        const detected = det.detectFrame(vid)
        setLandmarks(detected)

        const prev = gestureRef.current
        const next = updateGestureState(prev, detected)
        gestureRef.current = next
        setGesturePhase(next.phase)

        if (next.phase === 'grabbed' && prev.phase !== 'grabbed' && prev.phase !== 'aiming') {
          grabAnchorRef.current = next.wrist
          firedRef.current = false
        }

        if ((next.phase === 'grabbed' || next.phase === 'aiming') && detected) {
          const anchor = grabAnchorRef.current
          const newAim = anchor ? landmarksToAim(detected, anchor) : wristToBaseAim(detected)
          currentAimRef.current = newAim
          setAim(newAim)
        }

        if (next.phase === 'released' && !firedRef.current) {
          firedRef.current = true
          onFireRef.current(currentAimRef.current)
        }

        rafRef.current = requestAnimationFrame(runTick)
      }

      rafRef.current = requestAnimationFrame(runTick)
    } catch (err) {
      detector?.close()
      if (video && stream) stopCamera(video, stream)
      if (runId !== runIdRef.current) return
      const msg = err instanceof Error ? err.message : 'unknown'
      const readable: Record<string, string> = {
        'permission-denied': 'Please allow camera access',
        'not-found': 'No camera found on this device',
        'not-readable': 'The camera is in use by another application',
        'unknown': 'Something went wrong. Please try again.',
      }
      setError(readable[msg] ?? readable['unknown'])
      setStatus('error')
    }
  }, [])

  useEffect(() => () => stop(), [stop])

  return { videoRef, canvasRef, status, error, gesturePhase, aim, landmarks, start, stop }
}
