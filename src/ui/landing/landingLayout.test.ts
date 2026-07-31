import { describe, expect, it } from 'vitest'
import { cloneLandingLayout, defaultLandingLayout, isLandingLayout, updateLandingElement } from './landingLayout'

describe('landing layout model', () => {
  it('accepts the versioned default layout', () => {
    expect(isLandingLayout(defaultLandingLayout)).toBe(true)
  })

  it('rejects incomplete imported data', () => {
    expect(isLandingLayout({ version: 1, elements: {} })).toBe(false)
  })

  it('updates one element without mutating the source layout', () => {
    const source = cloneLandingLayout(defaultLandingLayout)
    const next = updateLandingElement(source, 'headline', { x: 12, text: 'Demo' })
    expect(next.elements.headline.x).toBe(12)
    expect(next.elements.headline.text).toBe('Demo')
    expect(source.elements.headline.x).toBe(defaultLandingLayout.elements.headline.x)
  })
})
