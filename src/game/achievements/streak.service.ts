export interface StreakState {
  currentStreak: number
  longestStreak: number
  lastActivityDate: string | null
}

export interface StreakUpdateResult extends StreakState {
  isNewDay: boolean
  streakContinued: boolean
  streakBroken: boolean
  shouldRewardStreak: boolean
}

export function computeStreakUpdate(
  state: StreakState,
  today: string,
  yesterday: string,
): StreakUpdateResult {
  if (state.lastActivityDate === today) {
    return {
      ...state,
      isNewDay: false,
      streakContinued: false,
      streakBroken: false,
      shouldRewardStreak: false,
    }
  }

  if (state.lastActivityDate === yesterday) {
    const currentStreak = state.currentStreak + 1
    return {
      currentStreak,
      longestStreak: Math.max(state.longestStreak, currentStreak),
      lastActivityDate: today,
      isNewDay: true,
      streakContinued: true,
      streakBroken: false,
      shouldRewardStreak: currentStreak > 1,
    }
  }

  const streakBroken = Boolean(state.lastActivityDate)
  return {
    currentStreak: 1,
    longestStreak: Math.max(state.longestStreak, 1),
    lastActivityDate: today,
    isNewDay: true,
    streakContinued: false,
    streakBroken,
    shouldRewardStreak: false,
  }
}

export function isStreakAtRisk(
  lastActivityDate: string | null,
  today: string,
  yesterday: string,
): boolean {
  if (!lastActivityDate) return false
  if (lastActivityDate === today) return false
  return lastActivityDate === yesterday
}
