import type { CategoryDefinition } from './categories.config'

export type BudgetCategoryDefinition = CategoryDefinition

// Presupuesto del auxilio mensual (lo disponible después de fijos y metas).
export const BUDGET_CATEGORIES: BudgetCategoryDefinition[] = [
  { id: 'personal', label: 'Gastos personales', icon: '👤' },
  { id: 'food', label: 'Comida', icon: '🍽️' },
  { id: 'pet-food', label: 'Comida mascota', icon: '🐾' },
  { id: 'variable', label: 'Variables', icon: '🔀' },
]

export const BUDGET_CATEGORY_MAP = Object.fromEntries(
  BUDGET_CATEGORIES.map((category) => [category.id, category]),
) as Record<string, BudgetCategoryDefinition>

/** Salidas que no son consumo del auxilio: ahorro y fijos (viven aparte). */
export const BUDGET_EXCLUDED_EXPENSE_CATEGORIES = new Set(['savings', 'fixed'])

/**
 * Relaciona categorías de movimiento con el bucket del presupuesto.
 * Los fijos ya no entran al presupuesto de auxilio.
 */
export const EXPENSE_TO_BUDGET_CATEGORY: Record<string, string> = {
  personal: 'personal',
  shopping: 'personal',
  entertainment: 'personal',
  health: 'personal',
  education: 'personal',
  housing: 'personal',
  food: 'food',
  'pet-food': 'pet-food',
  variable: 'variable',
  transport: 'variable',
  'other-expense': 'variable',
}

export function getBudgetCategoryId(expenseCategoryId: string): string | null {
  if (BUDGET_EXCLUDED_EXPENSE_CATEGORIES.has(expenseCategoryId)) return null
  return EXPENSE_TO_BUDGET_CATEGORY[expenseCategoryId] ?? 'variable'
}

export function getBudgetCategoryLabel(categoryId: string): string {
  return BUDGET_CATEGORY_MAP[categoryId]?.label ?? categoryId
}

export function getBudgetCategoryIcon(categoryId: string): string {
  return BUDGET_CATEGORY_MAP[categoryId]?.icon ?? '📋'
}
