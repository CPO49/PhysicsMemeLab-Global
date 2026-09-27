import { th } from '../../content/th'

export const LANDING_LAYOUT_STORAGE_KEY = 'memePhysics.landingLayout.en.v1'

export type LandingElementId = 'logo' | 'mascot' | 'headline' | 'support' | 'actions' | 'infoCards'

export interface LandingLayoutElement {
  id: LandingElementId
  x: number
  y: number
  width: number
  height: number
  rotation: number
  zIndex: number
  visible: boolean
  locked: boolean
  text?: string
  fontSize?: number
  fontWeight?: number
  lineHeight?: number
  color?: string
  textAlign?: 'left' | 'center' | 'right'
}

export interface LandingLayout {
  version: 1
  elements: Record<LandingElementId, LandingLayoutElement>
}

export const landingElementIds: LandingElementId[] = ['logo', 'headline', 'support', 'actions', 'infoCards', 'mascot']

export const defaultLandingLayout: LandingLayout = {
  version: 1,
  elements: {
    logo: { id: 'logo', x: 8.6, y: 4.4, width: 24, height: 30, rotation: 0, zIndex: 3, visible: true, locked: false },
    mascot: { id: 'mascot', x: 38, y: 0, width: 62, height: 100, rotation: 0, zIndex: 1, visible: true, locked: false },
    headline: { id: 'headline', x: 8.6, y: 38, width: 31, height: 11, rotation: 0, zIndex: 3, visible: true, locked: false, text: th.g3.landingHeadlineLines.join('\n'), fontSize: 46, fontWeight: 700, lineHeight: 1.18, color: '#282018', textAlign: 'left' },
    support: { id: 'support', x: 8.6, y: 49.5, width: 30, height: 4.5, rotation: 0, zIndex: 3, visible: true, locked: false, text: th.g3.landingSupport, fontSize: 18, fontWeight: 600, lineHeight: 1.4, color: '#3a2e1a', textAlign: 'left' },
    actions: { id: 'actions', x: 8.6, y: 55, width: 22, height: 13, rotation: 0, zIndex: 3, visible: true, locked: false },
    infoCards: { id: 'infoCards', x: 8.6, y: 87, width: 30, height: 9, rotation: 0, zIndex: 3, visible: true, locked: false },
  },
}

export function cloneLandingLayout(layout: LandingLayout): LandingLayout {
  return JSON.parse(JSON.stringify(layout)) as LandingLayout
}

export function isLandingLayout(value: unknown): value is LandingLayout {
  if (!value || typeof value !== 'object') return false
  const candidate = value as Partial<LandingLayout>
  if (candidate.version !== 1 || !candidate.elements || typeof candidate.elements !== 'object') return false
  return landingElementIds.every((id) => {
    const element = candidate.elements?.[id]
    return Boolean(
      element &&
      element.id === id &&
      [element.x, element.y, element.width, element.height, element.rotation, element.zIndex].every(Number.isFinite) &&
      typeof element.visible === 'boolean' &&
      typeof element.locked === 'boolean',
    )
  })
}

export function loadLandingLayout(): LandingLayout {
  try {
    const raw = window.localStorage.getItem(LANDING_LAYOUT_STORAGE_KEY)
    if (!raw) return cloneLandingLayout(defaultLandingLayout)
    const parsed: unknown = JSON.parse(raw)
    return isLandingLayout(parsed) ? parsed : cloneLandingLayout(defaultLandingLayout)
  } catch {
    return cloneLandingLayout(defaultLandingLayout)
  }
}

export function saveLandingLayout(layout: LandingLayout) {
  window.localStorage.setItem(LANDING_LAYOUT_STORAGE_KEY, JSON.stringify(layout))
}

export function resetLandingLayout() {
  window.localStorage.removeItem(LANDING_LAYOUT_STORAGE_KEY)
}

export function updateLandingElement(layout: LandingLayout, id: LandingElementId, patch: Partial<LandingLayoutElement>): LandingLayout {
  return {
    ...layout,
    elements: {
      ...layout.elements,
      [id]: { ...layout.elements[id], ...patch, id },
    },
  }
}
