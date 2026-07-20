import type { SavingsGoal } from '@/types'

export interface GoalRepository {
  getAll(): Promise<SavingsGoal[]>
  getById(id: string): Promise<SavingsGoal | undefined>
  save(goal: SavingsGoal): Promise<void>
  delete(id: string): Promise<void>
}
