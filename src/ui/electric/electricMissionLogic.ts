export type ElectricQuestion = {
  resistance: number
  current: number
  answer: number
}

export const electricQuestions: readonly ElectricQuestion[] = [
  { resistance: 4, current: 2, answer: 8 },
  { resistance: 6, current: 3, answer: 18 },
  { resistance: 5, current: 4, answer: 20 },
]

export function parseVoltage(value: string): number | null {
  const match = value.trim().match(/^(\d+(?:\.\d+)?)\s*(?:v)?$/i)
  if (!match) return null
  const voltage = Number(match[1])
  return Number.isFinite(voltage) ? voltage : null
}

export function formatElectricCalculation(question: ElectricQuestion): string {
  return `V = ${question.current} x ${question.resistance} = ${question.answer}V`
}
