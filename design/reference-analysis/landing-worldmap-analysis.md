# Landing & World Map — Approved Reference Analysis

Source image: `design/references/approved_landing_worldmap_reference.png` (1448 × 1086). This document is the implementation checklist for Milestone G.2. Measurements are proportional approximations from the approved composition; the reference, not the preceding G.1 layout, is the visual authority.

## Shared canvas and hierarchy

- The reference is a portrait review canvas containing two full game screens. The target browser canvas for each screen is a 16:9 desktop viewport, with the composition also checked at 1366×768, 1600×900, and 1920×1080.
- Both pages are full-viewport scenes: no page-level horizontal or vertical scroll is allowed at those desktop sizes.
- Artwork provides the scenery and characters. HTML/CSS provides controls, labels, status, badges, navigation, responsive placement, and shadows only.
- Primary visual order is: scene artwork → active objective/action → player controls/status → supporting decoration.

## Landing page

### Composition bounds

| Element | Approx. bounds / share | Alignment and spacing |
| --- | --- | --- |
| Background notebook laboratory | 100% × 100% | Cover the viewport; notebook workspace is visibly available on the left, environmental decoration remains visible around the hero. |
| Content column | 38–42% of width | Starts roughly 5–7% from the left edge and 7–10% from the top; vertically paced as logo, headline, support, actions, control cards. |
| Final logo | 360–460 px at 1920×1080 | Upper-left; naturally sized, not repeated as a text title. |
| Thai headline | About 28–34% of page width | Directly below the logo with a small, deliberate gap; dark navy, 2–3 concise lines. |
| Supporting sentence | About 24–30% of page width | Below headline; short navy copy, clearly separated from the primary action. |
| Primary + secondary actions | 2 buttons in one row/group | Mid-left. Primary is visually strongest; secondary is present but quieter. |
| Control option cards | 3 equal compact cards across lower left | Camera, hands, mouse fallback. They share a baseline and are not a large enclosing card. |
| Mascot | 58–63% of page width visual area | Right side; largest focal object, cropped only by the artwork’s natural transparent bounds. The mascot’s face, hands, and feet remain visible. |

### Exact component count in the approved composition

- 1 final background, 1 final logo, 1 final mascot.
- 1 short Thai headline, 1 supporting sentence.
- 2 action buttons: primary journey CTA and secondary quick-demo action.
- 3 lower control cards: camera, hand play, mouse fallback; each has 1 icon, title, and short hint.
- No oversized cream content card, no duplicate game-name heading, and no debug/asset-required messaging.

### Current-page mismatches identified before reconstruction

- Only one CTA is present; the secondary quick-demo action and all three control cards are missing.
- The previous layout is still driven by layered G/G.1 CSS overrides, so the intended hierarchy is fragile.
- The copy block has insufficient semantic substructure for the reference’s headline/action/control hierarchy.
- The hero is visually too close to a simple left-copy/right-image arrangement rather than a complete playable landing scene.

### Available and supplemental assets

- Existing final assets: `landing_background_lab_notebook.png` (1672×941), `landing_logo_meme_physics_lab_67.png` (1536×1024), `landing_mascot_main.png` (1536×1024).
- Needed original supplements: play, camera, hand, mouse, and small tape/decorative elements. These are UI/decorative SVGs only; they do not replace any final artwork.

## World Map

### Composition bounds

| Element | Approx. bounds / share | Alignment and spacing |
| --- | --- | --- |
| Map scene | 100% of working page width; ~75–82% of page height below status | The ocean artwork is the dominant page area, not a small card with a wide sky border. |
| Top status | Upper edge, compact horizontal group | Energy + 67, diamond + 670, avatar/profile, `DEK67`, dropdown. |
| Side menu | Right edge, 4 compact stacked controls | Mission, personal stats, collection, settings; visually secondary to the map. |
| Island grid | 3 columns × 2 rows, centered inside routes | Each island occupies roughly 18–23% of map width and sits on its matching background route/space. |
| Top row | Projectile / Momentum / 67 Power | Active island left; locked Momentum middle; locked 67 Power right. |
| Bottom row | Friction / Energy / Mystery | Locked Friction left, locked Energy middle, Coming Soon Mystery right. |
| Island label | Directly below each artwork | Thai name, English name, and state/progress are grouped without covering the island art. |
| Map decoration | Wheel bottom-left, sticky note bottom-right | Small original overlays; preserve visible background boat, cloud, and route illustration. |

### Exact component count in the approved composition

- 1 ocean-map background and 6 final island artworks.
- 4 top-status items: energy, diamond, profile/avatar, player dropdown.
- 4 side-menu items: missions, stats, collection, settings.
- 6 island labels; one NEW badge, four compact lock badges, one Coming Soon badge.
- 6 state-backed star/progress displays (`0/30` at demo start), with no floating aggregate stars.
- 2 corner decoration assets: wheel and sticky note.

### Current-page mismatches identified before reconstruction

- The title/aggregate summary consumes header space that the reference assigns to player status.
- The four right-side navigation controls and the two corner decorations are missing.
- Island order is not the approved two-row order; current coordinates are inherited from the previous version.
- Labels are visually more like generic cards than tight island metadata; the map needs a larger, more integrated scene area.
- Locks are CSS-drawn and need to become a small generated asset overlay, so they do not dominate artwork.

### Available and supplemental assets

- Existing final assets: `worldmap_background_ocean_routes.png` (1672×941) and `island_01_projectile.png` through `island_06_power_67.png` (each 1536×1024).
- Needed original supplements: energy bolt, diamond, avatar frame, dropdown chevron, mission/stats/collection/settings icons, compact lock, star, NEW/Coming Soon tape badge, ship wheel, and sticky note. They remain HTML/SVG overlays; progress is always state-driven.

## Reconstruction rules derived from the reference

1. Consolidate the three previous Landing/Map CSS files into one component-scoped stylesheet; do not add a fourth override layer or `!important` rules.
2. Keep routing, locked-island modal behavior, mission/session state, physics, and visual-debug mode unchanged.
3. Retain the fallback chain for image-bearing elements: final PNG → generated/debug SVG → neutral CSS fallback.
4. Use semantic grid/flex layouts with percentage-based island anchors; only overlays within an island/artwork may be absolutely positioned.
5. Validate screenshot geometry and complete component counts, not just the absence of overflow.
