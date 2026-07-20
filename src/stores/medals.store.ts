import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import {
  evaluateUnlockedMedals,
  MEDAL_MAP,
  MEDALS,
  type AchievementContext,
} from '@/game'
import { db } from '@/services/db'
import type { MedalDefinition, PlayerMedal } from '@/types'

export const useMedalsStore = defineStore('medals', () => {
  const unlocked = ref<PlayerMedal[]>([])
  const isLoading = ref(false)

  const unlockedIds = computed(() => unlocked.value.map((medal) => medal.medalId))

  const unlockedCount = computed(() => unlocked.value.length)

  const totalCount = computed(() => MEDALS.length)

  const medalCards = computed(() =>
    MEDALS.map((medal) => {
      const progress = unlocked.value.find((item) => item.medalId === medal.id)
      return {
        ...medal,
        unlocked: Boolean(progress),
        unlockedAt: progress?.unlockedAt,
      }
    }),
  )

  async function loadMedals(): Promise<void> {
    isLoading.value = true
    try {
      unlocked.value = await db.medals.toArray()
    } finally {
      isLoading.value = false
    }
  }

  async function unlockMedal(medalId: string): Promise<MedalDefinition | null> {
    if (unlockedIds.value.includes(medalId)) return null

    const definition = MEDAL_MAP[medalId]
    if (!definition) return null

    const entry: PlayerMedal = {
      medalId,
      unlockedAt: Date.now(),
    }

    await db.medals.put(entry)
    unlocked.value = [...unlocked.value, entry]
    return definition
  }

  async function evaluateAndUnlock(context: AchievementContext): Promise<MedalDefinition[]> {
    const newlyEarned = evaluateUnlockedMedals(context, unlockedIds.value)
    const unlockedDefinitions: MedalDefinition[] = []

    for (const medal of newlyEarned) {
      const result = await unlockMedal(medal.id)
      if (result) unlockedDefinitions.push(result)
    }

    return unlockedDefinitions
  }

  return {
    unlocked,
    isLoading,
    unlockedIds,
    unlockedCount,
    totalCount,
    medalCards,
    loadMedals,
    unlockMedal,
    evaluateAndUnlock,
  }
})
