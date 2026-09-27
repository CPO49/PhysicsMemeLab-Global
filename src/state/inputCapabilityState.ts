export type CameraPermissionState = 'idle' | 'requesting' | 'granted' | 'denied' | 'unavailable' | 'error'
export type GameplayInputMode = 'camera' | 'gesture' | 'mouseKeyboard'
export type InputCapabilityState = { camera: CameraPermissionState; inputMode: GameplayInputMode; error: string | null; notice: string | null }
export const initialInputCapabilityState: InputCapabilityState = { camera: 'idle', inputMode: 'mouseKeyboard', error: null, notice: null }
export function resolveCameraFailure(state: InputCapabilityState, camera: Extract<CameraPermissionState, 'denied' | 'unavailable' | 'error'>, error: string | null = null): InputCapabilityState {
  const notice = camera === 'denied' ? 'Could not open the camera. Switched to mouse and keyboard controls.' : camera === 'unavailable' ? 'No camera found. You can use mouse and keyboard controls.' : 'Could not open the camera. Switched to mouse and keyboard controls.'
  return { ...state, camera, inputMode: 'mouseKeyboard', error, notice }
}
