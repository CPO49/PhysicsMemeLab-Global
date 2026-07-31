export const assets = {
  final: {
    landing: {
      background:
        '/assets/final/landing/landing_background_lab_notebook.png',
      logo: '/assets/final/landing_logo_meme_physics_lab_67_tight.png',
      mascot: '/assets/final/landing/landing_mascot_main.png',
    },
    worldMap: {
      background:
        '/assets/final/worldmap/worldmap_background_ocean_routes.png',
      islands: {
        projectile:
          '/assets/final/worldmap/island_01_projectile.png',
        momentum:
          '/assets/final/worldmap/island_02_locked_gate.png',
        friction:
          '/assets/final/worldmap/island_03_friction_road.png',
        energy:
          '/assets/final/worldmap/island_04_energy.png',
        mystery:
          '/assets/final/worldmap/island_05_secret.png',
        power67:
          '/assets/final/worldmap/island_06_power_67.png',
      },
    },
  },
  branding: {
    logo: '/assets/branding/logo-primary.webp',
    mascotHero: '/assets/branding/mascot-hero.webp',
    mascotAvatar: '/assets/branding/mascot-avatar.webp',
  },
  mascot: {
    hero: '/assets/branding/mascot-hero.webp',
    guide: '/assets/mascot/mascot-idle.webp',
    idle: '/assets/mascot/mascot-idle.webp',
    charge67: '/assets/mascot/mascot-charge67.webp',
    skillSign: '/assets/mascot/mascot-skill-sign.webp',
    aim: '/assets/mascot/mascot-aim.webp',
    fail: '/assets/mascot/mascot-fail.webp',
    win: '/assets/mascot/mascot-win.webp',
    think: '/assets/mascot/mascot-think.webp',
  },
  backgrounds: {
    landing: '/assets/backgrounds/landing-bg.webp',
    worldMap: '/assets/backgrounds/world-map-bg.webp',
    projectileHub: '/assets/backgrounds/projectile-hub-bg.webp',
    gameplayTexture: '/assets/backgrounds/gameplay-overlay-texture.webp',
  },
  islands: {
    momentum: '/assets/islands/island-momentum-locked.webp',
    balance: '/assets/islands/island-balance67-locked.webp',
    friction: '/assets/islands/island-friction-locked.webp',
    energy: '/assets/islands/island-energy-locked.webp',
    projectile: '/assets/islands/island-projectile.webp',
    momentumLocked: '/assets/islands/island-momentum-locked.webp',
    balance67Locked: '/assets/islands/island-balance67-locked.webp',
    frictionLocked: '/assets/islands/island-friction-locked.webp',
    energyLocked: '/assets/islands/island-energy-locked.webp',
  },
  decorations: {
    cloud: '/assets/decorations/cloud.webp',
    landingSticker: '/assets/decorations/sticker-landing-caption.webp',
    landingForeground: '/assets/decorations/landing-foreground.webp',
    boat: '/assets/decorations/boat.webp',
    lock: '/assets/ui/lock.svg',
    missionMarker: '/assets/ui/mission-marker.svg',
  },
  gameplay: {
    launcher: '/assets/gameplay/launcher.webp',
    projectileOrb: '/assets/gameplay/projectile-orb.webp',
    wallBlock: '/assets/gameplay/wall-block.webp',
    target: '/assets/gameplay/target.webp',
    trajectoryDot: '/assets/gameplay/trajectory-dot.webp',
    chargeEffect: '/assets/gameplay/effect-67-charge.webp',
    visionEffect: '/assets/gameplay/effect-skill-vision.webp',
  },
  ui: {
    energyFrame: '/assets/ui/energy-frame.svg',
    skillSlot: '/assets/ui/skill-slot.svg',
    lock: '/assets/ui/lock.svg',
    projectileBadge: '/assets/ui/badge-projectile-rookie.webp',
    bossPreview: '/assets/ui/card-boss-preview.webp',
    placeholder: '/assets/ui/illustration-placeholder.svg',
  },
} as const

export type AssetPath = string
