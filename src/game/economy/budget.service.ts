import {
  BUDGET_CATEGORIES,
  BUDGET_EXCLUDED_EXPENSE_CATEGORIES,
  getBudgetCategoryId,
} from './budget-categories.config'
import type {
  BudgetCategoryLimit,
  BudgetCategoryStatus,
  BudgetPeriod,
  BudgetStatus,
  Transaction,
} from '@/types'

export function calculateBudgetTotalLimit(categories: BudgetCategoryLimit[]): number {
  return categories.reduce((sum, category) => sum + Math.max(0, category.limit), 0)
}

/** Normaliza presupuestos antiguos (solo `limit` o categoría `fixed`) al auxilio actual. */
export function normalizeBudgetPeriod(budget: BudgetPeriod): BudgetPeriod {
  if (budget.categories?.length) {
    const validIds = new Set(BUDGET_CATEGORIES.map((category) => category.id))
    const merged = new Map<string, number>()

    for (const category of BUDGET_CATEGORIES) {
      merged.set(category.id, 0)
    }

    for (const category of budget.categories) {
      const limit = Math.max(0, category.limit)
      if (validIds.has(category.categoryId)) {
        merged.set(category.categoryId, (merged.get(category.categoryId) ?? 0) + limit)
      } else if (category.categoryId === 'fixed') {
        // Los fijos salieron del presupuesto; el tope viejo pasa a personales.
        merged.set('personal', (merged.get('personal') ?? 0) + limit)
      } else {
        merged.set('variable', (merged.get('variable') ?? 0) + limit)
      }
    }

    const categories: BudgetCategoryLimit[] = BUDGET_CATEGORIES.map((category) => ({
      categoryId: category.id,
      limit: merged.get(category.id) ?? 0,
    }))

    return {
      ...budget,
      categories,
      limit: calculateBudgetTotalLimit(categories),
    }
  }

  const categories: BudgetCategoryLimit[] = BUDGET_CATEGORIES.map((category) => ({
    categoryId: category.id,
    limit: category.id === 'variable' ? Math.max(0, budget.limit) : 0,
  }))

  return {
    ...budget,
    categories,
    limit: calculateBudgetTotalLimit(categories),
  }
}

export function buildDefaultBudgetCategories(totalLimit = 0): BudgetCategoryLimit[] {
  return BUDGET_CATEGORIES.map((category) => ({
    categoryId: category.id,
    limit: category.id === 'variable' ? Math.max(0, totalLimit) : 0,
  }))
}

export function sumBudgetRelevantExpenses(transactions: Transaction[]): number {
  return transactions
    .filter(
      (transaction) =>
        transaction.type === 'expense' &&
        !BUDGET_EXCLUDED_EXPENSE_CATEGORIES.has(transaction.category),
    )
    .reduce((sum, transaction) => sum + transaction.amount, 0)
}

export function sumExpensesByBudgetCategory(
  transactions: Transaction[],
): Record<string, number> {
  const spent: Record<string, number> = {}

  for (const transaction of transactions) {
    if (transaction.type !== 'expense') continue
    const budgetCategoryId = getBudgetCategoryId(transaction.category)
    if (!budgetCategoryId) continue
    spent[budgetCategoryId] = (spent[budgetCategoryId] ?? 0) + transaction.amount
  }

  return spent
}

function buildCategoryStatuses(
  categories: BudgetCategoryLimit[],
  spentByCategory: Record<string, number>,
): BudgetCategoryStatus[] {
  return categories.map((category) => {
    const spent = spentByCategory[category.categoryId] ?? 0
    const remaining = category.limit - spent
    const progressPercent =
      category.limit <= 0 ? (spent > 0 ? 100 : 0) : Math.min(100, Math.round((spent / category.limit) * 100))

    return {
      categoryId: category.categoryId,
      limit: category.limit,
      spent,
      remaining,
      progressPercent,
      isOverBudget: spent > category.limit,
    }
  })
}

export function buildBudgetStatus(
  budget: BudgetPeriod | null,
  monthTransactions: Transaction[],
): BudgetStatus {
  const normalized = budget ? normalizeBudgetPeriod(budget) : null
  const spent = sumBudgetRelevantExpenses(monthTransactions)
  const spentByCategory = sumExpensesByBudgetCategory(monthTransactions)
  const categories = normalized
    ? buildCategoryStatuses(normalized.categories, spentByCategory)
    : []

  if (!normalized || normalized.limit <= 0) {
    return {
      budget: normalized,
      spent,
      remaining: 0,
      progressPercent: 0,
      isOverBudget: false,
      isMet: false,
      canClaimReward: false,
      categories,
    }
  }

  const remaining = normalized.limit - spent
  const progressPercent = Math.min(100, Math.round((spent / normalized.limit) * 100))
  const isOverBudget = spent > normalized.limit
  const isMet = spent <= normalized.limit
  const canClaimReward = isMet && !normalized.rewardClaimedAt

  return {
    budget: normalized,
    spent,
    remaining,
    progressPercent,
    isOverBudget,
    isMet,
    canClaimReward,
    categories,
  }
}

export function markBudgetRewardClaimed(budget: BudgetPeriod): BudgetPeriod {
  return {
    ...normalizeBudgetPeriod(budget),
    rewardClaimedAt: Date.now(),
  }
}
