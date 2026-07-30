import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import {
  calculateFixedExpenseSummary,
  filterFixedExpensesByMonth,
  sortFixedExpenses,
} from '@/game'
import { DexieFixedExpenseRepository } from '@/services/repositories'
import { useFinanceStore } from '@/stores/finance.store'
import type {
  CreateFixedExpenseInput,
  FixedExpense,
  UpdateFixedExpenseInput,
} from '@/types'
import { createId } from '@/utils/id'
import { getCurrentMonthKey } from '@/utils/format'

const repository = new DexieFixedExpenseRepository()

export const useFixedExpenseStore = defineStore('fixedExpenses', () => {
  const items = ref<FixedExpense[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const sortedItems = computed(() => sortFixedExpenses(items.value))

  function getForMonth(month: string): FixedExpense[] {
    return sortFixedExpenses(filterFixedExpensesByMonth(items.value, month))
  }

  function getSummaryForMonth(month: string) {
    return calculateFixedExpenseSummary(getForMonth(month))
  }

  const currentMonthSummary = computed(() => getSummaryForMonth(getCurrentMonthKey()))

  async function loadFixedExpenses(): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      items.value = await repository.getAll()
      await migrateLegacyFixedTransactions()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al cargar gastos fijos'
    } finally {
      isLoading.value = false
    }
  }

  // Migra cargos fijos que antes vivían como movimientos de gasto.
  async function migrateLegacyFixedTransactions(): Promise<void> {
    const financeStore = useFinanceStore()
    const legacy = financeStore.transactions.filter(
      (transaction) =>
        transaction.type === 'expense' &&
        (transaction.source === 'fixed-expense' || transaction.category === 'fixed'),
    )

    if (legacy.length === 0) return

    for (const transaction of legacy) {
      const expense: FixedExpense = {
        id: createId(),
        month: transaction.date.slice(0, 7),
        name: transaction.note?.trim() || 'Gasto fijo',
        amount: transaction.amount,
        paid: true,
        paidAt: transaction.createdAt,
        createdAt: transaction.createdAt,
      }
      await repository.save(expense)
      items.value = sortFixedExpenses([expense, ...items.value])
      await financeStore.deleteTransaction(transaction.id)
    }
  }

  async function createFixedExpense(
    month: string,
    input: CreateFixedExpenseInput,
  ): Promise<FixedExpense> {
    const amount = Number(input.amount)
    if (!input.name.trim()) throw new Error('Escribe un nombre para el gasto fijo')
    if (!amount || Number.isNaN(amount) || amount <= 0) {
      throw new Error('Ingresa un monto válido')
    }

    const expense: FixedExpense = {
      id: createId(),
      month,
      name: input.name.trim(),
      amount,
      paid: Boolean(input.paid),
      paidAt: input.paid ? Date.now() : undefined,
      createdAt: Date.now(),
    }

    await repository.save(expense)
    items.value = sortFixedExpenses([expense, ...items.value])
    return expense
  }

  async function updateFixedExpense(
    id: string,
    input: UpdateFixedExpenseInput,
  ): Promise<FixedExpense> {
    const existing = items.value.find((item) => item.id === id)
    if (!existing) throw new Error('Gasto fijo no encontrado')

    const amount = Number(input.amount)
    if (!input.name.trim()) throw new Error('Escribe un nombre para el gasto fijo')
    if (!amount || Number.isNaN(amount) || amount <= 0) {
      throw new Error('Ingresa un monto válido')
    }

    const updated: FixedExpense = {
      ...existing,
      name: input.name.trim(),
      amount,
    }

    await repository.save(updated)
    items.value = sortFixedExpenses(
      items.value.map((item) => (item.id === id ? updated : item)),
    )
    return updated
  }

  async function setPaid(id: string, paid: boolean): Promise<FixedExpense> {
    const existing = items.value.find((item) => item.id === id)
    if (!existing) throw new Error('Gasto fijo no encontrado')

    const updated: FixedExpense = {
      ...existing,
      paid,
      paidAt: paid ? (existing.paidAt ?? Date.now()) : undefined,
    }

    await repository.save(updated)
    items.value = sortFixedExpenses(
      items.value.map((item) => (item.id === id ? updated : item)),
    )
    return updated
  }

  async function deleteFixedExpense(id: string): Promise<void> {
    await repository.delete(id)
    items.value = items.value.filter((item) => item.id !== id)
  }

  return {
    items,
    isLoading,
    error,
    sortedItems,
    currentMonthSummary,
    getForMonth,
    getSummaryForMonth,
    loadFixedExpenses,
    createFixedExpense,
    updateFixedExpense,
    setPaid,
    deleteFixedExpense,
  }
})
