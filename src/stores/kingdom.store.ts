import { defineStore } from 'pinia'
import { computed } from 'vue'
import { kingdomEngine } from '@/game/kingdom'
import { useFinanceStore } from '@/stores/finance.store'
import { useGoalsStore } from '@/stores/goals.store'
import type { KingdomSnapshot } from '@/types/kingdom.types'

/**
 * Patrimonio neto visual = balance de movimientos + ahorro en metas.
 * Si baja, el reino retrocede a una etapa anterior.
 */
export const useKingdomStore = defineStore('kingdom', () => {
  const financeStore = useFinanceStore()
  const goalsStore = useGoalsStore()

  const netWorth = computed(() => {
    const cashBalance = financeStore.allTimeSummary.balance
    const savings = goalsStore.totalSaved
    return Math.max(0, cashBalance + savings)
  })

  const snapshot = computed<KingdomSnapshot>(() =>
    kingdomEngine.buildSnapshot({ netWorth: netWorth.value }),
  )

  return {
    netWorth,
    snapshot,
  }
})
