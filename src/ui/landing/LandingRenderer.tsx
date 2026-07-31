import { useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react'
import { th } from '../../content/th'
import { assets } from '../assets'
import { assetFallbacks } from '../assetFallbacks'
import { IllustratedAsset } from '../components/IllustratedAsset'
import { LandingActions } from './LandingActions'
import { LandingInfoCards } from './LandingInfoCards'
import type { LandingInfoId } from './landingInfoData'
import type { LandingElementId, LandingLayout, LandingLayoutElement } from './landingLayout'
import { LandingInfoModal } from './LandingInfoModal'
import './LandingRenderer.css'

interface LandingRendererProps {
  layout: LandingLayout
  onStart: () => void
  onQuickDemo: () => void
  editor?: boolean
  selectedId?: LandingElementId | null
  onElementPointerDown?: (id: LandingElementId, event: ReactPointerEvent<HTMLElement>, resize: boolean) => void
}

function boxStyle(element: LandingLayoutElement): CSSProperties {
  return {
    left: `${element.x}%`,
    top: `${element.y}%`,
    width: `${element.width}%`,
    height: `${element.height}%`,
    zIndex: element.zIndex,
    display: element.visible ? undefined : 'none',
    transform: `rotate(${element.rotation}deg)`,
  }
}

function textStyle(element: LandingLayoutElement): CSSProperties {
  return {
    fontSize: element.fontSize ? `clamp(14px, ${element.fontSize / 19.2}vw, ${element.fontSize}px)` : undefined,
    fontWeight: element.fontWeight,
    lineHeight: element.lineHeight,
    color: element.color,
    textAlign: element.textAlign,
  }
}

export function LandingRenderer({ layout, onStart, onQuickDemo, editor = false, selectedId, onElementPointerDown }: LandingRendererProps) {
  const [infoId, setInfoId] = useState<LandingInfoId | null>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const openInfo = (id: LandingInfoId, trigger: HTMLButtonElement) => {
    if (editor) return
    triggerRef.current = trigger
    setInfoId(id)
  }
  const closeInfo = () => {
    setInfoId(null)
    window.setTimeout(() => triggerRef.current?.focus(), 0)
  }
  const element = (id: LandingElementId, content: React.ReactNode) => {
    const item = layout.elements[id]
    return <div
      key={id}
      className={`landing-layout-element landing-layout-element--${id}${editor ? ' is-editable' : ''}${selectedId === id ? ' is-selected' : ''}${item.locked ? ' is-locked' : ''}`}
      data-layout-id={id}
      style={boxStyle(item)}
      onPointerDown={editor && !item.locked ? (event) => onElementPointerDown?.(id, event, false) : undefined}
    >
      {content}
      {editor && selectedId === id && !item.locked && <button
        className="landing-layout-resize"
        type="button"
        aria-label="Resize element"
        onPointerDown={(event) => { event.stopPropagation(); onElementPointerDown?.(id, event, true) }}
      />}
    </div>
  }

  return <section className={`g3-landing landing-renderer${editor ? ' landing-renderer--editor' : ''}`} aria-label={th.logoAlt}>
    <IllustratedAsset className="g3-landing__background" src={assets.final.landing.background} alt={th.landingSceneAlt} />
    {element('mascot', <IllustratedAsset className="g3-landing__mascot" src={assets.final.landing.mascot} debugSrc={assetFallbacks.mascot} alt={th.mascotAlt} />)}
    {element('logo', <IllustratedAsset className="g3-landing__logo" src={assets.final.landing.logo} alt={th.logoAlt} />)}
    {element('headline', <h1 className="g4-landing-headline" style={textStyle(layout.elements.headline)}>{(layout.elements.headline.text ?? '').split('\n').map((line, index) => <span key={`${line}-${index}`}>{line}</span>)}</h1>)}
    {element('support', <p className="landing-layout-support" style={textStyle(layout.elements.support)}>{layout.elements.support.text}</p>)}
    {element('actions', <LandingActions onStart={editor ? () => undefined : onStart} onQuickDemo={editor ? () => undefined : onQuickDemo} />)}
    {element('infoCards', <LandingInfoCards onOpen={openInfo} />)}
    {!editor && <LandingInfoModal id={infoId} onClose={closeInfo} />}
  </section>
}
