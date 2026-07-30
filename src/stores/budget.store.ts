import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import {
  buildBudgetStatus,
  calculateBudgetTotalLimit,
  markBudgetRewardClaimed,
  normalizeBudgetPeriod,
} from '@/game'
import { DexieBudgetRepository } from '@/services/repositories'
import { useFinanceStore } from '@/stores/finance.store'
import type { BudgetPeriod, UpsertBudgetInput } from '@/types'
import { getCurrentMonthKey } from '@/utils/format'

const repository = new DexieBudgetRepository()

export const useBudgetStore = defineStore('budget', () => {
  const budgets = ref<BudgetPeriod[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const budgetByMonth = computed(() => {
    const map = new Map<string, BudgetPeriod>()
    for (const budget of budgets.value) {
      map.set(budget.month, normalizeBudgetPeriod(budget))
    }
    return map
  })

  function getBudgetForMonth(month: string): BudgetPeriod | null {
    return budgetByMonth.value.get(month) ?? null
  }

  function getMonthTransactions(month: string) {
    const financeStore = useFinanceStore()
    return financeStore.transactions.filter((transaction) => transaction.date.startsWith(month))
  }

  function getStatusForMonth(month: string) {
    return buildBudgetStatus(getBudgetForMonth(month), getMonthTransactions(month))
  }

  const currentMonthStatus = computed(() => getStatusForMonth(getCurrentMonthKey()))

  async function loadBudgets(): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      const loaded = await repository.getAll()
      budgets.value = loaded.map(normalizeBudgetPeriod)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al cargar presupuestos'
    } finally {
      isLoading.value = false
    }
  }

  async function upsertBudget(input: UpsertBudgetInput): Promise<BudgetPeriod> {
    const existing = getBudgetForMonth(input.month)
    const categories = input.categories.map((category) => ({
      categoryId: category.categoryId,
      limit: Math.max(0, category.limit),
    }))
    const limit = calculateBudgetTotalLimit(categories)

    if (limit <= 0) {
      throw new Error('Define al menos un límite mayor a 0')
    }

    const budget: BudgetPeriod = {
      id: input.month,
      month: input.month,
      limit,
      categories,
      rewardClaimedAt: existing?.rewardClaimedAt,
    }

    await repository.save(budget)
    const others = budgets.value.filter((item) => item.month !== input.month)
    budgets.value = [...others, budget]
    return budget
  }

  async function deleteBudget(month: string): Promise<void> {
    await repository.delete(month)
    budgets.value = budgets.value.filter((item) => item.month !== month)
  }

  async function claimBudgetReward(month: string): Promise<BudgetPeriod> {
    const status = getStatusForMonth(month)
    if (!status.budget) throw new Error('No hay presupuesto configurado')
    if (!status.canClaimReward) {
      throw new Error(
        status.budget.rewardClaimedAt
          ? 'Ya reclamaste esta recompensa'
          : 'Aún no cumples el presupuesto',
      )
    }

    const updated = markBudgetRewardClaimed(status.budget)
    await repository.save(updated)
    budgets.value = budgets.value.map((item) => (item.month === month ? updated : item))
    return updated
  }

  return {
    budgets,
    isLoading,
    error,
    currentMonthStatus,
    getBudgetForMonth,
    getStatusForMonth,
    loadBudgets,
    upsertBudget,
    deleteBudget,
    claimBudgetReward,
  }
})
