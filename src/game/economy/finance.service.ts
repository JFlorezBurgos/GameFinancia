import type { FinanceSummary, Transaction } from '@/types'
import { calculateBalance, calculateSavingsRate } from './economy.service'

export function calculateFinanceSummary(transactions: Transaction[]): FinanceSummary {
  const totalIncome = transactions
    .filter((transaction) => transaction.type === 'income')
    .reduce((sum, transaction) => sum + transaction.amount, 0)

  const totalExpenses = transactions
    .filter((transaction) => transaction.type === 'expense')
    .reduce((sum, transaction) => sum + transaction.amount, 0)

  return {
    totalIncome,
    totalExpenses,
    balance: calculateBalance(totalIncome, totalExpenses),
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
