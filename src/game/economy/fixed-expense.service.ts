import type { FixedExpense, FixedExpenseSummary } from '@/types'

export function calculateFixedExpenseSummary(items: FixedExpense[]): FixedExpenseSummary {
  let total = 0
  let paid = 0
  let pending = 0
  let paidCount = 0
  let pendingCount = 0

  for (const item of items) {
    total += item.amount
    if (item.paid) {
      paid += item.amount
      paidCount += 1
    } else {
      pending += item.amount
      pendingCount += 1
    }
  }

  return {
    total,
    paid,
    pending,
    count: items.length,
    paidCount,
    pendingCount,
  }
}

export function sortFixedExpenses(items: FixedExpense[]): FixedExpense[] {
  return [...items].sort((a, b) => {
    if (a.paid !== b.paid) return a.paid ? 1 : -1
    return b.createdAt - a.createdAt
  })
}

export function filterFixedExpensesByMonth(
  items: FixedExpense[],
  month: string,
): FixedExpense[] {
  return items.filter((item) => item.month === month)
}
