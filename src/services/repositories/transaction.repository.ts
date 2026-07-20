import type { Transaction } from '@/types'

export interface TransactionRepository {
  getAll(): Promise<Transaction[]>
  getById(id: string): Promise<Transaction | undefined>
  getByMonth(monthKey: string): Promise<Transaction[]>
  save(transaction: Transaction): Promise<void>
  delete(id: string): Promise<void>
}
