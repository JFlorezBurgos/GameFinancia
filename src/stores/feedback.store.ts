import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { RewardResult } from '@/game'
import type { MedalDefinition } from '@/types'

export interface FeedbackToast {
  id: string
  title: string
  subtitle: string
  xpGained: number
  kind: 'xp' | 'medal' | 'streak'
}

export const useFeedbackStore = defineStore('feedback', () => {
  const toasts = ref<FeedbackToast[]>([])
  const levelUp = ref<RewardResult | null>(null)
  const unlockedMedal = ref<MedalDefinition | null>(null)
  const medalQueue = ref<MedalDefinition[]>([])

  function pushToast(toast: Omit<FeedbackToast, 'id'>, duration = 2800): void {
    const entry: FeedbackToast = {
      ...toast,
      id: crypto.randomUUID(),
    }

    toasts.value = [...toasts.value, entry]

    window.setTimeout(() => {
      dismissToast(entry.id)
    }, duration)
  }

  function showReward(result: RewardResult): void {
    if (result.xpGained <= 0) return

    pushToast({
      title: `+${result.xpGained} XP`,
      subtitle: result.label,
      xpGained: result.xpGained,
      kind: result.event === 'streak.maintained' ? 'streak' : 'xp',
    })

    if (result.leveledUp) {
      levelUp.value = result
    }
  }

  function showMedal(medal: MedalDefinition): void {
    pushToast(
      {
        title: 'Medalla desbloqueada',
        subtitle: medal.name,
        xpGained: 0,
        kind: 'medal',
      },
      3200,
    )

    if (unlockedMedal.value) {
      medalQueue.value = [...medalQueue.value, medal]
      return
    }

    unlockedMedal.value = medal
  }

  function dismissToast(id: string): void {
    toasts.value = toasts.value.filter((toast) => toast.id !== id)
  }

  function dismissLevelUp(): void {
    levelUp.value = null
  }

  function dismissMedal(): void {
    const [next, ...rest] = medalQueue.value
    medalQueue.value = rest
    unlockedMedal.value = next ?? null
  }

  return {
    toasts,
    levelUp,
    unlockedMedal,
    showReward,
    showMedal,
    dismissToast,
    dismissLevelUp,
    dismissMedal,
  }
})
