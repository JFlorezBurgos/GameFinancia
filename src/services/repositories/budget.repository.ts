import type { BudgetPeriod } from '@/types'

export interface BudgetRepository {
  getByMonth(month: string): Promise<BudgetPeriod | undefined>
  getAll(): Promise<BudgetPeriod[]>
  save(budget: BudgetPeriod): Promise<void>
  delete(id: string): Promise<void>
}
