import { describe, expect, it } from 'vitest'
import { initialInputCapabilityState, resolveCameraFailure } from './inputCapabilityState'
describe('camera fallback policy', () => { it('falls back when denied', () => expect(resolveCameraFailure(initialInputCapabilityState, 'denied').inputMode).toBe('mouseKeyboard')); it('falls back when unavailable', () => expect(resolveCameraFailure(initialInputCapabilityState, 'unavailable').inputMode).toBe('mouseKeyboard')) })
