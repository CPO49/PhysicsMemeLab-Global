export type Shot = { angle: number; speed: number; range: number; hit: boolean }
export function simulateShot(angle: number, speed: number): Shot {
  const radians = (angle * Math.PI) / 180
  const range = Math.round((speed * speed * Math.sin(2 * radians)) / 9.8)
  return { angle, speed, range, hit: range >= 40 && range <= 70 }
}
