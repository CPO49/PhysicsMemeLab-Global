import { landingCards, type LandingInfoId } from './landingInfoData'
import { gameUiAssets } from '../gameUiAssets'

export function LandingInfoCards({ onOpen }: { onOpen: (id: LandingInfoId, trigger: HTMLButtonElement) => void }) {
  return <div className="g4-info-cards">{landingCards.map((card) => <button key={card.id} type="button" onClick={(event) => onOpen(card.id, event.currentTarget)} aria-label={card.title}>
    <img className="g4-info-cards__frame" src={gameUiAssets.landing.card} alt="" /><img className="g4-info-cards__icon" src={card.icon} alt="" /><span><strong>{card.title}</strong><small>{card.hint}</small></span>
  </button>)}</div>
}
