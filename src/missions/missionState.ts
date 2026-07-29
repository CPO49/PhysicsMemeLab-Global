import type { Shot } from '../physics/projectile'
export type MissionStep = 'brief'|'prediction'|'tutorial'|'shot1'|'charge'|'sign'|'shot2'|'compare'|'concept'|'summary'
export type MissionState = { step: MissionStep; prediction: string; attempts: Shot[]; concept: string }
export const initialMissionState: MissionState = { step: 'brief', prediction: '', attempts: [], concept: '' }
