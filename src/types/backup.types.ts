import type { BudgetPeriod, FixedExpense, SavingsGoal, Transaction } from './finance.types'
import type { PlayerMedal, PlayerProfile } from './player.types'
import type { AppSettings } from './settings.types'

/** Identifica a qué app pertenece el archivo, para rechazar respaldos ajenos. */
export const BACKUP_APP_ID = 'reino-financiero'

/**
 * Se incrementa cada vez que cambia la forma de `BackupData`.
 * Permite migrar respaldos antiguos en `restoreBackupPayload` sin romper
 * a los usuarios que actualizan la app.
 */
export const BACKUP_SCHEMA_VERSION = 2

/** Todo lo que realmente se persiste en Dexie y debe poder restaurarse tal cual. */
export interface BackupData {
  settings: AppSettings[]
  playerProfile: PlayerProfile[]
  transactions: Transaction[]
  goals: SavingsGoal[]
  budgets: BudgetPeriod[]
  fixedExpenses: FixedExpense[]
  medals: PlayerMedal[]
}

/**
 * Snapshot informativo de "Mi Reino" incluido solo como referencia legible
 * dentro del archivo. No se restaura: el Reino siempre se recalcula en vivo
 * a partir de `transactions` + `goals`, así que nunca puede quedar
 * desincronizado del resto de los datos.
 */
export interface BackupKingdomSnapshot {
  netWorth: number
  stageId: string
  stageLabel: string
}

export interface BackupPayload {
  appId: typeof BACKUP_APP_ID
  schemaVersion: number
  exportedAt: string
  data: BackupData
  kingdom: BackupKingdomSnapshot
}

export interface BackupSummary {
  exportedAt: string
  transactions: number
  goals: number
  budgets: number
  fixedExpenses: number
  medals: number
}

/**
 * Puerto de transporte del respaldo: quién mueve los bytes.
 * `LocalFileBackupTransport` los mueve a un archivo del dispositivo; una
 * futura integración con Supabase/Google Drive/iCloud solo necesita
 * implementar esta misma interfaz, sin tocar `backup.service.ts`.
 */
export interface BackupTransport {
  /** Entrega el respaldo al destino (descarga local, subida a la nube, etc). */
  save(payload: BackupPayload, filename: string): Promise<void>
  /** Lee datos crudos (aún sin validar) desde el origen. */
  read(source: unknown): Promise<unknown>
}
