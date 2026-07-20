import type { BudgetPeriod, BudgetStatus } from '@/types'

export function buildBudgetStatus(budget: BudgetPeriod | null, spent: number): BudgetStatus {
  if (!budget || budget.limit <= 0) {
    return {
      budget,
      spent,
      remaining: 0,
      progressPercent: 0,
      isOverBudget: false,
      isMet: false,
      canClaimReward: false,
    }
  }

  const remaining = budget.limit - spent
  const progressPercent = Math.min(100, Math.round((spent / budget.limit) * 100))
  const isOverBudget = spent > budget.limit
  const isMet = spent <= budget.limit
  const canClaimReward = isMet && !budget.rewardClaimedAt

  return {
    budget,
    spent,
    remaining,
    progressPercent,
    isOverBudget,
    isMet,
    canClaimReward,
  }
}

export function markBudgetRewardClaimed(budget: BudgetPeriod): BudgetPeriod {
  return {
    ...budget,
    rewardClaimedAt: Date.now(),
  }
}
