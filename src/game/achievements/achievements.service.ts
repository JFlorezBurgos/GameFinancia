import { MEDALS } from './achievements.config'
import type { MedalDefinition } from '@/types'

export interface AchievementContext {
  incomeCount: number
  expenseCount: number
  totalSaved: number
  goalsCreated: number
  goalsCompleted: number
  hasGoalContribution: boolean
  currentStreak: number
  longestStreak: number
  activeMonths: number
  level: number
  budgetRewardsClaimed: number
}

type ConditionChecker = (context: AchievementContext) => boolean

const CONDITION_CHECKERS: Record<string, ConditionChecker> = {
  first_income: (ctx) => ctx.incomeCount >= 1,
  first_expense: (ctx) => ctx.expenseCount >= 1,
  first_savings: (ctx) => ctx.hasGoalContribution || ctx.totalSaved > 0,
  first_goal: (ctx) => ctx.goalsCreated >= 1,
  streak_3_days: (ctx) => ctx.longestStreak >= 3 || ctx.currentStreak >= 3,
  streak_7_days: (ctx) => ctx.longestStreak >= 7 || ctx.currentStreak >= 7,
  streak_30_days: (ctx) => ctx.longestStreak >= 30 || ctx.currentStreak >= 30,
  goal_completed: (ctx) => ctx.goalsCompleted >= 1,
  level_5: (ctx) => ctx.level >= 5,
  million_saved: (ctx) => ctx.totalSaved >= 1_000_000,
  discipline_12_months: (ctx) => ctx.activeMonths >= 12,
  budget_claimed: (ctx) => ctx.budgetRewardsClaimed >= 1,
}

export function isMedalConditionMet(
  conditionKey: string,
  context: AchievementContext,
): boolean {
  return CONDITION_CHECKERS[conditionKey]?.(context) ?? false
}

export function evaluateUnlockedMedals(
  context: AchievementContext,
  alreadyUnlockedIds: string[],
): MedalDefinition[] {
  const unlocked = new Set(alreadyUnlockedIds)

  return MEDALS.filter((medal) => {
    if (unlocked.has(medal.id)) return false
    return isMedalConditionMet(medal.conditionKey, context)
  })
}

export function countActiveMonths(dates: string[]): number {
  const months = new Set(dates.map((date) => date.slice(0, 7)))
  return months.size
}
