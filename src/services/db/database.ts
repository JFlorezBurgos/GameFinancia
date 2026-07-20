import Dexie, { type EntityTable } from 'dexie'
import type {
  AppSettings,
  BudgetPeriod,
  PlayerProfile,
  SavingsGoal,
  Transaction,
} from '@/types'

export interface DbPlayerMedal {
  medalId: string
  unlockedAt: number
}

export class RealmDatabase extends Dexie {
  settings!: EntityTable<AppSettings, 'id'>
  playerProfile!: EntityTable<PlayerProfile, 'id'>
  transactions!: EntityTable<Transaction, 'id'>
  goals!: EntityTable<SavingsGoal, 'id'>
  budgets!: EntityTable<BudgetPeriod, 'id'>
  medals!: EntityTable<DbPlayerMedal, 'medalId'>

  constructor() {
    super('ReinoFinancieroDB')

    this.version(1).stores({
      settings: 'id',
      playerProfile: 'id',
      transactions: 'id, type, date, createdAt',
      goals: 'id, createdAt',
      medals: 'medalId, unlockedAt',
      buildings: 'buildingId, unlockedAt',
      quests: 'questId, status',
    })

    this.version(2).stores({
      settings: 'id',
      playerProfile: 'id',
      transactions: 'id, type, date, createdAt',
      goals: 'id, createdAt',
      budgets: 'id, month',
      medals: 'medalId, unlockedAt',
      buildings: 'buildingId, unlockedAt',
      quests: 'questId, status',
    })

    // v3: se elimina el sistema antiguo de "ciudad"/misiones (buildings, quests),
    // reemplazado por "Mi Reino" (kingdom), que no persiste estado propio:
    // se deriva en tiempo real del patrimonio neto (transactions + goals).
    this.version(3).stores({
      buildings: null,
      quests: null,
    })
  }
}

export const db = new RealmDatabase()

export async function initializeDatabase(): Promise<void> {
  const existingProfile = await db.playerProfile.get('player')

  if (!existingProfile) {
    const now = Date.now()
    await db.playerProfile.add({
      id: 'player',
      displayName: 'Explorador',
      level: 1,
      xp: 0,
      totalXpEarned: 0,
      currentStreak: 0,
      longestStreak: 0,
      lastActivityDate: null,
      createdAt: now,
      updatedAt: now,
    })
  }

  const existingSettings = await db.settings.get('app')

  if (!existingSettings) {
    await db.settings.add({
      id: 'app',
      currency: 'COP',
      locale: 'es-CO',
      theme: 'dark',
    })
  }
}
