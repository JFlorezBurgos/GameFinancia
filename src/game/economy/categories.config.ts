import type { TransactionType } from '@/types'

export interface CategoryDefinition {
  id: string
  label: string
  icon: string
}

export const INCOME_CATEGORIES: CategoryDefinition[] = [
  { id: 'salary', label: 'Salario', icon: '💼' },
  { id: 'freelance', label: 'Freelance', icon: '🛠️' },
  { id: 'investment', label: 'Inversiones', icon: '📈' },
  { id: 'gift', label: 'Regalo', icon: '🎁' },
  { id: 'other-income', label: 'Otro', icon: '💰' },
]

export const EXPENSE_CATEGORIES: CategoryDefinition[] = [
  { id: 'personal', label: 'Personal', icon: '👤' },
  { id: 'food', label: 'Comida', icon: '🍽️' },
  { id: 'pet-food', label: 'Comida mascota', icon: '🐾' },
  { id: 'variable', label: 'Variable', icon: '🔀' },
  { id: 'transport', label: 'Transporte', icon: '🚌' },
  { id: 'housing', label: 'Vivienda', icon: '🏠' },
  { id: 'entertainment', label: 'Entretenimiento', icon: '🎮' },
  { id: 'health', label: 'Salud', icon: '💊' },
  { id: 'education', label: 'Educación', icon: '📚' },
  { id: 'shopping', label: 'Compras', icon: '🛍️' },
  { id: 'other-expense', label: 'Otro', icon: '💸' },
  // Solo lo crea el sistema al aportar a una meta; no se elige a mano.
  { id: 'savings', label: 'Ahorro', icon: '🏦' },
  // Histórico / migrado a la entidad de gastos fijos.
  { id: 'fixed', label: 'Gasto fijo', icon: '📌' },
]

const HIDDEN_EXPENSE_IDS = new Set(['savings', 'fixed'])

const SELECTABLE_EXPENSE_IDS = new Set(
  EXPENSE_CATEGORIES.filter((category) => !HIDDEN_EXPENSE_IDS.has(category.id)).map(
    (category) => category.id,
  ),
)

export function getCategoriesByType(type: TransactionType): CategoryDefinition[] {
  return type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES
}

export function getSelectableCategoriesByType(type: TransactionType): CategoryDefinition[] {
  if (type === 'income') return INCOME_CATEGORIES
  return EXPENSE_CATEGORIES.filter((category) => SELECTABLE_EXPENSE_IDS.has(category.id))
}

export function getCategoryLabel(type: TransactionType, categoryId: string): string {
  const categories = getCategoriesByType(type)
  return categories.find((category) => category.id === categoryId)?.label ?? categoryId
}

export function getCategoryIcon(type: TransactionType, categoryId: string): string {
  const categories = getCategoriesByType(type)
  return categories.find((category) => category.id === categoryId)?.icon ?? '📋'
}
