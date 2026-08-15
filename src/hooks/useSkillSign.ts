import { useCallback, useEffect, useRef, useState } from 'react'
import { isCameraSupported, startCamera, stopCamera } from '../camera/cameraStream'
import { createHandDetector, type HandDetector, type HandLandmarks } from '../camera/handDetector'
import { initialSkillSignState, updateSkillSign, type SkillSignState } from '../gestures/skillSignDetector'

export type SignCameraStatus = 'idle' | 'loading' | 'ready' | 'error' | 'unsupported'

export interface SkillSignResult {
  videoRef: React.RefObject<HTMLVideoElement | null>
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  status: SignCameraStatus
  error: string | null
  hands: HandLandmarks[]
  signPhase: SkillSignState['phase']
  start: () => void
  stop: () => void
}

export function useSkillSign(onStep1: () => void, onStep2: () => void): SkillSignResult {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const detectorRef = useRef<HandDetector | null>(null)
  const signStateRef = useRef<SkillSignState>(initialSkillSignState)
  const rafRef = useRef<number>(0)
  const runIdRef = useRef(0)
  const onStep1Ref = useRef(onStep1)
  const onStep2Ref = useRef(onStep2)

  const [status, setStatus] = useState<SignCameraStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const [hands, setHands] = useState<HandLandmarks[]>([])
  const [signPhase, setSignPhase] = useState<SkillSignState['phase']>('waiting')

  useEffect(() => { onStep1Ref.current = onStep1 }, [onStep1])
  useEffect(() => { onStep2Ref.current = onStep2 }, [onStep2])

  const stop = useCallback(() => {
    runIdRef.current += 1
    cancelAnimationFrame(rafRef.current)
    detectorRef.current?.close()
    detectorRef.current = null
    const video = videoRef.current
    if (video) stopCamera(video)
    signStateRef.current = initialSkillSignState
    setStatus('idle')
    setHands([])
    setSignPhase('waiting')
  }, [])

  const start = useCallback(async () => {
    if (!isCameraSupported()) { setStatus('unsupported'); setError('อุปกรณ์นี้ไม่รองรับกล้อง'); return }
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
        if (!vid || !det || vid.readyState < 2) { rafRef.current = requestAnimationFrame(runTick); return }

        const detected = det.detectFrameMulti(vid)
        setHands(detected)

        const { state, step1, step2 } = updateSkillSign(signStateRef.current, detected)
        signStateRef.current = state
        setSignPhase(state.phase)

        if (step1) onStep1Ref.current()
        if (step2) onStep2Ref.current()

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

  return { videoRef, canvasRef, status, error, hands, signPhase, start, stop }
}
