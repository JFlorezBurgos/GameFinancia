import { db } from '@/services/db'
import type { BudgetPeriod } from '@/types'
import type { BudgetRepository } from './budget.repository'

export class DexieBudgetRepository implements BudgetRepository {
  async getByMonth(month: string): Promise<BudgetPeriod | undefined> {
    return db.budgets.get(month)
  }

  async getAll(): Promise<BudgetPeriod[]> {
    return db.budgets.toArray()
  }

  async save(budget: BudgetPeriod): Promise<void> {
    await db.budgets.put(budget)
  }

  async delete(id: string): Promise<void> {
    await db.budgets.delete(id)
  }
}
