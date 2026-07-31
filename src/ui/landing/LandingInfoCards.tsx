import { landingCards, type LandingInfoId } from './landingInfoData'

export function LandingInfoCards({ onOpen }: { onOpen: (id: LandingInfoId, trigger: HTMLButtonElement) => void }) {
  return <div className="g4-info-cards">{landingCards.map((card) => <button key={card.id} type="button" onClick={(event) => onOpen(card.id, event.currentTarget)} aria-label={card.title}>
    <img className="g4-info-cards__frame" src={gameUiAssets.landing.card} alt="" /><img className="g4-info-cards__icon" src={card.icon} alt="" /><span><strong>{card.title}</strong><small>{card.id === 'camera' ? 'ขยับมือเพื่อเล็ง' : card.id === 'gesture' ? 'กำมือ ง้าง แล้วปล่อย' : 'พร้อมเป็น fallback'}</small></span>
  </button>)}</div>
}
export const landingInfo = Object.fromEntries(landingCards.map(({ id, title, body }) => [id, { title, body }])) as Record<LandingInfoId, { title: string; body: string }>
