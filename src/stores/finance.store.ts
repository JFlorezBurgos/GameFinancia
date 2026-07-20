import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import {
  calculateFinanceSummary,
  filterTransactionsByMonth,
  groupTransactionsByDate,
  sortTransactionsDesc,
} from '@/game'
import { DexieTransactionRepository } from '@/services/repositories'
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

  const monthSummary = computed(() => calculateFinanceSummary(monthTransactions.value))

  const allTimeSummary = computed(() => calculateFinanceSummary(transactions.value))

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

  async function deleteTransaction(id: string): Promise<void> {
    await repository.delete(id)
    transactions.value = transactions.value.filter((transaction) => transaction.id !== id)
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
    setSelectedMonth,
  }
})
