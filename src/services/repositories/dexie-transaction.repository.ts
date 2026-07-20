import { db } from '@/services/db'
import type { Transaction } from '@/types'
import type { TransactionRepository } from './transaction.repository'

export class DexieTransactionRepository implements TransactionRepository {
  async getAll(): Promise<Transaction[]> {
    return db.transactions.orderBy('createdAt').reverse().toArray()
  }

  async getById(id: string): Promise<Transaction | undefined> {
    return db.transactions.get(id)
  }

  async getByMonth(monthKey: string): Promise<Transaction[]> {
    return db.transactions
      .where('date')
      .between(`${monthKey}-01`, `${monthKey}-31`, true, true)
      .reverse()
      .sortBy('createdAt')
  }

  async save(transaction: Transaction): Promise<void> {
    await db.transactions.put(transaction)
  }

  async delete(id: string): Promise<void> {
    await db.transactions.delete(id)
  }
}
