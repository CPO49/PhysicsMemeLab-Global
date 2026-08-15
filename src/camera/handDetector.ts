import { HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision'

export type Landmark = { x: number; y: number; z: number }
export type HandLandmarks = Landmark[]

export interface HandDetector {
  detectFrame(videoElement: HTMLVideoElement): HandLandmarks | null
  detectFrameMulti(videoElement: HTMLVideoElement): HandLandmarks[]
  close(): void
}

export async function createHandDetector(): Promise<HandDetector> {
  const vision = await FilesetResolver.forVisionTasks(
    'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm',
  )

  const handLandmarker = await HandLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/latest/hand_landmarker.task',
      delegate: 'GPU',
    },
    runningMode: 'VIDEO',
    numHands: 2,
  })

  let lastVideoTime = -1

  const runDetection = (videoElement: HTMLVideoElement) => {
    const currentTime = videoElement.currentTime
    if (currentTime === lastVideoTime) return null
    lastVideoTime = currentTime
    return handLandmarker.detectForVideo(videoElement, performance.now())
  }

  return {
    detectFrame(videoElement: HTMLVideoElement): HandLandmarks | null {
      const result = runDetection(videoElement)
      if (!result) return null
      return result.landmarks?.length > 0 ? (result.landmarks[0] as HandLandmarks) : null
    },

    detectFrameMulti(videoElement: HTMLVideoElement): HandLandmarks[] {
      const result = runDetection(videoElement)
      if (!result || !result.landmarks) return []
      return result.landmarks as HandLandmarks[]
    },

    close(): void {
      handLandmarker.close()
    },
  }
}
