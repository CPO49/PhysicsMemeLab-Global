export type AimInput = { angle: number; speed: number }

export function aimFromDrag(start: { x: number; y: number }, end: { x: number; y: number }): AimInput {
  const dx = Math.max(1, start.x - end.x)
  const dy = start.y - end.y
  const angle = Math.max(20, Math.min(70, Math.round((Math.atan2(dy, dx) * 180) / Math.PI)))
  const speed = Math.max(15, Math.min(35, Math.round(Math.hypot(dx, dy) / 7)))
  return { angle, speed }
}
