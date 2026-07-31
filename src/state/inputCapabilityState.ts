export type CameraPermissionState = 'idle' | 'requesting' | 'granted' | 'denied' | 'unavailable' | 'error'
export type GameplayInputMode = 'camera' | 'gesture' | 'mouseKeyboard'
export type InputCapabilityState = { camera: CameraPermissionState; inputMode: GameplayInputMode; error: string | null; notice: string | null }
export const initialInputCapabilityState: InputCapabilityState = { camera: 'idle', inputMode: 'mouseKeyboard', error: null, notice: null }
export function resolveCameraFailure(state: InputCapabilityState, camera: Extract<CameraPermissionState, 'denied' | 'unavailable' | 'error'>, error: string | null = null): InputCapabilityState {
  const notice = camera === 'denied' ? 'ไม่สามารถเปิดกล้องได้ เปลี่ยนเป็นโหมดเมาส์และคีย์บอร์ดแล้ว' : camera === 'unavailable' ? 'อุปกรณ์นี้ไม่พบกล้อง ใช้เมาส์และคีย์บอร์ดแทนได้' : 'ไม่สามารถเปิดกล้องได้ เปลี่ยนเป็นโหมดเมาส์และคีย์บอร์ดแล้ว'
  return { ...state, camera, inputMode: 'mouseKeyboard', error, notice }
}
