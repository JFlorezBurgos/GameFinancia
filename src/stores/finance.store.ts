import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import {
  calculateFinanceSummary,
  filterTransactionsByMonth,
  groupTransactionsByDate,
  sortTransactionsDesc,
} from '@/game'
import { DexieTransactionRepository } from '@/services/repositories'
import { useFixedExpenseStore } from '@/stores/fixed-expense.store'
import { useGoalsStore } from '@/stores/goals.store'
import type { CreateTransactionInput, Transaction, UpdateTransactionInput } from '@/types'
import { createId } from '@/utils/id'
import { getCurrentMonthKey, getTodayKey } from '@/utils/format'

const repository = new DexieTransactionRepository()

export const useFinanceStore = defineStore('finance', () => {
  const transactions = ref<Transaction[]>([])
  const selectedMonth = ref(getCurrentMonthKey())
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const monthTransactions = computed(() =>
    filterTransactionsByMonth(transactions.value, selectedMonth.value),
  )

  const monthSummary = computed(() => {
    const fixedStore = useFixedExpenseStore()
    return calculateFinanceSummary(
      monthTransactions.value,
      fixedStore.getForMonth(selectedMonth.value),
    )
  })

  const allTimeSummary = computed(() => {
    const fixedStore = useFixedExpenseStore()
    return calculateFinanceSummary(transactions.value, fixedStore.items)
  })

  const groupedTransactions = computed(() => groupTransactionsByDate(monthTransactions.value))

  const recentTransactions = computed(() => sortTransactionsDesc(transactions.value).slice(0, 5))

  const hasTransactions = computed(() => transactions.value.length > 0)

  async function loadTransactions(): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      transactions.value = await repository.getAll()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al cargar movimientos'
    } finally {
      isLoading.value = false
    }
  }

  async function createTransaction(input: CreateTransactionInput): Promise<Transaction> {
    const transaction: Transaction = {
      id: createId(),
      type: input.type,
      amount: input.amount,
      category: input.category,
      note: input.note?.trim() || undefined,
      date: input.date ?? getTodayKey(),
      createdAt: Date.now(),
      linkedGoalId: input.linkedGoalId,
      source: input.source ?? 'manual',
    }

    await repository.save(transaction)
    transactions.value = sortTransactionsDesc([transaction, ...transactions.value])
    return transaction
  }

  async function updateTransaction(
    id: string,
    input: UpdateTransactionInput,
  ): Promise<Transaction> {
    const existing = transactions.value.find((transaction) => transaction.id === id)

    if (!existing) {
      throw new Error('Movimiento no encontrado')
    }

    if (existing.source === 'goal-contribution') {
      throw new Error('Los aportes a metas se gestionan desde Metas')
    }

    const updated: Transaction = {
      ...existing,
      amount: input.amount,
      category: input.category,
      note: input.note?.trim() || undefined,
      date: input.date,
    }

    await repository.save(updated)
    transactions.value = sortTransactionsDesc(
      transactions.value.map((transaction) => (transaction.id === id ? updated : transaction)),
    )
    return updated
  }

  // Elimina el movimiento sin sincronizar metas (evita bucles al borrar una meta).
  async function removeTransactionRecord(id: string): Promise<Transaction | null> {
    const existing = transactions.value.find((transaction) => transaction.id === id) ?? null
    if (!existing) return null

    await repository.delete(id)
    transactions.value = transactions.value.filter((transaction) => transaction.id !== id)
    return existing
  }

  async function deleteTransaction(id: string): Promise<void> {
    const existing = await removeTransactionRecord(id)
    if (!existing) return

    // Si se borra un aporte, se revierte el monto en la meta para no descuadrar caja vs ahorro.
    if (existing.linkedGoalId && existing.source === 'goal-contribution') {
      const goalsStore = useGoalsStore()
      await goalsStore.reduceGoalAmount(existing.linkedGoalId, existing.amount)
    }
  }

  async function deleteTransactionsByGoalId(goalId: string): Promise<void> {
    const linkedIds = transactions.value
      .filter((transaction) => transaction.linkedGoalId === goalId)
      .map((transaction) => transaction.id)

    for (const id of linkedIds) {
      await removeTransactionRecord(id)
    }
  }

  function setSelectedMonth(monthKey: string): void {
    selectedMonth.value = monthKey
  }

  return {
    transactions,
    selectedMonth,
    isLoading,
    error,
    monthTransactions,
    monthSummary,
    allTimeSummary,
    groupedTransactions,
    recentTransactions,
    hasTransactions,
    loadTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    deleteTransactionsByGoalId,
    setSelectedMonth,
  }
})
