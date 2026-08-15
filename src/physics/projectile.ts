export type Shot = { angle: number; speed: number; range: number; hit: boolean }

// These values mirror the coordinate transform and obstacle placement in GameScene.
const LAUNCH_X = 100
const HORIZONTAL_SCALE = 9
const VERTICAL_SCALE = 12
const WALL_X = 500
const WALL_TOP = 220
const TARGET_X = 680
const TARGET_RADIUS = 45
const PROJECTILE_RADIUS = 14
const GRAVITY = 9.8

export function simulateShot(angle: number, speed: number): Shot {
  const radians = (angle * Math.PI) / 180
  const range = Math.round((speed * speed * Math.sin(2 * radians)) / GRAVITY)
  const rawRange = (speed * speed * Math.sin(2 * radians)) / GRAVITY
  const horizontalWallDistance = (WALL_X - LAUNCH_X) / HORIZONTAL_SCALE
  const wallHeight = (300 - WALL_TOP - PROJECTILE_RADIUS) / VERTICAL_SCALE
  const heightAtWall = Math.tan(radians) * horizontalWallDistance
    - (GRAVITY * horizontalWallDistance ** 2) / (2 * speed ** 2 * Math.cos(radians) ** 2)
  const targetDistance = (TARGET_X - LAUNCH_X) / HORIZONTAL_SCALE
  const targetTolerance = (TARGET_RADIUS + PROJECTILE_RADIUS) / HORIZONTAL_SCALE
  const clearsWall = heightAtWall > wallHeight
  const hitsTarget = Math.abs(rawRange - targetDistance) <= targetTolerance

  return { angle, speed, range, hit: clearsWall && hitsTarget }
}
