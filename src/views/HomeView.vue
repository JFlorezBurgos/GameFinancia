<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import AppButton from '@/components/ui/AppButton.vue'
import AppCard from '@/components/ui/AppCard.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppProgressBar from '@/components/ui/AppProgressBar.vue'
import BudgetCard from '@/components/finance/BudgetCard.vue'
import FinanceSummaryCard from '@/components/finance/FinanceSummaryCard.vue'
import KingdomDiorama from '@/components/kingdom/KingdomDiorama.vue'
import TransactionItem from '@/components/finance/TransactionItem.vue'
import { getGoalProgress } from '@/game'
import { useFinanceFormat } from '@/composables/useFinanceFormat'
import { useGameEngine } from '@/composables/useGameEngine'
import { useBudgetStore } from '@/stores/budget.store'
import { useFinanceStore } from '@/stores/finance.store'
import { useGoalsStore } from '@/stores/goals.store'
import { useKingdomStore } from '@/stores/kingdom.store'

const router = useRouter()
const financeStore = useFinanceStore()
const goalsStore = useGoalsStore()
const budgetStore = useBudgetStore()
const kingdomStore = useKingdomStore()
const { rewardBudgetMet } = useGameEngine()

const { monthSummary, recentTransactions, selectedMonth, hasTransactions } =
  storeToRefs(financeStore)
const { activeGoals } = storeToRefs(goalsStore)
const { snapshot } = storeToRefs(kingdomStore)

const { month: formatMonth, money } = useFinanceFormat()

const budgetStatus = computed(() => budgetStore.getStatusForMonth(selectedMonth.value))
const featuredGoals = computed(() => activeGoals.value.slice(0, 2))

async function confirmDelete(id: string): Promise<void> {
  if (!window.confirm('¿Eliminar este movimiento?')) return
  await financeStore.deleteTransaction(id)
}

async function handleBudgetSave(limit: number): Promise<void> {
  try {
    await budgetStore.upsertBudget({
      month: selectedMonth.value,
      limit,
    })
  } catch (err) {
    window.alert(err instanceof Error ? err.message : 'No se pudo guardar el presupuesto')
  }
}

async function handleBudgetClaim(): Promise<void> {
  try {
    await budgetStore.claimBudgetReward(selectedMonth.value)
    await rewardBudgetMet()
  } catch (err) {
    window.alert(err instanceof Error ? err.message : 'No se pudo registrar el logro')
  }
}
</script>

<template>
  <div class="space-y-5">
    <AppHeader title="Resumen" subtitle="Tus finanzas, claras y al día." />

    <FinanceSummaryCard
      :summary="monthSummary"
      :month-label="formatMonth(selectedMonth)"
    />

    <BudgetCard
      :status="budgetStatus"
      :month-label="formatMonth(selectedMonth)"
      @save="handleBudgetSave"
      @claim="handleBudgetClaim"
    />

    <div class="grid grid-cols-2 gap-3">
      <AppButton variant="primary" block @click="router.push('/movimientos')">
        + Ingreso
      </AppButton>
      <AppButton variant="secondary" block @click="router.push('/movimientos')">
        − Gasto
      </AppButton>
    </div>

    <section class="space-y-3">
      <div class="flex items-center justify-between px-1">
        <h2 class="text-sm font-semibold uppercase tracking-widest text-slate-400">
          Metas activas
        </h2>
        <button
          type="button"
          class="text-xs font-medium text-sky-400 hover:text-sky-300"
          @click="router.push('/metas')"
        >
          Ver todas
        </button>
      </div>

      <AppCard v-if="featuredGoals.length === 0" padding="md" class="text-center">
        <p class="text-sm text-slate-400">Define una meta de ahorro para empezar.</p>
        <AppButton class="mt-3" size="sm" variant="primary" @click="router.push('/metas')">
          Nueva meta
        </AppButton>
      </AppCard>

      <AppCard
        v-for="goal in featuredGoals"
        :key="goal.id"
        padding="md"
        interactive
        @click="router.push('/metas')"
      >
        <div class="flex items-center justify-between gap-2">
          <p class="truncate font-semibold text-slate-100">{{ goal.name }}</p>
          <span class="text-xs font-bold text-sky-400">
            {{ getGoalProgress(goal).progressPercent }}%
          </span>
        </div>
        <AppProgressBar
          class="mt-2"
          :value="getGoalProgress(goal).progressPercent"
          :max="100"
          color="gold"
        />
        <p class="mt-2 text-xs text-slate-500">
          {{ money(goal.currentAmount) }} / {{ money(goal.targetAmount) }}
        </p>
      </AppCard>
    </section>

    <section class="space-y-3">
      <div class="flex items-center justify-between px-1">
        <h2 class="text-sm font-semibold uppercase tracking-widest text-slate-400">
          Recientes
        </h2>
        <button
          v-if="hasTransactions"
          type="button"
          class="text-xs font-medium text-sky-400 hover:text-sky-300"
          @click="router.push('/movimientos')"
        >
          Ver todos
        </button>
      </div>

      <AppCard v-if="!hasTransactions" padding="lg" class="text-center">
        <p class="font-semibold text-slate-200">Sin movimientos aún</p>
        <p class="mt-1 text-sm text-slate-400">
          Registra un ingreso o gasto para ver tu balance.
        </p>
      </AppCard>

      <div v-else class="space-y-2">
        <TransactionItem
          v-for="transaction in recentTransactions"
          :key="transaction.id"
          :transaction="transaction"
          @edit="router.push('/movimientos')"
          @delete="confirmDelete"
        />
      </div>
    </section>

    <section class="space-y-2">
      <div class="flex items-center justify-between px-1">
        <h2 class="text-sm font-semibold uppercase tracking-widest text-slate-400">
          Mi Reino
        </h2>
        <button
          type="button"
          class="text-xs font-medium text-sky-400 hover:text-sky-300"
          @click="router.push('/ciudad')"
        >
          Ver reino
        </button>
      </div>
      <button type="button" class="w-full text-left" @click="router.push('/ciudad')">
        <KingdomDiorama :snapshot="snapshot" compact />
      </button>
      <p class="px-1 text-xs text-slate-500">
        {{ snapshot.currentStage.label }} — crece solo con tu patrimonio neto.
      </p>
    </section>
  </div>
</template>
