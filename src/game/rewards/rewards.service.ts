import type { GameEventType } from '@/types'
import { XP_REWARD_MAP } from '../xp/xp.config'
import { getXpForEvent } from '../xp/xp.service'
import { applyXp, getLevelProgress, type LevelProgress } from '../levels/levels.service'

export interface RewardResult {
  event: GameEventType
  label: string
  xpGained: number
  previousLevel: number
  newTotalXp: number
  levelProgress: LevelProgress
  leveledUp: boolean
}

export function processGameReward(
  event: GameEventType,
  currentTotalXp: number,
): RewardResult {
  const xpGained = getXpForEvent(event)
  const previousProgress = getLevelProgress(currentTotalXp)
  const newTotalXp = applyXp(currentTotalXp, xpGained)
  const levelProgress = getLevelProgress(newTotalXp)

  return {
    event,
    label: XP_REWARD_MAP[event]?.label ?? 'Recompensa',
    xpGained,
    previousLevel: previousProgress.level,
    newTotalXp,
    levelProgress,
    leveledUp: levelProgress.level > previousProgress.level,
  }
}
