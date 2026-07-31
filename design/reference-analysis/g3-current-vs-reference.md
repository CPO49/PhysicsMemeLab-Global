# G.3 — Current vs Approved Reference Analysis

Sources reviewed: current Landing screenshot (Image 1), current World Map screenshot (Image 2), and approved visual reference (Image 3). Image 3 is the visual source of truth; current screenshots are evidence of mismatches only.

## 1. Landing — Current vs Reference

| Element | Current approx. x/y/w/h | Reference approx. x/y/w/h | Type | Visual role | Interaction role | Current → required behavior |
| --- | --- | --- | --- | --- | --- | --- |
| Notebook/lab scene | 0/0/100/100% | 0/0/100/100% | Raster asset | Full-screen stage | Decoration | Correct asset role; preserve cover composition. |
| Final logo | 5/8/20/20% | 15/5/23/38% | Raster asset | Primary brand marker | None | Current is too small and left; enlarge/anchor in notebook zone. |
| Headline | 3/46/38/7% | 16/46/22/9% | HTML/CSS | Explain product promise | None | Current is one line over notebook graph; required two-line grouped copy below logo. |
| Supporting copy | 3/53/32/3% | 16/59/22/3% | HTML/CSS | Supporting context | None | Current too far left and low contrast; group under headline. |
| Primary CTA | 3/59/17/7% | 15/64/22/7% | Interactive control + generated SVG frame | Main conversion | Go World Map | Current works, but is too small/flat and shares row with secondary. Required vertical primary action with hover/pressed/focus. |
| Secondary CTA | 20/59/12/7% | 18/72/16/4% | Interactive control + generated SVG frame | Quick entry | Start Projectile Mission demo | Current routes to Map incorrectly; required distinct lower action. |
| Input controls | 3/86/36/9% | 15/80/24/8% | Interactive controls + generated SVG frame | Input choice | Set `inputMode` | Current cards are non-interactive flat web cards; required three selected controls with response. |
| Mascot | 48/13/46/76% | 39/2/55/96% | Raster asset | Largest focal illustration | Decoration | Current has correct art but requires larger, more central-right, full silhouette prominence. |
| Decorative tape | 65/10/7/3% | none | Generated SVG decoration | None | None | Current empty tape has no visual role; remove. |

## 2. World Map — Current vs Reference

| Element | Current approx. x/y/w/h | Reference approx. x/y/w/h | Type | Visual role | Interaction role | Current → required behavior |
| --- | --- | --- | --- | --- | --- | --- |
| Ocean map stage | 2/24/89/69% | 0/0/100/100% | Raster asset | Main game world | Map interaction surface | Current is a bordered dashboard card with cyan margins. Required full-screen map with overlay HUD/menu. |
| Top HUD | 2/2/22/6% | 43/1/47/6% | Interactive HTML/CSS + generated SVG | Player resources/profile | Profile opens dropdown | Current uses cream pills at left; required navy beveled HUD centered-right over map. |
| Energy / diamond values | within top HUD | within top HUD | State-backed HTML | Resource feedback | Reflect state | Current values are constants in components; required UI state values. |
| Side menu | 91/27/7/33% | 88/10/11/27% | Interactive controls + generated SVG frames | Secondary navigation | Open panels/modals | Current cream cards are generic and do nothing. Required navy game menu overlays with active state and handlers. |
| Projectile island | 13/34/14/15% | 16/12/18/16% | Raster artwork + overlays | Available mission | Go Hub | Works, but reference uses larger glowing art and navy label/progress treatment. |
| Momentum island | 43/34/14/15% | 42/14/18/15% | Raster artwork + overlays | Locked future mission | Locked modal | Works, but current lock is small and displaced. Required large centered lock. |
| 67 Power island | 73/34/14/15% | 67/14/18/15% | Raster artwork + overlays | Locked future mission | Locked modal | Works, but map position/label UI need reference treatment. |
| Friction island | 13/64/14/15% | 17/58/18/16% | Raster artwork + overlays | Locked future mission | Locked modal | Works; required large centered lock and navy label. |
| Energy island | 43/64/14/15% | 42/58/18/16% | Raster artwork + overlays | Locked future mission | Locked modal | Works; required large centered lock and navy label. |
| Mystery island | 73/64/14/15% | 67/58/18/16% | Raster artwork + overlays | Coming-soon destination | Coming Soon modal | Works, but needs dark state and coherent navy label/badge. |
| Island labels/progress | Below art | Overlapping lower art boundary | Generated SVG frame + HTML | Identity and advancement | State display | Current white cards are dashboard-like. Required dark navy label and separate gold progress frame. |
| Ship wheel | 3/79/8/15% | 0/80/15/20% | Generated SVG decoration | Nautical depth | Decoration | Current is too small/simple; needs ornate game decoration. |
| Sticky note | 79/79/9/9% | 83/80/14/17% | Generated SVG decoration | Encouragement/depth | Decoration | Current generic note is too small and lacks reference character. |

## 3. Missing visual elements

- Landing’s vertical button hierarchy, rounded gold primary action, dark secondary action, and three framed input controls.
- Game-grade navy bevel frames for HUD, menu, labels, progress, and map badges.
- Top HUD add indicator and profile/avatar treatment.
- Island progress labels with dark frame and gold star/progress strip.
- Large centered locks, active island glow, and dark coming-soon state.
- Full-screen map integration: HUD/menu should overlay the map rather than sit in cyan page margin.

## 4. Incorrectly placed elements

- Landing logo/headline/action group is too far left and too shallow vertically; it needs a tight notebook-zone column at 15–40% x.
- Landing CTAs are side-by-side rather than vertically ordered.
- Map HUD is upper-left outside the composition instead of upper-center/right overlay.
- Map menu sits outside the scene; it must sit on top of the ocean scene near the right edge.
- Map islands are visually small because the scene is contained in a dashboard card.

## 5. Elements with incorrect scale

- Landing logo: current perceived width ≈20%; reference ≈23% with much larger height.
- Landing mascot: current perceived height ≈76%; reference ≈96%.
- Map active island and island labels: current ≈14–15%; reference ≈18%.
- Ship wheel/sticky note: current 8–9%; reference 14–17%.
- Map lock: current ≈2%; reference is a prominent ≈6–7% centered overlay.

## 6. Elements that look like placeholder SVG

All 17 G.2 generated assets are generic-outline/flat SVGs and require replacement or retirement from visible game UI. The simple camera, hand, mouse, resource icons, profile, menu icons, locks, labels, and decorations lack bevel, layered fill, highlight, and game-grade depth. The old tape is retired because it has no functional role. G.3 adds polished replacements under `generated/hud`, `generated/menu`, `generated/landing`, and `generated/map`.

## 7. Buttons that exist visually but do not have working behavior

- Landing quick-demo button currently calls the World Map callback rather than entering demo mission.
- Landing camera/hand/mouse cards are articles, not controls; they cannot set input mode.
- Profile control has no dropdown behavior.
- All four World Map side-menu controls have no handlers.

## 8. Required assets

- Raster assets retained: final landing background/logo/mascot, ocean map background, all six final island PNGs.
- Generated game UI assets required: HUD frames, profile/avatar, menu frames/icons, landing frames/icons, map label/progress/locks/badges/sticky note.
- Decoration only: ship wheel and sticky note. All text remains HTML, never embedded Thai in SVG.

## 9. Required components

- `LandingActions`, `InputModeSelector`, page-local CSS.
- `WorldMapHud`, `IslandLabel`, `WorldMapModal`, page-local CSS.
- Central `uiState`, `worldMapState`, and `worldMapData` modules for active input, resource values, panels, map progress, and island placement.

## 10. Required interaction/state changes

- Add selectable `camera | gesture | mouse` input state; camera shows an explicit readiness message, mouse is a working fallback.
- Quick demo must take the player directly to the existing Projectile Mission with demo mode enabled.
- Add UI state for profile dropdown, active menu/modal, sound placeholder, and animation preference.
- Side menu must open real panels/modals; Escape and outside-click close modal/dropdown.
- Make HUD values state-backed and island star count derived from progress.
