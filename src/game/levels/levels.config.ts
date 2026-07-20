import type { LevelDefinition } from '@/types'

export const LEVELS: LevelDefinition[] = [
  { level: 1, xpRequired: 0, title: 'Explorador' },
  { level: 2, xpRequired: 100, title: 'Recolector' },
  { level: 3, xpRequired: 250, title: 'Planificador' },
  { level: 4, xpRequired: 500, title: 'Constructor' },
  { level: 5, xpRequired: 900, title: 'Administrador' },
  { level: 6, xpRequired: 1400, title: 'Estratega' },
  { level: 7, xpRequired: 2000, title: 'Señor del Tesoro' },
  { level: 8, xpRequired: 2800, title: 'Guardián del Reino' },
  { level: 9, xpRequired: 3800, title: 'Maestro Financiero' },
  { level: 10, xpRequired: 5000, title: 'Rey del Ahorro' },
]

export const MAX_LEVEL = LEVELS[LEVELS.length - 1]?.level ?? 10
