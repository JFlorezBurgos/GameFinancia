import { db } from '@/services/db'
import type { SavingsGoal } from '@/types'
import type { GoalRepository } from './goal.repository'

export class DexieGoalRepository implements GoalRepository {
  async getAll(): Promise<SavingsGoal[]> {
    return db.goals.orderBy('createdAt').reverse().toArray()
  }

  async getById(id: string): Promise<SavingsGoal | undefined> {
    return db.goals.get(id)
  }

  async save(goal: SavingsGoal): Promise<void> {
    await db.goals.put(goal)
  }

  async delete(id: string): Promise<void> {
    await db.goals.delete(id)
  }
}
