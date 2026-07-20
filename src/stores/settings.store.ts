import { defineStore } from 'pinia'
import { ref } from 'vue'
import { db } from '@/services/db'
import type { AppSettings } from '@/types'
import { DEFAULT_CURRENCY, DEFAULT_LOCALE } from '@/game'

const DEFAULT_SETTINGS: AppSettings = {
  id: 'app',
  currency: DEFAULT_CURRENCY,
  locale: DEFAULT_LOCALE,
  theme: 'dark',
}

export const useSettingsStore = defineStore('settings', () => {
  const settings = ref<AppSettings>({ ...DEFAULT_SETTINGS })

  async function loadSettings(): Promise<void> {
    const stored = await db.settings.get('app')
    settings.value = stored ?? { ...DEFAULT_SETTINGS }
  }

  return {
    settings,
    loadSettings,
  }
})
