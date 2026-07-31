import { th } from '../../content/th'
import { gameUiAssets } from '../gameUiAssets'

const cards = [
  { id: 'camera', icon: gameUiAssets.landing.camera, title: th.g3.inputCamera, body: 'เกมสามารถใช้กล้องเพื่อตรวจจับท่าทาง โดยจะขออนุญาตเมื่อเริ่มภารกิจที่ต้องใช้กล้อง' },
  { id: 'gesture', icon: gameUiAssets.landing.hand, title: th.g3.inputGesture, body: 'ขยับมือเพื่อเพิ่มพลัง เล็ง และเรียกใช้สกิลที่เชื่อมกับบทเรียนฟิสิกส์' },
  { id: 'mouse', icon: gameUiAssets.landing.mouse, title: 'เล่นด้วยเมาส์และคีย์บอร์ด', body: 'หากไม่สะดวกเปิดกล้อง สามารถเล่นภารกิจด้วยเมาส์และคีย์บอร์ดได้ทันที' },
] as const

export type LandingInfoId = typeof cards[number]['id']
export function LandingInfoCards({ onOpen }: { onOpen: (id: LandingInfoId, trigger: HTMLButtonElement) => void }) {
  return <div className="g4-info-cards">{cards.map((card) => <button key={card.id} type="button" onClick={(event) => onOpen(card.id, event.currentTarget)} aria-label={card.title}>
    <img className="g4-info-cards__frame" src={gameUiAssets.landing.card} alt="" /><img className="g4-info-cards__icon" src={card.icon} alt="" /><span><strong>{card.title}</strong><small>{card.id === 'camera' ? 'ขยับมือเพื่อเล็ง' : card.id === 'gesture' ? 'กำมือ ง้าง แล้วปล่อย' : 'พร้อมเป็น fallback'}</small></span>
  </button>)}</div>
}
export const landingInfo = Object.fromEntries(cards.map(({ id, title, body }) => [id, { title, body }])) as Record<LandingInfoId, { title: string; body: string }>
