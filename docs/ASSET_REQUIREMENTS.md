# Asset Requirements — Bright Meme Physics Archipelago

All listed artwork must be original or properly licensed. Prefer transparent WebP for illustrated characters, islands and decorations; use PNG when alpha-edge quality requires it. The bundled `illustration-placeholder.svg` is development-only and is not an approved final visual.

## Branding

| File | Recommended size / ratio | Transparency | Placement |
| --- | --- | --- | --- |
| `branding/logo-archipelago.webp` | 640 × 220, ~2.9:1 | Yes | Landing top-left; optional compact map header variant |

## Landing layers

| File | Recommended size / ratio | Transparency | Placement |
| --- | --- | --- | --- |
| `backgrounds/landing-ocean-sky.webp` | 2560 × 1440, 16:9 | No | Full hero background, ocean/sky/terrain only |
| `mascot/mascot-welcome.webp` | 1200 × 1200, 1:1 | Yes | Foreground hero mascot |
| `decorations/sticker-landing-caption.webp` | 720 × 360, 2:1 | Yes | Meme caption sticker near mascot |
| `decorations/landing-foreground.webp` | 2560 × 1440, 16:9 | Yes | Foreground terrain, paper scraps, doodles; must not contain text |
| `decorations/cloud.webp` | 600 × 280, ~2.1:1 | Yes | Reusable cloud layer at several scales |

## World map layers

| File | Recommended size / ratio | Transparency | Placement |
| --- | --- | --- | --- |
| `backgrounds/world-map-ocean.webp` | 2560 × 1440, 16:9 | No | Full ocean/map background without islands/labels |
| `islands/projectile-island-active.webp` | 900 × 700, ~1.3:1 | Yes | Playable island; hover and active state via CSS effects |
| `islands/momentum-island-locked.webp` | 760 × 600, ~1.3:1 | Yes | Locked preview island |
| `islands/balance-67-island-locked.webp` | 760 × 600, ~1.3:1 | Yes | Locked preview island |
| `islands/friction-island-locked.webp` | 760 × 600, ~1.3:1 | Yes | Locked preview island |
| `islands/energy-island-locked.webp` | 760 × 600, ~1.3:1 | Yes | Locked preview island |
| `decorations/boat.webp` | 360 × 280, ~1.3:1 | Yes | Map route boat |
| `decorations/lock.webp` | 160 × 190, ~0.8:1 | Yes | Locked-island state marker |
| `decorations/mission-marker.webp` | 260 × 260, 1:1 | Yes | Active/completed mission marker |

## Mascot and UI variants for later milestones

| File | Recommended size / ratio | Transparency | Placement |
| --- | --- | --- | --- |
| `mascot/mascot-guide.webp` | 900 × 900, 1:1 | Yes | Projectile Island Hub guidance |
| `mascot/mascot-thinking.webp` | 900 × 900, 1:1 | Yes | Prediction screen |
| `mascot/mascot-aiming.webp` | 900 × 900, 1:1 | Yes | Gameplay feedback outside aiming field |
| `mascot/mascot-success.webp` | 900 × 900, 1:1 | Yes | Summary/reward reaction |

## Integration notes

- Keep text, route paths, island labels and accessibility labels in HTML, not baked into artwork.
- Use a 2–6% transparent padding around cutout assets to avoid clipping shadows on small screens.
- Optimize WebP assets for the displayed size; aim for under 350 KB per standard island and under 700 KB per full-screen background.
- The map route remains inline SVG so its motion and contrast stay responsive.
