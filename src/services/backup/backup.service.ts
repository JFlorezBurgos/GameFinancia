import { calculateFinanceSummary, calculateTotalSavings, kingdomEngine } from '@/game'
import { db } from '@/services/db'
import {
  BACKUP_APP_ID,
  BACKUP_SCHEMA_VERSION,
  type BackupData,
  type BackupPayload,
  type BackupSummary,
} from '@/types'

/**
 * Lee toda la información persistida en Dexie y la empaqueta en un único
 * objeto serializable. No conoce archivos, navegador ni nube: solo sabe
 * armar/validar/restaurar la "foto" de los datos.
 */
export async function createBackupPayload(): Promise<BackupPayload> {
  const [settings, playerProfile, transactions, goals, budgets, medals] = await Promise.all([
    db.settings.toArray(),
    db.playerProfile.toArray(),
    db.transactions.toArray(),
    db.goals.toArray(),
    db.budgets.toArray(),
    db.medals.toArray(),
  ])

  const netWorth = Math.max(
    0,
    calculateFinanceSummary(transactions).balance + calculateTotalSavings(goals),
  )
  const kingdomSnapshot = kingdomEngine.buildSnapshotAtBalance(netWorth)

  return {
    appId: BACKUP_APP_ID,
    schemaVersion: BACKUP_SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    data: { settings, playerProfile, transactions, goals, budgets, medals },
    kingdom: {
      netWorth,
      stageId: kingdomSnapshot.currentStage.id,
      stageLabel: kingdomSnapshot.currentStage.label,
    },
  }
}

function assertArray(value: unknown, field: string): void {
  if (!Array.isArray(value)) {
    throw new Error(`El respaldo no tiene un formato válido (falta "${field}").`)
  }
}

/**
 * Valida a nivel estructural que un JSON crudo (por ejemplo, recién leído de
 * un archivo) tiene la forma de un respaldo de esta app. Lanza un error
 * descriptivo en español si algo no cuadra.
 */
export function validateBackupPayload(value: unknown): BackupPayload {
  if (!value || typeof value !== 'object') {
    throw new Error('El archivo seleccionado no contiene un respaldo válido.')
  }

  const raw = value as Record<string, unknown>

  if (raw.appId !== BACKUP_APP_ID) {
    throw new Error('Este archivo no es un respaldo de Mi Reino Financiero.')
  }

  if (typeof raw.schemaVersion !== 'number') {
    throw new Error('El respaldo no indica una versión de esquema válida.')
  }

  if (raw.schemaVersion > BACKUP_SCHEMA_VERSION) {
    throw new Error(
      'Este respaldo fue creado con una versión más nueva de la app. Actualiza la aplicación antes de restaurarlo.',
    )
  }

  if (typeof raw.exportedAt !== 'string') {
    throw new Error('El respaldo no indica una fecha de exportación válida.')
  }

  const data = raw.data as Record<string, unknown> | undefined
  if (!data || typeof data !== 'object') {
    throw new Error('El respaldo no contiene datos para restaurar.')
  }

  assertArray(data.settings, 'settings')
  assertArray(data.playerProfile, 'playerProfile')
  assertArray(data.transactions, 'transactions')
  assertArray(data.goals, 'goals')
  assertArray(data.budgets, 'budgets')
  assertArray(data.medals, 'medals')

  return raw as unknown as BackupPayload
}

/**
 * Reemplaza TODO el contenido de Dexie por el del respaldo, dentro de una
 * única transacción (si algo falla, no queda la base a medio restaurar).
 * El estado de "Mi Reino" no se toca: se recalcula solo, en cuanto
 * transactions/goals cambian.
 */
export async function restoreBackupPayload(payload: BackupPayload): Promise<void> {
  const backup = validateBackupPayload(payload)
  const { settings, playerProfile, transactions, goals, budgets, medals } = backup.data

  await db.transaction(
    'rw',
    [db.settings, db.playerProfile, db.transactions, db.goals, db.budgets, db.medals],
    async () => {
      await Promise.all([
        db.settings.clear(),
        db.playerProfile.clear(),
        db.transactions.clear(),
        db.goals.clear(),
        db.budgets.clear(),
        db.medals.clear(),
      ])

      await Promise.all([
        settings.length ? db.settings.bulkAdd(settings) : Promise.resolve(),
        playerProfile.length ? db.playerProfile.bulkAdd(playerProfile) : Promise.resolve(),
        transactions.length ? db.transactions.bulkAdd(transactions) : Promise.resolve(),
        goals.length ? db.goals.bulkAdd(goals) : Promise.resolve(),
        budgets.length ? db.budgets.bulkAdd(budgets) : Promise.resolve(),
        medals.length ? db.medals.bulkAdd(medals) : Promise.resolve(),
      ])
    },
  )
}

export function summarizeBackup(data: BackupData, exportedAt: string): BackupSummary {
  return {
    exportedAt,
    transactions: data.transactions.length,
    goals: data.goals.length,
    budgets: data.budgets.length,
    medals: data.medals.length,
  }
}

export function buildBackupFilename(date = new Date()): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `MiLegado-${year}-${month}-${day}.json`
}
