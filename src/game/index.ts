export { XP_REWARDS, XP_REWARD_MAP } from './xp/xp.config'
export { getXpForEvent, calculateXpProgress } from './xp/xp.service'
export { LEVELS, MAX_LEVEL } from './levels/levels.config'
export { getLevelProgress, applyXp } from './levels/levels.service'
export type { LevelProgress } from './levels/levels.service'
export { MEDALS, MEDAL_MAP, RARITY_LABELS } from './achievements/achievements.config'
export {
  evaluateUnlockedMedals,
  isMedalConditionMet,
  countActiveMonths,
} from './achievements/achievements.service'
export type { AchievementContext } from './achievements/achievements.service'
export {
  computeStreakUpdate,
  isStreakAtRisk,
} from './achievements/streak.service'
export type { StreakState, StreakUpdateResult } from './achievements/streak.service'
export { DAILY_QUESTS } from './quests/quests.config'
export {
  DEFAULT_CURRENCY,
  DEFAULT_LOCALE,
  calculateSavingsRate,
  calculateBalance,
} from './economy/economy.service'
export {
  INCOME_CATEGORIES,
  EXPENSE_CATEGORIES,
  getCategoriesByType,
  getCategoryLabel,
  getCategoryIcon,
} from './economy/categories.config'
export {
  calculateFinanceSummary,
  filterTransactionsByMonth,
  sortTransactionsDesc,
  groupTransactionsByDate,
} from './economy/finance.service'
export type { TransactionGroup } from './economy/finance.service'
export {
  getGoalProgress,
  sortGoals,
  applyGoalContribution,
  calculateTotalSavings,
  calculateTotalGoalTargets,
} from './economy/goals.service'
export { buildBudgetStatus, markBudgetRewardClaimed } from './economy/budget.service'
export { processGameReward } from './rewards/rewards.service'
export type { RewardResult } from './rewards/rewards.service'
export { createGameEvent, transactionTypeToEvent } from './events/events.service'
export {
  getCityStageByProgress,
  getCityStageByXp,
  getUnlockedBuildings,
  calculateCityProgress,
  calculateVisualProgress,
  calculateCityXpFromBalance,
  cityXpToProgressPercent,
  CITY_STAGES,
  CITY_BUILDINGS,
  CITY_DECORATIONS,
  CITY_TERRAIN,
  CITY_XP_PER_CURRENCY_UNIT,
  CITY_XP_FOR_FULL_PROGRESS,
  BUILDINGS,
  CityProgressEngine,
  cityProgressEngine,
  resolveSeason,
  evaluateMilestone,
  describeMilestone,
  resolveCityAssetUrl,
  hasCityAsset,
} from './city/city.service'

export {
  KINGDOM_STAGES,
  KingdomEngine,
  kingdomEngine,
  getStageForBalance,
  getNextStage,
  calculateProgressToNext,
  resolveKingdomStageImage,
} from './kingdom'
