import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { buildBudgetStatus, markBudgetRewardClaimed } from '@/game'
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
      map.set(budget.month, budget)
    }
    return map
  })

  function getBudgetForMonth(month: string): BudgetPeriod | null {
    return budgetByMonth.value.get(month) ?? null
  }

  function getStatusForMonth(month: string) {
    const financeStore = useFinanceStore()
    const spent = financeStore.transactions
      .filter((t) => t.type === 'expense' && t.date.startsWith(month))
      .reduce((sum, t) => sum + t.amount, 0)

    return buildBudgetStatus(getBudgetForMonth(month), spent)
  }

  const currentMonthStatus = computed(() => getStatusForMonth(getCurrentMonthKey()))

  async function loadBudgets(): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      budgets.value = await repository.getAll()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al cargar presupuestos'
    } finally {
      isLoading.value = false
    }
  }

  async function upsertBudget(input: UpsertBudgetInput): Promise<BudgetPeriod> {
    const existing = getBudgetForMonth(input.month)
    const budget: BudgetPeriod = {
      id: input.month,
      month: input.month,
      limit: input.limit,
      rewardClaimedAt: existing?.rewardClaimedAt,
    }

    await repository.save(budget)
    const others = budgets.value.filter((item) => item.month !== input.month)
    budgets.value = [...others, budget]
    return budget
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
    claimBudgetReward,
  }
})
