import type { KingdomStageDefinition } from '@/types/kingdom.types'

/**
 * Etapas del reino. Cada una tiene una ilustración completa propia
 * (ver kingdom.stage-assets.ts) en vez de componerse de piezas sueltas.
 * Los umbrales están en COP de patrimonio neto.
 */
export const KINGDOM_STAGES: KingdomStageDefinition[] = [
  {
    id: 'baldio',
    label: 'Terreno Baldío',
    minBalance: 0,
    maxBalance: 9_999_999,
    caption: 'Todo gran reino comienza con un primer paso.',
    previewBalance: 0,
    image: 'baldio',
  },
  {
    id: 'campamento',
    label: 'Campamento',
    minBalance: 10_000_000,
    maxBalance: 24_999_999,
    caption: 'Tu constancia empieza a dar frutos.',
    previewBalance: 15_000_000,
    image: 'campamento',
  },
  {
    id: 'aldea',
    label: 'Aldea',
    minBalance: 25_000_000,
    maxBalance: 49_999_999,
    caption: 'Tu planificación construye tu futuro.',
    previewBalance: 35_000_000,
    image: 'aldea',
  },
  {
    id: 'villa',
    label: 'Villa',
    minBalance: 50_000_000,
    maxBalance: 79_999_999,
    caption: 'Tu disciplina te hace prosperar.',
    previewBalance: 65_000_000,
    image: 'villa',
  },
  {
    id: 'ciudad',
    label: 'Ciudad',
    minBalance: 80_000_000,
    maxBalance: 119_999_999,
    caption: 'Tu esfuerzo te convierte en ejemplo.',
    previewBalance: 100_000_000,
    image: 'ciudad',
  },
  {
    id: 'reino',
    label: 'Reino Próspero',
    minBalance: 120_000_000,
    maxBalance: null,
    caption: 'Tu libertad financiera es tu mayor victoria.',
    previewBalance: 150_000_000,
    image: 'reino',
  },
]
