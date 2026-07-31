import { th } from '../../content/th'
import { gameUiAssets } from '../gameUiAssets'
export const landingCards = [
  { id: 'camera', icon: gameUiAssets.landing.camera, title: th.g3.inputCamera, body: 'เกมสามารถใช้กล้องเพื่อตรวจจับท่าทาง โดยจะขออนุญาตเมื่อเริ่มภารกิจที่ต้องใช้กล้อง', hint: 'ขยับมือเพื่อเล็ง' },
  { id: 'gesture', icon: gameUiAssets.landing.hand, title: th.g3.inputGesture, body: 'ขยับมือเพื่อเพิ่มพลัง เล็ง และเรียกใช้สกิลที่เชื่อมกับบทเรียนฟิสิกส์', hint: 'กำมือ ง้าง แล้วปล่อย' },
  { id: 'mouse', icon: gameUiAssets.landing.mouse, title: 'เล่นด้วยเมาส์และคีย์บอร์ด', body: 'หากไม่สะดวกเปิดกล้อง สามารถเล่นภารกิจด้วยเมาส์และคีย์บอร์ดได้ทันที', hint: 'พร้อมเป็น fallback' },
] as const
export type LandingInfoId = typeof landingCards[number]['id']
export const landingInfo = Object.fromEntries(landingCards.map(({ id, title, body }) => [id, { title, body }])) as Record<LandingInfoId, { title: string; body: string }>
