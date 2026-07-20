import { LEVELS, MAX_LEVEL } from './levels.config'

export interface LevelProgress {
  level: number
  title: string
  currentXp: number
  xpInLevel: number
  xpForNextLevel: number
  progressPercent: number
  isMaxLevel: boolean
}

export function getLevelProgress(totalXp: number): LevelProgress {
  let currentLevel = LEVELS[0]!
  let nextLevel = LEVELS[1]

  for (let i = LEVELS.length - 1; i >= 0; i -= 1) {
    if (totalXp >= LEVELS[i]!.xpRequired) {
      currentLevel = LEVELS[i]!
      nextLevel = LEVELS[i + 1]
      break
    }
  }

  const xpInLevel = totalXp - currentLevel.xpRequired
  const xpForNextLevel = nextLevel ? nextLevel.xpRequired - currentLevel.xpRequired : xpInLevel
  const progressPercent =
    nextLevel && xpForNextLevel > 0
      ? Math.min(100, Math.round((xpInLevel / xpForNextLevel) * 100))
      : 100

  return {
    level: currentLevel.level,
    title: currentLevel.title,
    currentXp: xpInLevel,
    xpInLevel,
    xpForNextLevel,
    progressPercent,
    isMaxLevel: currentLevel.level >= MAX_LEVEL,
  }
}

export function applyXp(currentTotalXp: number, amount: number): number {
  return Math.max(0, currentTotalXp + amount)
}
