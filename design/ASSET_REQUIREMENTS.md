# Asset Requirements

## Art Direction
- Bright cartoon browser game
- Meme Physics Archipelago
- thick navy outline
- bright ocean blue, cream paper, meme yellow, coral red
- playful sticker silhouette
- no dark sci-fi dashboard
- original characters only

## Color Palette
- Navy: #123B5D
- Ocean: #63BDE8
- Deep Ocean: #2D8BCB
- Cream: #FFF4DA
- Yellow 67: #FFC928
- Coral: #F45B51
- Green: #66C56C
- Electric Skill Blue: #43D6FF

## Export Rules
- transparent PNG/WebP for isolated assets
- sRGB
- no baked UI text unless unavoidable
- keep 12–16% empty padding
- shadows soft and consistent
- transparent assets must not include white matte

## Required MVP Assets

### Branding
- logo-primary.webp — 1200×600, transparent
- mascot-hero.webp — 1400×1400, transparent
- mascot-avatar.webp — 512×512, transparent

### Mascot reactions
Each 768×768 transparent:
- mascot-idle.webp
- mascot-charge67.webp
- mascot-skill-sign.webp
- mascot-aim.webp
- mascot-fail.webp
- mascot-win.webp
- mascot-think.webp

### Backgrounds
- landing-bg.webp — 1920×1080
- world-map-bg.webp — 1920×1080
- projectile-hub-bg.webp — 1920×1080
- gameplay-overlay-texture.webp — 1920×1080, mostly transparent

### Islands
Each 900×700 transparent:
- island-projectile.webp
- island-momentum-locked.webp
- island-balance67-locked.webp
- island-friction-locked.webp
- island-energy-locked.webp

### Gameplay
- launcher.webp — 600×900 transparent
- projectile-orb.webp — 256×256 transparent
- wall-block.webp — 256×256 transparent
- target.webp — 512×512 transparent
- trajectory-dot.webp — 64×64 transparent
- effect-67-charge.webp — 1024×1024 transparent
- effect-skill-vision.webp — 1024×1024 transparent

### UI
- energy-frame.svg — scalable
- skill-slot.svg — scalable
- lock.svg — scalable
- badge-projectile-rookie.webp — 512×512 transparent
- card-boss-preview.webp — 900×1200

## Layout Contract
- Asset paths come from asset-manifest.json
- CSS handles position, scale, hover, responsive and animation only
- Do not redraw islands or mascot with CSS primitives
