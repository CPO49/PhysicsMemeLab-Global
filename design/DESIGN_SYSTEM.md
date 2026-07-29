# Design System — Bright Meme Physics Archipelago

## Source of truth
Primary visual reference:
`design/references/meme-physics-archipelago.png`

This document overrides the previous dark sci-fi dashboard direction.

## Art direction
**Bright Meme Physics Archipelago**

The product should feel like:
- a colorful browser game
- a playful physics adventure
- a lab notebook filled with stickers, tape, doodles, captions, and diagrams
- serious enough to support real learning and measurement

It must not feel like:
- a dark sci-fi dashboard
- a finance/admin dashboard
- a mobile gacha shop
- a generic school LMS
- an Angry Birds clone

## Visual balance
- 60% clear learning/game UX
- 25% world-building and mascot
- 15% meme reactions and jokes

The meme layer must not reduce readability or cover important simulation information.

## Color roles
Use design tokens rather than raw values in components.

- Cream Paper: primary content background
- Sky Blue: world and open-space background
- Deep Navy: navigation, HUD, strong text
- Electric Blue: active states and secondary actions
- Meme Yellow: primary CTA and reward emphasis
- Coral Red: warning, reaction, target accents
- Success Green: success and correct feedback
- Locked Gray Blue: locked islands and disabled content

## Surface styles
### Paper panel
- Warm cream background
- Subtle paper texture or grid
- Blue or navy outline
- Optional tape, pin, folded corner
- Used for briefs, prediction, concept check, summary

### Game panel
- Clean navy or blue frame
- Reduced decoration
- Used around gameplay and data comparison

### Sticker
- Thick white outer stroke
- Small shadow
- Slight rotation allowed
- Used for mascot reactions, badges, and short meme captions

## Typography
Use a two-font hierarchy if available:
- Display: bold, playful, poster-like; used sparingly
- Body/UI: highly readable Thai and Latin typeface

Rules:
- Do not use novelty font for paragraphs
- Thai text must remain readable at mobile widths
- Maximum three text sizes per screen, excluding tiny metadata

## Layout
- Desktop-first 16:9 demo, responsive down to tablet and mobile
- Gameplay area is the visual priority on the gameplay screen
- Avoid repeated dashboard cards when a scene/map can communicate the same information
- Keep primary action in a consistent lower-right or central position

## World map
- Ocean and islands are the main composition
- Active island is colorful and animated subtly
- Locked islands are desaturated and show a clear lock
- Dotted route connects progression
- Map labels must remain readable and not be baked into detailed art if avoidable

## Mascot
Use an original mascot.

Two forms:
1. Hero render: Landing and major island scenes
2. Reaction sticker set: guidance, mistakes, success, hints, summary

Required reaction states:
- Welcome
- Thinking
- Aiming
- Collision/fail
- Near success
- Success/67 pose
- Scientist/explainer

## Meme language
Meme identity comes from timing, reaction, caption, and context—not from visual clutter.

Examples:
- “แรงอย่างเดียวไม่ได้ช่วยทุกอย่างนะ”
- “ขึ้นถึงดาว แต่ไม่ถึงเป้า”
- “อาจารย์บอกว่าง่าย”

Captions must also communicate useful feedback where possible.

## Motion
- Gentle island float and cloud movement
- Short mascot squash/stretch
- Quick freeze-frame reaction after impact
- Draw trajectory progressively
- Avoid long blocking celebration animations
- Respect reduced-motion preference

## Gameplay clarity
During aiming and simulation:
- Reduce decorative meme elements
- Keep target, wall, projectile, hand state, angle, and strength visible
- Use high-contrast trajectory lines
- Reactions appear after the attempt, not while precise aiming is required

## Accessibility
- Do not communicate state by color alone
- Provide mouse/touch fallback
- Explain camera permission and privacy clearly
- Support keyboard navigation for non-game screens
- Maintain readable contrast

## Forbidden changes without updating this document
- Returning to full dark-dashboard theme
- Adding shop/currency economy
- Replacing world map with a plain card grid
- Using copyrighted Angry Birds assets
- Making every screen visually chaotic
- Hiding learning evidence behind game scores only
