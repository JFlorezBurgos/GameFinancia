import type { QuestDefinition } from '@/types'

export const DAILY_QUESTS: QuestDefinition[] = [
  {
    id: 'register-movement',
    title: 'Registro Diario',
    description: 'Registra al menos un movimiento hoy.',
    xpReward: 25,
    status: 'active',
  },
  {
    id: 'review-balance',
    title: 'Vista del Reino',
    description: 'Revisa tu balance del día.',
    xpReward: 10,
    status: 'active',
  },
]
