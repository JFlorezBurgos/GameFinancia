import { defineStore } from 'pinia'
import { computed } from 'vue'
import { kingdomEngine } from '@/game/kingdom'
import { useFinanceStore } from '@/stores/finance.store'
import { useGoalsStore } from '@/stores/goals.store'
import type { KingdomSnapshot } from '@/types/kingdom.types'

/**
 * Patrimonio = caja real (sin restar fijos pendientes) + ahorro en metas.
 * Los fijos pendientes solo reducen el disponible, no el patrimonio.
 */
export const useKingdomStore = defineStore('kingdom', () => {
  const financeStore = useFinanceStore()
  const goalsStore = useGoalsStore()

  const netWorth = computed(() => {
    const cashOnHand = financeStore.allTimeSummary.cashOnHand
    const savings = goalsStore.totalSaved
    return Math.max(0, cashOnHand + savings)
  })

  const snapshot = computed<KingdomSnapshot>(() =>
    kingdomEngine.buildSnapshot({ netWorth: netWorth.value }),
  )

  return {
    netWorth,
    snapshot,
  }
})
