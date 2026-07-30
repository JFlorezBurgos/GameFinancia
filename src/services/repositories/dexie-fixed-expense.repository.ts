import { db } from '@/services/db'
import type { FixedExpense } from '@/types'
import type { FixedExpenseRepository } from './fixed-expense.repository'

export class DexieFixedExpenseRepository implements FixedExpenseRepository {
  async getAll(): Promise<FixedExpense[]> {
    return db.fixedExpenses.orderBy('createdAt').reverse().toArray()
  }

  async getByMonth(month: string): Promise<FixedExpense[]> {
    return db.fixedExpenses.where('month').equals(month).reverse().sortBy('createdAt')
  }

  async save(expense: FixedExpense): Promise<void> {
    await db.fixedExpenses.put(expense)
  }

  async delete(id: string): Promise<void> {
    await db.fixedExpenses.delete(id)
  }
}
