import type { GoalProgress, SavingsGoal } from '@/types'

export function getGoalProgress(goal: SavingsGoal): GoalProgress {
  const progressPercent =
    goal.targetAmount <= 0
      ? 0
      : Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100))

  return {
    goal,
    progressPercent,
    remaining: Math.max(0, goal.targetAmount - goal.currentAmount),
    isCompleted: Boolean(goal.completedAt) || goal.currentAmount >= goal.targetAmount,
  }
}

export function sortGoals(goals: SavingsGoal[]): SavingsGoal[] {
  return [...goals].sort((a, b) => {
    const aDone = Boolean(a.completedAt)
    const bDone = Boolean(b.completedAt)
    if (aDone !== bDone) return aDone ? 1 : -1
    return b.createdAt - a.createdAt
  })
}

export function applyGoalContribution(
  goal: SavingsGoal,
  amount: number,
): { goal: SavingsGoal; justCompleted: boolean } {
  if (amount <= 0) {
    throw new Error('El aporte debe ser mayor a 0')
  }

  if (goal.completedAt) {
    throw new Error('Esta meta ya está completada')
  }

  const currentAmount = goal.currentAmount + amount
  const justCompleted = currentAmount >= goal.targetAmount

  return {
    goal: {
      ...goal,
      currentAmount: Math.min(currentAmount, goal.targetAmount),
      completedAt: justCompleted ? Date.now() : undefined,
    },
    justCompleted,
  }
}

export function calculateTotalSavings(goals: SavingsGoal[]): number {
  return goals.reduce((sum, goal) => sum + goal.currentAmount, 0)
}

export function calculateTotalGoalTargets(goals: SavingsGoal[]): number {
  return goals.reduce((sum, goal) => sum + goal.targetAmount, 0)
}
