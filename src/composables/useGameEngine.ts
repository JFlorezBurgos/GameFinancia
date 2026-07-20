import {
  countActiveMonths,
  transactionTypeToEvent,
  type AchievementContext,
} from '@/game'
import { useBudgetStore } from '@/stores/budget.store'
import { useFeedbackStore } from '@/stores/feedback.store'
import { useFinanceStore } from '@/stores/finance.store'
import { useGoalsStore } from '@/stores/goals.store'
import { useMedalsStore } from '@/stores/medals.store'
import { usePlayerStore } from '@/stores/player.store'
import type { GameEventType, TransactionType } from '@/types'

export function useGameEngine() {
  const playerStore = usePlayerStore()
  const feedbackStore = useFeedbackStore()
  const medalsStore = useMedalsStore()
  const financeStore = useFinanceStore()
  const goalsStore = useGoalsStore()
  const budgetStore = useBudgetStore()

  function buildAchievementContext(): AchievementContext {
    const transactions = financeStore.transactions
    const goals = goalsStore.goals

    return {
      incomeCount: transactions.filter((item) => item.type === 'income').length,
      expenseCount: transactions.filter((item) => item.type === 'expense').length,
      totalSaved: goalsStore.totalSaved,
      goalsCreated: goals.length,
      goalsCompleted: goals.filter((goal) => Boolean(goal.completedAt)).length,
      hasGoalContribution: goals.some((goal) => goal.currentAmount > 0),
      currentStreak: playerStore.profile.currentStreak,
      longestStreak: playerStore.profile.longestStreak,
      activeMonths: countActiveMonths(transactions.map((item) => item.date)),
      level: playerStore.levelProgress.level,
      budgetRewardsClaimed: budgetStore.budgets.filter((item) => Boolean(item.rewardClaimedAt))
        .length,
    }
  }

  async function evaluateAchievements(): Promise<void> {
    const newlyUnlocked = await medalsStore.evaluateAndUnlock(buildAchievementContext())
    for (const medal of newlyUnlocked) {
      feedbackStore.showMedal(medal)
    }
  }

  async function dispatch(event: GameEventType, options?: { trackActivity?: boolean }) {
    const trackActivity = options?.trackActivity ?? true

    if (trackActivity) {
      const streak = await playerStore.recordDailyActivity()
      if (streak.shouldRewardStreak) {
        const streakReward = await playerStore.applyGameEvent('streak.maintained')
        feedbackStore.showReward(streakReward)
      }
    }

    const reward = await playerStore.applyGameEvent(event)
    feedbackStore.showReward(reward)
    await evaluateAchievements()
    return reward
  }

  async function rewardTransaction(type: TransactionType) {
    return dispatch(transactionTypeToEvent(type))
  }

  async function rewardGoalCompleted() {
    return dispatch('goal.completed')
  }

  async function rewardBudgetMet() {
    return dispatch('budget.met')
  }

  async function notifyActivity(): Promise<void> {
    const streak = await playerStore.recordDailyActivity()
    if (streak.shouldRewardStreak) {
      const streakReward = await playerStore.applyGameEvent('streak.maintained')
      feedbackStore.showReward(streakReward)
    }
    await evaluateAchievements()
  }

  async function syncAchievements(): Promise<void> {
    await evaluateAchievements()
  }

  return {
    dispatch,
    rewardTransaction,
    rewardGoalCompleted,
    rewardBudgetMet,
    notifyActivity,
    syncAchievements,
    buildAchievementContext,
  }
}
