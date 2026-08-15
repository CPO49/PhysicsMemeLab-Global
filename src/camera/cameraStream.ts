export type CameraError = 'permission-denied' | 'not-found' | 'not-readable' | 'unknown'

export async function startCamera(videoElement: HTMLVideoElement): Promise<MediaStream> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 640 },
        height: { ideal: 480 },
        facingMode: 'user',
      },
    })
    videoElement.srcObject = stream
    await videoElement.play()
    return stream
  } catch (error) {
    const err = error as DOMException
    if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
      throw new Error('permission-denied', { cause: error })
    }
    if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
      throw new Error('not-found', { cause: error })
    }
    if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
      throw new Error('not-readable', { cause: error })
    }
    throw new Error('unknown', { cause: error })
  }
}

export function stopCamera(videoElement: HTMLVideoElement, stream = videoElement.srcObject as MediaStream | null): void {
  if (stream) {
    stream.getTracks().forEach((track) => track.stop())
    if (videoElement.srcObject === stream) videoElement.srcObject = null
  }
}

export function isCameraSupported(): boolean {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
}
