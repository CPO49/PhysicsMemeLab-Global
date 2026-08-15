import { describe, expect, it } from 'vitest'
import { electricQuestions, formatElectricCalculation, parseVoltage } from './electricMissionLogic'

describe('electric mission logic', () => {
  it('accepts a numeric voltage with an optional V suffix', () => {
    expect(parseVoltage('8')).toBe(8)
    expect(parseVoltage('8V')).toBe(8)
    expect(parseVoltage(' 8 v ')).toBe(8)
    expect(parseVoltage('8 volts')).toBeNull()
  })

  it('keeps every question consistent with V = I x R', () => {
    for (const question of electricQuestions) {
      expect(question.answer).toBe(question.current * question.resistance)
    }
  })

  it('formats the worked answer for failure feedback', () => {
    expect(formatElectricCalculation(electricQuestions[0])).toBe('V = 2 x 4 = 8V')
  })
})
