import type { BackupPayload, BackupTransport } from '@/types'

/**
 * Transporte local: descarga el respaldo como archivo .json y lee un
 * `File` elegido por el usuario. Es la única pieza del sistema de respaldo
 * que conoce las APIs del navegador (Blob, File, anchor).
 *
 * Para agregar sincronización en la nube (Supabase, Google Drive, iCloud),
 * basta crear otra clase que implemente `BackupTransport` (por ejemplo
 * `SupabaseBackupTransport`) y usarla en `backup.store.ts` en lugar de
 * esta — `backup.service.ts` no cambia en absoluto.
 */
export class LocalFileBackupTransport implements BackupTransport {
  async save(payload: BackupPayload, filename: string): Promise<void> {
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    try {
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = filename
      anchor.rel = 'noopener'
      document.body.appendChild(anchor)
      anchor.click()
      anchor.remove()
    } finally {
      URL.revokeObjectURL(url)
    }
  }

  async read(source: unknown): Promise<unknown> {
    if (!(source instanceof File)) {
      throw new Error('Selecciona un archivo de respaldo (.json) válido.')
    }

    const text = await source.text()

    try {
      return JSON.parse(text)
    } catch {
      throw new Error('El archivo no contiene un JSON válido.')
    }
  }
}
