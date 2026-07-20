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
  { id: 'food', label: 'Comida', icon: '🍽️' },
  { id: 'transport', label: 'Transporte', icon: '🚌' },
  { id: 'housing', label: 'Vivienda', icon: '🏠' },
  { id: 'entertainment', label: 'Entretenimiento', icon: '🎮' },
  { id: 'health', label: 'Salud', icon: '💊' },
  { id: 'education', label: 'Educación', icon: '📚' },
  { id: 'shopping', label: 'Compras', icon: '🛍️' },
  { id: 'other-expense', label: 'Otro', icon: '💸' },
]

export function getCategoriesByType(type: TransactionType): CategoryDefinition[] {
  return type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES
}

export function getCategoryLabel(type: TransactionType, categoryId: string): string {
  const categories = getCategoriesByType(type)
  return categories.find((category) => category.id === categoryId)?.label ?? categoryId
}

export function getCategoryIcon(type: TransactionType, categoryId: string): string {
  const categories = getCategoriesByType(type)
  return categories.find((category) => category.id === categoryId)?.icon ?? '📋'
}
