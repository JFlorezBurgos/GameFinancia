export type CityStage = 'campo' | 'aldea' | 'pueblo' | 'villa' | 'ciudad' | 'reino'

export type CitySeason = 'spring' | 'summer' | 'autumn' | 'winter'

export type MilestoneRule =
  | { type: 'always' }
  | { type: 'minProgress'; value: number }
  | { type: 'minCityXp'; value: number }
  | { type: 'minLevel'; value: number }
  | { type: 'minSaved'; value: number }
  | { type: 'minStreak'; value: number }
  | { type: 'minMedals'; value: number }
  | { type: 'minGoalsCompleted'; value: number }
  | { type: 'minIncomeCount'; value: number }
  | { type: 'minExpenseCount'; value: number }
  | { type: 'minBudgetClaims'; value: number }
  | { type: 'minActiveMonths'; value: number }
  | { type: 'and'; rules: MilestoneRule[] }
  | { type: 'or'; rules: MilestoneRule[] }

export interface CityGridPosition {
  col: number
  row: number
}

export interface BuildingUpgradeDefinition {
  level: number
  assetKey: string
  unlockWhen: MilestoneRule
  label?: string
}

export interface CityBuildingCatalogEntry {
  id: string
  name: string
  description: string
  stage: CityStage
  assetKey: string
  unlockWhen: MilestoneRule
  grid: CityGridPosition
  zIndex?: number
  upgrades?: BuildingUpgradeDefinition[]
}

export interface CityDecorationCatalogEntry {
  id: string
  name: string
  assetKey: string
  unlockWhen: MilestoneRule
  /** If set, decoration hides when progress is at or above this value (reclaimed land). */
  hideAboveProgress?: number
  grid: CityGridPosition
  seasons?: CitySeason[]
}

export interface CityTerrainCatalogEntry {
  id: string
  assetKey: string
  unlockWhen: MilestoneRule
  hideAboveProgress?: number
  grid: CityGridPosition
}

export interface CityStageDefinition {
  stage: CityStage
  label: string
  minProgress: number
  minCityXp: number
  description: string
}

/**
 * Entrada del motor.
 * `balance` y `cityXp` son reversibles: bajan si hay más gastos que ingresos.
 */
export interface CityProgressInput {
  balance: number
  cityXp: number
  totalIncome: number
  totalExpenses: number
  totalSaved: number
  totalGoalTargets: number
  goalsCompleted: number
  incomeCount: number
  expenseCount: number
  currentStreak: number
  longestStreak: number
  level: number
  medalsUnlocked: number
  budgetRewardsClaimed: number
  activeMonths: number
}

export interface PlacedCityBuilding {
  id: string
  name: string
  description: string
  stage: CityStage
  assetKey: string
  level: number
  grid: CityGridPosition
  zIndex: number
  justUnlocked?: boolean
}

export interface PlacedCityDecoration {
  id: string
  name: string
  assetKey: string
  grid: CityGridPosition
}

export interface PlacedCityTerrain {
  id: string
  assetKey: string
  grid: CityGridPosition
}

export interface CitySnapshot {
  progressPercent: number
  cityXp: number
  balance: number
  stage: CityStageDefinition
  season: CitySeason
  buildings: PlacedCityBuilding[]
  decorations: PlacedCityDecoration[]
  terrain: PlacedCityTerrain[]
  nextUnlockHint: string | null
}

/** @deprecated Prefer CityBuildingCatalogEntry */
export interface BuildingDefinition {
  id: string
  name: string
  description: string
  stage: CityStage
  unlockThreshold: number
  assetKey: string
}
