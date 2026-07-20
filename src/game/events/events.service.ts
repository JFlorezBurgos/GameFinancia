import type { GameEvent, GameEventType, TransactionType } from '@/types'

export function createGameEvent(
  type: GameEventType,
  payload?: Record<string, unknown>,
): GameEvent {
  return {
    type,
    payload,
    timestamp: Date.now(),
  }
}

export function transactionTypeToEvent(type: TransactionType): GameEventType {
  return type === 'income' ? 'transaction.income' : 'transaction.expense'
}
