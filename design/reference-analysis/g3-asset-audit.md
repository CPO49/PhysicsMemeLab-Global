# G.3 Generated Asset Audit

## G.2 assets (17 files)

| Group | Decision | Reason |
| --- | --- | --- |
| `generated/icons/*` | C — retired from visible G.3 UI | Flat generic outlines do not match the beveled game UI reference. Retained on disk only for backward compatibility/debug history. |
| `generated/ui/*` | C — retired from visible G.3 UI | Original profile and lock shapes are too flat for HUD/island use. |
| `generated/decor/tape.svg` | C — retired | No role in approved composition. |
| `generated/decor/ship-wheel.svg` | B — retained only as background decoration | Kept as an original decorative fallback, but no longer used as the dominant G.3 reference-styled asset. |
| `generated/decor/sticky-note.svg` | C — retired from visible G.3 UI | Replaced by `map/sticky-note-you-got-this.svg`. |

## G.3 replacement assets

All visible G.3 UI assets use navy outer strokes, layered gradients, cream/gold inner surfaces or blue highlights, and shadow-compatible geometry. They contain no Thai text; text values are HTML.

- **HUD:** energy, diamond, profile, avatar frames.
- **Menu:** default/active beveled buttons and four feature icons.
- **Landing:** primary/secondary action frames, control-card frame, and input/play icons.
- **Map:** navy label/progress frames, large lock, NEW/Coming Soon badge frames, sticky note.

No final raster scene asset was redrawn or replaced.
