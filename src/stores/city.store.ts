import { defineStore } from 'pinia'
import { computed } from 'vue'
import {
  calculateCityXpFromBalance,
  cityProgressEngine,
  countActiveMonths,
} from '@/game'
import { useBudgetStore } from '@/stores/budget.store'
import { useFinanceStore } from '@/stores/finance.store'
import { useGoalsStore } from '@/stores/goals.store'
import { useMedalsStore } from '@/stores/medals.store'
import { usePlayerStore } from '@/stores/player.store'
import type { CityProgressInput, CitySnapshot } from '@/types'

export const useCityStore = defineStore('city', () => {
  const financeStore = useFinanceStore()
  const goalsStore = useGoalsStore()
  const playerStore = usePlayerStore()
  const medalsStore = useMedalsStore()
  const budgetStore = useBudgetStore()

  const balance = computed(() => financeStore.allTimeSummary.balance)

  const cityXp = computed(() => calculateCityXpFromBalance(balance.value))

  const progressInput = computed<CityProgressInput>(() => {
    const transactions = financeStore.transactions
    const summary = financeStore.allTimeSummary

    return {
      balance: summary.balance,
      cityXp: calculateCityXpFromBalance(summary.balance),
      totalIncome: summary.totalIncome,
      totalExpenses: summary.totalExpenses,
      totalSaved: goalsStore.totalSaved,
      totalGoalTargets: goalsStore.totalTargets,
      goalsCompleted: goalsStore.completedGoals.length,
      incomeCount: transactions.filter((item) => item.type === 'income').length,
      expenseCount: transactions.filter((item) => item.type === 'expense').length,
      currentStreak: playerStore.profile.currentStreak,
      longestStreak: playerStore.profile.longestStreak,
      level: playerStore.levelProgress.level,
      medalsUnlocked: medalsStore.unlockedCount,
      budgetRewardsClaimed: budgetStore.budgets.filter((item) => Boolean(item.rewardClaimedAt))
        .length,
      activeMonths: countActiveMonths(transactions.map((item) => item.date)),
    }
  })

  const snapshot = computed<CitySnapshot>(() =>
    cityProgressEngine.buildSnapshot(progressInput.value),
  )

  return {
    balance,
    cityXp,
    progressInput,
    snapshot,
  }
})
