import type { FinanceSummary, FixedExpense, Transaction } from '@/types'
import { BUDGET_EXCLUDED_EXPENSE_CATEGORIES } from './budget-categories.config'
import { calculateBalance, calculateSavingsRate } from './economy.service'
import { calculateFixedExpenseSummary } from './fixed-expense.service'

function isSavingsOutflow(transaction: Transaction): boolean {
  return transaction.type === 'expense' && transaction.category === 'savings'
}

function isLegacyFixedOutflow(transaction: Transaction): boolean {
  return (
    transaction.type === 'expense' &&
    (transaction.category === 'fixed' || transaction.source === 'fixed-expense')
  )
}

function isDiscretionaryExpense(transaction: Transaction): boolean {
  return (
    transaction.type === 'expense' &&
    !BUDGET_EXCLUDED_EXPENSE_CATEGORIES.has(transaction.category) &&
    transaction.source !== 'fixed-expense'
  )
}

export function calculateFinanceSummary(
  transactions: Transaction[],
  fixedExpenses: FixedExpense[] = [],
): FinanceSummary {
  const totalIncome = transactions
    .filter((transaction) => transaction.type === 'income')
    .reduce((sum, transaction) => sum + transaction.amount, 0)

  const totalExpenses = transactions
    .filter(isDiscretionaryExpense)
    .reduce((sum, transaction) => sum + transaction.amount, 0)

  const savingsOutflow = transactions
    .filter(isSavingsOutflow)
    .reduce((sum, transaction) => sum + transaction.amount, 0)

  // Movimientos viejos de fijo (antes de la entidad dedicada), por si no migraron aún.
  const legacyFixedOutflow = transactions
    .filter(isLegacyFixedOutflow)
    .reduce((sum, transaction) => sum + transaction.amount, 0)

  const fixedSummary = calculateFixedExpenseSummary(fixedExpenses)
  const fixedTotal = fixedSummary.total + legacyFixedOutflow
  const fixedPaid = fixedSummary.paid + legacyFixedOutflow
  const fixedPending = fixedSummary.pending

  const cashOnHand = calculateBalance(
    totalIncome,
    totalExpenses + savingsOutflow + fixedPaid,
  )
  // Disponible = lo que queda para el auxilio; los fijos (pagados o no) no se tocan.
  const balance = calculateBalance(
    totalIncome,
    totalExpenses + savingsOutflow + fixedTotal,
  )

  return {
    totalIncome,
    totalExpenses,
    balance,
    cashOnHand,
    fixedTotal,
    fixedPaid,
    fixedPending,
    savingsRate: calculateSavingsRate(totalIncome, totalExpenses),
  }
}

export function filterTransactionsByMonth(
  transactions: Transaction[],
  monthKey: string,
): Transaction[] {
  return transactions.filter((transaction) => transaction.date.startsWith(monthKey))
}

export function sortTransactionsDesc(transactions: Transaction[]): Transaction[] {
  return [...transactions].sort((a, b) => {
    const dateCompare = b.date.localeCompare(a.date)
    if (dateCompare !== 0) return dateCompare
    return b.createdAt - a.createdAt
  })
}

export interface TransactionGroup {
  date: string
  transactions: Transaction[]
}

export function groupTransactionsByDate(transactions: Transaction[]): TransactionGroup[] {
  const sorted = sortTransactionsDesc(transactions)
  const groups = new Map<string, Transaction[]>()

  for (const transaction of sorted) {
    const existing = groups.get(transaction.date) ?? []
    existing.push(transaction)
    groups.set(transaction.date, existing)
  }

  return Array.from(groups.entries()).map(([date, groupedTransactions]) => ({
    date,
    transactions: groupedTransactions,
  }))
}
