export type MedalRarity =
  | 'common'
  | 'uncommon'
  | 'rare'
  | 'epic'
  | 'legendary'
  | 'mythic'

export type TransactionType = 'income' | 'expense'

export type QuestStatus = 'locked' | 'active' | 'completed'

export type GameEventType =
  | 'transaction.income'
  | 'transaction.expense'
  | 'budget.met'
  | 'goal.completed'
  | 'streak.maintained'

export interface GameEvent {
  type: GameEventType
  payload?: Record<string, unknown>
  timestamp: number
}

export interface XpReward {
  event: GameEventType
  amount: number
  label: string
}

export interface LevelDefinition {
  level: number
  xpRequired: number
  title: string
}

export interface MedalDefinition {
  id: string
  name: string
  description: string
  rarity: MedalRarity
  icon: string
  conditionKey: string
}

export interface QuestDefinition {
  id: string
  title: string
  description: string
  xpReward: number
  status: QuestStatus
}

export type {
  CityStage,
  CitySeason,
  CityStageDefinition,
  BuildingDefinition,
} from './city.types'

