<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import AppButton from '@/components/ui/AppButton.vue'
import AppCard from '@/components/ui/AppCard.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppIconButton from '@/components/ui/AppIconButton.vue'
import BudgetCard from '@/components/finance/BudgetCard.vue'
import FinanceSummaryCard from '@/components/finance/FinanceSummaryCard.vue'
import FixedExpensePreviewCard from '@/components/finance/FixedExpensePreviewCard.vue'
import TransactionForm from '@/components/finance/TransactionForm.vue'
import TransactionItem from '@/components/finance/TransactionItem.vue'
import { useFinanceFormat } from '@/composables/useFinanceFormat'
import { useGameEngine } from '@/composables/useGameEngine'
import { useBudgetStore } from '@/stores/budget.store'
import { useFinanceStore } from '@/stores/finance.store'
import { useFixedExpenseStore } from '@/stores/fixed-expense.store'
import type {
  BudgetCategoryLimit,
  CreateTransactionInput,
  Transaction,
  TransactionType,
} from '@/types'

const financeStore = useFinanceStore()
const budgetStore = useBudgetStore()
const fixedStore = useFixedExpenseStore()
const { rewardTransaction, rewardBudgetMet } = useGameEngine()
const {
  monthSummary,
  groupedTransactions,
  selectedMonth,
  monthTransactions,
  isLoading,
} = storeToRefs(financeStore)

const { month: formatMonth, date: formatDate } = useFinanceFormat()

const budgetStatus = computed(() => budgetStore.getStatusForMonth(selectedMonth.value))
const fixedSummary = computed(() => fixedStore.getSummaryForMonth(selectedMonth.value))
const monthLabel = computed(() => formatMonth(selectedMonth.value))

const formOpen = ref(false)
const formType = ref<TransactionType>('income')
const editingTransaction = ref<Transaction | null>(null)

function shiftMonth(delta: number): void {
  const [year, month] = selectedMonth.value.split('-').map(Number)
  const date = new Date(year!, month! - 1 + delta, 1)
  const nextYear = date.getFullYear()
  const nextMonth = String(date.getMonth() + 1).padStart(2, '0')
  financeStore.setSelectedMonth(`${nextYear}-${nextMonth}`)
}

function openCreate(type: TransactionType): void {
  editingTransaction.value = null
  formType.value = type
  formOpen.value = true
}

function openEdit(transaction: Transaction): void {
  editingTransaction.value = transaction
  formType.value = transaction.type
  formOpen.value = true
}

function closeForm(): void {
  formOpen.value = false
  editingTransaction.value = null
}

async function handleSubmit(input: CreateTransactionInput): Promise<void> {
  try {
    if (editingTransaction.value) {
      await financeStore.updateTransaction(editingTransaction.value.id, {
        amount: input.amount,
        category: input.category,
        note: input.note,
        date: input.date ?? editingTransaction.value.date,
      })
    } else {
      const created = await financeStore.createTransaction(input)
      await rewardTransaction(created.type)
    }
    closeForm()
  } catch (err) {
    window.alert(err instanceof Error ? err.message : 'No se pudo guardar el movimiento')
  }
}

async function handleDelete(id: string): Promise<void> {
  const confirmed = window.confirm('¿Eliminar este movimiento?')
  if (!confirmed) return
  await financeStore.deleteTransaction(id)
}

async function handleBudgetSave(categories: BudgetCategoryLimit[]): Promise<void> {
  try {
    await budgetStore.upsertBudget({
      month: selectedMonth.value,
      categories,
    })
  } catch (err) {
    window.alert(err instanceof Error ? err.message : 'No se pudo guardar el presupuesto')
  }
}

async function handleBudgetDelete(): Promise<void> {
  try {
    await budgetStore.deleteBudget(selectedMonth.value)
  } catch (err) {
    window.alert(err instanceof Error ? err.message : 'No se pudo eliminar el presupuesto')
  }
}

async function handleBudgetClaim(): Promise<void> {
  try {
    await budgetStore.claimBudgetReward(selectedMonth.value)
    await rewardBudgetMet()
  } catch (err) {
    window.alert(err instanceof Error ? err.message : 'No se pudo reclamar la recompensa')
  }
}
</script>

<template>
  <div class="space-y-5">
    <AppHeader
      title="Movimientos"
      subtitle="Registra ingresos y gastos de forma simple."
    />

    <div class="flex items-center justify-between gap-2">
      <AppIconButton aria-label="Mes anterior" @click="shiftMonth(-1)">‹</AppIconButton>
      <p class="text-sm font-semibold capitalize text-slate-200">{{ monthLabel }}</p>
      <AppIconButton aria-label="Mes siguiente" @click="shiftMonth(1)">›</AppIconButton>
    </div>

    <FinanceSummaryCard :summary="monthSummary" />

    <FixedExpensePreviewCard :summary="fixedSummary" :month-label="monthLabel" />

    <BudgetCard
      :status="budgetStatus"
      :month-label="monthLabel"
      @save="handleBudgetSave"
      @delete="handleBudgetDelete"
      @claim="handleBudgetClaim"
    />

    <div class="grid grid-cols-2 gap-3">
      <AppButton variant="primary" block @click="openCreate('income')">
        + Ingreso
      </AppButton>
      <AppButton variant="secondary" block @click="openCreate('expense')">
        − Gasto
      </AppButton>
    </div>

    <div v-if="isLoading" class="py-10 text-center text-sm text-slate-500">
      Cargando movimientos...
    </div>

    <div v-else-if="monthTransactions.length === 0" class="space-y-3">
      <AppCard padding="lg" class="text-center">
        <p class="text-4xl">📜</p>
        <p class="mt-3 font-semibold text-slate-200">Sin movimientos este mes</p>
        <p class="mt-1 text-sm text-slate-400">
          Añade tu primer ingreso o gasto para ver el resumen.
        </p>
      </AppCard>
    </div>

    <section v-else class="space-y-5">
      <div
        v-for="group in groupedTransactions"
        :key="group.date"
        class="space-y-2"
      >
        <h2 class="px-1 text-xs font-semibold uppercase tracking-widest text-slate-500">
          {{ formatDate(group.date) }}
        </h2>
        <TransactionItem
          v-for="transaction in group.transactions"
          :key="transaction.id"
          :transaction="transaction"
          @edit="openEdit"
          @delete="handleDelete"
        />
      </div>
    </section>

    <TransactionForm
      :open="formOpen"
      :type="formType"
      :transaction="editingTransaction"
      @close="closeForm"
      @submit="handleSubmit"
    />
  </div>
</template>
