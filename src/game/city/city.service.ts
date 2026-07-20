import { CITY_BUILDINGS } from './city.catalog'

export {
  CITY_STAGES,
  CITY_BUILDINGS,
  CITY_DECORATIONS,
  CITY_TERRAIN,
  CITY_XP_PER_CURRENCY_UNIT,
  CITY_XP_FOR_FULL_PROGRESS,
} from './city.catalog'
export {
  CityProgressEngine,
  cityProgressEngine,
  calculateVisualProgress,
  calculateCityXpFromBalance,
  cityXpToProgressPercent,
  getCityStageByProgress,
  getCityStageByXp,
  resolveSeason,
} from './city-progress.engine'
export { evaluateMilestone, describeMilestone } from './milestones'
export { resolveCityAssetUrl, hasCityAsset, CITY_ASSET_PLACEHOLDER } from './city.assets'

export const BUILDINGS = CITY_BUILDINGS

export function getUnlockedBuildings(progressPercent: number) {
  return CITY_BUILDINGS.filter((building) => {
    if (building.unlockWhen.type === 'always') return true
    if (building.unlockWhen.type === 'minProgress') {
      return progressPercent >= building.unlockWhen.value
    }
    return false
  })
}

export function calculateCityProgress(totalSaved: number, totalGoalAmount: number): number {
  if (totalGoalAmount <= 0) return totalSaved > 0 ? 15 : 0
  return Math.min(100, Math.round((totalSaved / totalGoalAmount) * 100))
}
