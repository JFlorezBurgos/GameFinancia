import { defineStore } from 'pinia'
import { ref } from 'vue'
import { initializeDatabase } from '@/services/db'

export const useAppStore = defineStore('app', () => {
  const isReady = ref(false)
  const isLoading = ref(true)
  const error = ref<string | null>(null)

  async function bootstrap(): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      await initializeDatabase()
      isReady.value = true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al inicializar la aplicación'
    } finally {
      isLoading.value = false
    }
  }

  return {
    isReady,
    isLoading,
    error,
    bootstrap,
  }
})
