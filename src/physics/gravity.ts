export type GravityMode = 'vacuum' | 'air'
export type GravityObjectKind = 'ball' | 'paper' | 'feather'

export type GravityBody = {
  id: string
  kind: GravityObjectKind
  x: number
  y: number
  vx: number
  vy: number
  mass: number
  radius: number
  area: number
  dragCoefficient: number
  held: boolean
}

export type GravityEnvironment = {
  mode: GravityMode
  g: number
  airDensity: number
  width: number
  height: number
  restitution: number
}

export const defaultGravityEnvironment: GravityEnvironment = {
  mode: 'vacuum',
  g: 9.81,
  airDensity: 1.225,
  width: 12,
  height: 7,
  restitution: 0.42,
}

export const gravityObjectDefaults: Record<GravityObjectKind, Pick<GravityBody, 'mass' | 'radius' | 'area' | 'dragCoefficient'>> = {
  ball: { mass: 1.2, radius: 0.34, area: 0.36, dragCoefficient: 0.47 },
  paper: { mass: 0.08, radius: 0.4, area: 0.22, dragCoefficient: 1.15 },
  feather: { mass: 0.02, radius: 0.36, area: 0.16, dragCoefficient: 1.3 },
}

export function createGravityBody(kind: GravityObjectKind, id: string, x = 3, y = 1): GravityBody {
  return { id, kind, x, y, vx: 0, vy: 0, held: false, ...gravityObjectDefaults[kind] }
}

export function clampGravity(value: number): number {
  return Math.max(1.6, Math.min(24.8, value))
}

export function clampMass(value: number): number {
  return Math.max(0.02, Math.min(20, value))
}

export function releaseGravityBody(body: GravityBody, vx = 0, vy = 0): GravityBody {
  return { ...body, held: false, vx, vy }
}

export function stepGravityBody(body: GravityBody, environment: GravityEnvironment, dt: number): GravityBody {
  if (body.held || dt <= 0) return body

  const safeDt = Math.min(dt, 1 / 30)
  const substepCount = Math.max(1, Math.ceil(safeDt / (1 / 240)))
  const substepDt = safeDt / substepCount
  const left = body.radius
  const right = environment.width - body.radius
  const floor = environment.height - body.radius
  const dragScale = environment.mode === 'air'
    ? (0.5 * environment.airDensity * body.dragCoefficient * body.area) / body.mass
    : 0
  let { x, y, vx, vy } = body

  for (let index = 0; index < substepCount; index += 1) {
    const ax = -dragScale * vx * Math.abs(vx)
    const ay = environment.g - dragScale * vy * Math.abs(vy)

    vx += ax * substepDt
    vy += ay * substepDt
    x += vx * substepDt
    y += vy * substepDt

    if (x < left || x > right) {
      x = Math.max(left, Math.min(right, x))
      vx *= -environment.restitution
    }
    if (y >= floor) {
      y = floor
      vy = Math.abs(vy) > 0.35 ? -Math.abs(vy) * environment.restitution : 0
      vx *= 0.88
    }
  }

  return { ...body, x, y, vx, vy }
}

export function simulateGravityBody(body: GravityBody, environment: GravityEnvironment, seconds: number, step = 1 / 120): GravityBody {
  let current = body
  for (let elapsed = 0; elapsed < seconds; elapsed += step) {
    current = stepGravityBody(current, environment, Math.min(step, seconds - elapsed))
  }
  return current
}
