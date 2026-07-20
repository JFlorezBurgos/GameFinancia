import type { CityProgressInput, MilestoneRule } from '@/types'

export function evaluateMilestone(
  rule: MilestoneRule,
  input: CityProgressInput,
  progressPercent: number,
): boolean {
  switch (rule.type) {
    case 'always':
      return true
    case 'minProgress':
      return progressPercent >= rule.value
    case 'minCityXp':
      return input.cityXp >= rule.value
    case 'minLevel':
      return input.level >= rule.value
    case 'minSaved':
      return input.totalSaved >= rule.value
    case 'minStreak':
      return Math.max(input.currentStreak, input.longestStreak) >= rule.value
    case 'minMedals':
      return input.medalsUnlocked >= rule.value
    case 'minGoalsCompleted':
      return input.goalsCompleted >= rule.value
    case 'minIncomeCount':
      return input.incomeCount >= rule.value
    case 'minExpenseCount':
      return input.expenseCount >= rule.value
    case 'minBudgetClaims':
      return input.budgetRewardsClaimed >= rule.value
    case 'minActiveMonths':
      return input.activeMonths >= rule.value
    case 'and':
      return rule.rules.every((child) => evaluateMilestone(child, input, progressPercent))
    case 'or':
      return rule.rules.some((child) => evaluateMilestone(child, input, progressPercent))
    default:
      return false
  }
}

export function describeMilestone(rule: MilestoneRule): string {
  switch (rule.type) {
    case 'always':
      return 'Visible en el campo'
    case 'minProgress':
      return `Alcanza ${rule.value}% de prosperidad`
    case 'minCityXp':
      return `Acumula ${rule.value} XP de ciudad`
    case 'minLevel':
      return `Llega al nivel ${rule.value}`
    case 'minSaved':
      return 'Acumula ahorro en tus metas'
    case 'minStreak':
      return `Mantén una racha de ${rule.value} días`
    case 'minMedals':
      return `Desbloquea ${rule.value} medallas`
    case 'minGoalsCompleted':
      return `Completa ${rule.value} meta${rule.value === 1 ? '' : 's'}`
    case 'minIncomeCount':
      return `Registra ${rule.value} ingresos`
    case 'minExpenseCount':
      return `Registra ${rule.value} gastos`
    case 'minBudgetClaims':
      return 'Cumple tu presupuesto mensual'
    case 'minActiveMonths':
      return `Actividad en ${rule.value} meses`
    case 'and':
      return rule.rules.map(describeMilestone).join(' y ')
    case 'or':
      return rule.rules.map(describeMilestone).join(' o ')
    default:
      return 'Sigue progresando'
  }
}
