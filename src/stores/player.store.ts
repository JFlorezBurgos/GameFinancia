import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { computeStreakUpdate, getLevelProgress, processGameReward } from '@/game'
import { db } from '@/services/db'
import type { GameEventType, PlayerProfile } from '@/types'
import { getTodayKey, getYesterdayKey } from '@/utils/format'

const DEFAULT_PROFILE: PlayerProfile = {
  id: 'player',
  displayName: 'Explorador',
  level: 1,
  xp: 0,
  totalXpEarned: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastActivityDate: null,
  createdAt: Date.now(),
  updatedAt: Date.now(),
}

export const usePlayerStore = defineStore('player', () => {
  const profile = ref<PlayerProfile>({ ...DEFAULT_PROFILE })

  const levelProgress = computed(() => getLevelProgress(profile.value.totalXpEarned))

  const isStreakActiveToday = computed(() => profile.value.lastActivityDate === getTodayKey())

  async function loadProfile(): Promise<void> {
    const stored = await db.playerProfile.get('player')
    profile.value = stored ?? { ...DEFAULT_PROFILE }
  }

  async function persistProfile(next: PlayerProfile): Promise<void> {
    profile.value = next
    await db.playerProfile.put(next)
  }

  async function updateDisplayName(name: string): Promise<void> {
    await persistProfile({
      ...profile.value,
      displayName: name.trim() || 'Explorador',
      updatedAt: Date.now(),
    })
  }

  async function recordDailyActivity() {
    const today = getTodayKey()
    const yesterday = getYesterdayKey(today)
    const streak = computeStreakUpdate(
      {
        currentStreak: profile.value.currentStreak,
        longestStreak: profile.value.longestStreak,
        lastActivityDate: profile.value.lastActivityDate,
      },
      today,
      yesterday,
    )

    if (streak.isNewDay || profile.value.lastActivityDate !== today) {
      await persistProfile({
        ...profile.value,
        currentStreak: streak.currentStreak,
        longestStreak: streak.longestStreak,
        lastActivityDate: streak.lastActivityDate,
        updatedAt: Date.now(),
      })
    }

    return streak
  }

  async function applyGameEvent(event: GameEventType) {
    const reward = processGameReward(event, profile.value.totalXpEarned)

    await persistProfile({
      ...profile.value,
      level: reward.levelProgress.level,
      xp: reward.levelProgress.xpInLevel,
      totalXpEarned: reward.newTotalXp,
      updatedAt: Date.now(),
    })

    return reward
  }

  return {
    profile,
    levelProgress,
    isStreakActiveToday,
    loadProfile,
    updateDisplayName,
    recordDailyActivity,
    applyGameEvent,
  }
})
