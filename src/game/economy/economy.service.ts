export const DEFAULT_CURRENCY = 'COP'
export const DEFAULT_LOCALE = 'es-CO'

export function calculateSavingsRate(income: number, expenses: number): number {
  if (income <= 0) return 0
  return Math.max(0, Math.round(((income - expenses) / income) * 100))
}

export function calculateBalance(income: number, expenses: number): number {
  return income - expenses
}
