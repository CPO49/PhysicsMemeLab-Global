import { useEffect } from 'react'
import { th } from '../../content/th'
import { landingInfo, type LandingInfoId } from './landingInfoData'

export function LandingInfoModal({ id, onClose }: { id: LandingInfoId | null; onClose: () => void }) {
  useEffect(() => { const key = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }; window.addEventListener('keydown', key); return () => window.removeEventListener('keydown', key) }, [onClose])
  if (!id) return null
  const info = landingInfo[id]
  return <div className="g4-info-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}><section role="dialog" aria-modal="true" aria-labelledby="landing-info-title" className="g4-info-modal"><button type="button" aria-label={th.g3.close} onClick={onClose}>×</button><h2 id="landing-info-title">{info.title}</h2><p>{info.body}</p><button type="button" onClick={onClose}>{th.g3.close}</button></section></div>
}
