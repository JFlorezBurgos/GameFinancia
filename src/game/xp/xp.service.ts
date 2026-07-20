import type { GameEventType } from '@/types'
import { XP_REWARD_MAP } from './xp.config'

export function getXpForEvent(event: GameEventType): number {
  return XP_REWARD_MAP[event]?.amount ?? 0
}

export function calculateXpProgress(currentXp: number, xpForNextLevel: number): number {
  if (xpForNextLevel <= 0) return 100
  return Math.min(100, Math.round((currentXp / xpForNextLevel) * 100))
}
