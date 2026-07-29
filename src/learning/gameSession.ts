export type GestureMode = 'idle' | 'grabbed' | 'aiming' | 'released' | 'pumping' | 'skill-sign'
export type SkillState = 'locked' | 'ready' | 'sign-step-1' | 'active'

export type GameSession = {
  energy: number
  skill: SkillState
  gestureMode: GestureMode
  predictionAnswer: string | null
  attempts: number
}

export const initialGameSession: GameSession = { energy: 0, skill: 'locked', gestureMode: 'idle', predictionAnswer: null, attempts: 0 }

export function addPump(session: GameSession, amount = 10): GameSession {
  const energy = Math.min(100, session.energy + amount)
  return { ...session, energy, skill: energy === 100 ? 'ready' : session.skill }
}

export function startSkillSign(session: GameSession): GameSession {
  return session.skill === 'ready' ? { ...session, skill: 'sign-step-1', gestureMode: 'skill-sign' } : session
}

export function activateTrajectoryVision(session: GameSession): GameSession {
  return session.skill === 'sign-step-1' ? { ...session, energy: 0, skill: 'active' } : session
}
