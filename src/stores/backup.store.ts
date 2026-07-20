import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  buildBackupFilename,
  createBackupPayload,
  LocalFileBackupTransport,
  restoreBackupPayload,
  summarizeBackup,
  validateBackupPayload,
} from '@/services/backup'
import type { BackupSummary } from '@/types'

const transport = new LocalFileBackupTransport()

export const useBackupStore = defineStore('backup', () => {
  const isExporting = ref(false)
  const isImporting = ref(false)
  const error = ref<string | null>(null)
  const lastExportSummary = ref<BackupSummary | null>(null)

  async function exportBackup(): Promise<void> {
    isExporting.value = true
    error.value = null

    try {
      const payload = await createBackupPayload()
      await transport.save(payload, buildBackupFilename())
      lastExportSummary.value = summarizeBackup(payload.data, payload.exportedAt)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'No se pudo generar el respaldo.'
      throw err
    } finally {
      isExporting.value = false
    }
  }

  async function importBackup(file: File): Promise<BackupSummary> {
    isImporting.value = true
    error.value = null

    try {
      const raw = await transport.read(file)
      const payload = validateBackupPayload(raw)
      await restoreBackupPayload(payload)
      return summarizeBackup(payload.data, payload.exportedAt)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'No se pudo restaurar el respaldo.'
      throw err
    } finally {
      isImporting.value = false
    }
  }

  return {
    isExporting,
    isImporting,
    error,
    lastExportSummary,
    exportBackup,
    importBackup,
  }
})
