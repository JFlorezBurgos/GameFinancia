import {
  CITY_BUILDINGS,
  CITY_DECORATIONS,
  CITY_STAGES,
  CITY_TERRAIN,
  CITY_XP_FOR_FULL_PROGRESS,
  CITY_XP_PER_CURRENCY_UNIT,
} from './city.catalog'
import { describeMilestone, evaluateMilestone } from './milestones'
import type {
  CityProgressInput,
  CitySeason,
  CitySnapshot,
  CityStageDefinition,
  PlacedCityBuilding,
  PlacedCityDecoration,
  PlacedCityTerrain,
} from '@/types'

function clampProgress(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)))
}

/**
 * XP de ciudad reversible:
 * - Sube con ingresos (balance positivo)
 * - Baja con gastos (si el balance cae, la ciudad se encoge)
 */
export function calculateCityXpFromBalance(balance: number): number {
  if (balance <= 0) return 0
  return Math.floor(balance / CITY_XP_PER_CURRENCY_UNIT)
}

export function cityXpToProgressPercent(cityXp: number): number {
  if (cityXp <= 0) return 0
  return clampProgress((cityXp / CITY_XP_FOR_FULL_PROGRESS) * 100)
}

/** @deprecated use calculateCityXpFromBalance + cityXpToProgressPercent */
export function calculateVisualProgress(input: CityProgressInput): number {
  const xp = input.cityXp > 0 ? input.cityXp : calculateCityXpFromBalance(input.balance)
  return cityXpToProgressPercent(xp)
}

export function getCityStageByProgress(progressPercent: number): CityStageDefinition {
  const sorted = [...CITY_STAGES].sort((a, b) => b.minProgress - a.minProgress)
  return sorted.find((stage) => progressPercent >= stage.minProgress) ?? CITY_STAGES[0]!
}

export function getCityStageByXp(cityXp: number): CityStageDefinition {
  const sorted = [...CITY_STAGES].sort((a, b) => b.minCityXp - a.minCityXp)
  return sorted.find((stage) => cityXp >= stage.minCityXp) ?? CITY_STAGES[0]!
}

export function resolveSeason(date = new Date()): CitySeason {
  const month = date.getMonth()
  if (month >= 2 && month <= 4) return 'spring'
  if (month >= 5 && month <= 7) return 'summer'
  if (month >= 8 && month <= 10) return 'autumn'
  return 'winter'
}

function resolveBuildingLevel(
  entry: (typeof CITY_BUILDINGS)[number],
  input: CityProgressInput,
  progressPercent: number,
): { level: number; assetKey: string } {
  let level = 1
  let assetKey = entry.assetKey

  const upgrades = [...(entry.upgrades ?? [])].sort((a, b) => a.level - b.level)
  for (const upgrade of upgrades) {
    if (evaluateMilestone(upgrade.unlockWhen, input, progressPercent)) {
      level = upgrade.level
      assetKey = upgrade.assetKey
    }
  }

  return { level, assetKey }
}

function findNextUnlockHint(
  _input: CityProgressInput,
  progressPercent: number,
  unlockedBuildingIds: Set<string>,
): string | null {
  for (const building of CITY_BUILDINGS) {
    if (unlockedBuildingIds.has(building.id)) continue
    return `${building.name}: ${describeMilestone(building.unlockWhen)} · ahora ${progressPercent}%`
  }
  return null
}

/**
 * Motor puro reversible: el balance define el XP de ciudad.
 * Si sacas dinero, el XP baja y la escena vuelve hacia el campo.
 */
export class CityProgressEngine {
  buildSnapshot(
    input: CityProgressInput,
    options?: { season?: CitySeason; now?: Date },
  ): CitySnapshot {
    const cityXp =
      input.cityXp >= 0 ? input.cityXp : calculateCityXpFromBalance(input.balance)
    const progressPercent = cityXpToProgressPercent(cityXp)
    const stage = getCityStageByProgress(progressPercent)
    const season = options?.season ?? resolveSeason(options?.now)

    const buildings: PlacedCityBuilding[] = CITY_BUILDINGS.filter((entry) =>
      evaluateMilestone(entry.unlockWhen, input, progressPercent),
    ).map((entry) => {
      const resolved = resolveBuildingLevel(entry, input, progressPercent)
      return {
        id: entry.id,
        name: entry.name,
        description: entry.description,
        stage: entry.stage,
        assetKey: resolved.assetKey,
        level: resolved.level,
        grid: entry.grid,
        zIndex: entry.zIndex ?? entry.grid.col + entry.grid.row,
      }
    })

    const decorations: PlacedCityDecoration[] = CITY_DECORATIONS.filter((entry) => {
      if (entry.seasons && entry.seasons.length > 0 && !entry.seasons.includes(season)) {
        return false
      }
      if (
        typeof entry.hideAboveProgress === 'number' &&
        progressPercent >= entry.hideAboveProgress
      ) {
        return false
      }
      return evaluateMilestone(entry.unlockWhen, input, progressPercent)
    }).map((entry) => ({
      id: entry.id,
      name: entry.name,
      assetKey: entry.assetKey,
      grid: entry.grid,
    }))

    const terrain: PlacedCityTerrain[] = CITY_TERRAIN.filter((entry) => {
      if (
        typeof entry.hideAboveProgress === 'number' &&
        progressPercent >= entry.hideAboveProgress
      ) {
        return false
      }
      return evaluateMilestone(entry.unlockWhen, input, progressPercent)
    }).map((entry) => ({
      id: entry.id,
      assetKey: entry.assetKey,
      grid: entry.grid,
    }))

    const unlockedIds = new Set(buildings.map((building) => building.id))

    return {
      progressPercent,
      cityXp,
      balance: input.balance,
      stage,
      season,
      buildings,
      decorations,
      terrain,
      nextUnlockHint: findNextUnlockHint(input, progressPercent, unlockedIds),
    }
  }

  /** Útil para demos/previews: fuerza un % exacto. */
  buildSnapshotAtProgress(
    progressPercent: number,
    options?: { season?: CitySeason; balance?: number },
  ): CitySnapshot {
    const clamped = clampProgress(progressPercent)
    const cityXp = Math.round((clamped / 100) * CITY_XP_FOR_FULL_PROGRESS)
    const balance =
      options?.balance ?? cityXp * CITY_XP_PER_CURRENCY_UNIT

    return this.buildSnapshot(
      {
        balance,
        cityXp,
        totalIncome: Math.max(balance, 0),
        totalExpenses: balance < 0 ? Math.abs(balance) : 0,
        totalSaved: Math.max(balance, 0),
        totalGoalTargets: CITY_XP_FOR_FULL_PROGRESS * CITY_XP_PER_CURRENCY_UNIT,
        goalsCompleted: 0,
        incomeCount: 0,
        expenseCount: 0,
        currentStreak: 0,
        longestStreak: 0,
        level: 1,
        medalsUnlocked: 0,
        budgetRewardsClaimed: 0,
        activeMonths: 0,
      },
      { season: options?.season },
    )
  }
}

export const cityProgressEngine = new CityProgressEngine()
