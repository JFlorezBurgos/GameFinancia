import type { FixedExpense } from '@/types'

export interface FixedExpenseRepository {
  getAll(): Promise<FixedExpense[]>
  getByMonth(month: string): Promise<FixedExpense[]>
  save(expense: FixedExpense): Promise<void>
  delete(id: string): Promise<void>
}
