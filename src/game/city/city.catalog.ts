import type {
  CityBuildingCatalogEntry,
  CityDecorationCatalogEntry,
  CityStageDefinition,
  CityTerrainCatalogEntry,
} from '@/types'

/**
 * Escala de prosperidad (reversible).
 * cityXp ≈ balance / XP_PER_CURRENCY_UNIT
 * Ajusta estos valores para acelerar/ralentizar el crecimiento visual.
 */
export const CITY_XP_PER_CURRENCY_UNIT = 10_000
export const CITY_XP_FOR_FULL_PROGRESS = 500

export const CITY_STAGES: CityStageDefinition[] = [
  {
    stage: 'campo',
    label: 'Campo',
    minProgress: 0,
    minCityXp: 0,
    description: 'Solo tierra y silencio. Sin balance positivo, no hay ciudad.',
  },
  {
    stage: 'aldea',
    label: 'Aldea',
    minProgress: 8,
    minCityXp: 40,
    description: 'Aparece el primer campamento cuando empiezas a acumular.',
  },
  {
    stage: 'pueblo',
    label: 'Pueblo',
    minProgress: 25,
    minCityXp: 125,
    description: 'Talleres y casas: tu dinero empieza a ordenarse.',
  },
  {
    stage: 'villa',
    label: 'Villa',
    minProgress: 45,
    minCityXp: 225,
    description: 'Comercio y cercas: hay flujo y estructura.',
  },
  {
    stage: 'ciudad',
    label: 'Ciudad',
    minProgress: 70,
    minCityXp: 350,
    description: 'Fortaleza y plaza: prosperidad consolidada.',
  },
  {
    stage: 'reino',
    label: 'Reino',
    minProgress: 92,
    minCityXp: 460,
    description: 'El monumento corona un balance sólido y sostenido.',
  },
]

/**
 * Edificios desbloqueados por progreso/XP de ciudad.
 * Si el balance cae, el progreso baja y los edificios desaparecen solos.
 */
export const CITY_BUILDINGS: CityBuildingCatalogEntry[] = [
  {
    id: 'camp-tent',
    name: 'Campamento',
    description: 'Primer refugio al dejar el campo vacío.',
    stage: 'aldea',
    assetKey: 'tent',
    unlockWhen: { type: 'minProgress', value: 8 },
    grid: { col: 2, row: 2 },
    zIndex: 20,
  },
  {
    id: 'wood-chest',
    name: 'Cofre del Ahorro',
    description: 'Guarda el excedente cuando hay prosperidad.',
    stage: 'aldea',
    assetKey: 'chest',
    unlockWhen: { type: 'minProgress', value: 15 },
    grid: { col: 3, row: 2 },
    zIndex: 21,
  },
  {
    id: 'workbench',
    name: 'Taller',
    description: 'Orden y oficio cuando el balance crece.',
    stage: 'pueblo',
    assetKey: 'workbench',
    unlockWhen: { type: 'minProgress', value: 25 },
    grid: { col: 1, row: 3 },
    zIndex: 22,
    upgrades: [
      {
        level: 2,
        assetKey: 'workbench-anvil',
        unlockWhen: { type: 'minProgress', value: 40 },
        label: 'Taller reforzado',
      },
    ],
  },
  {
    id: 'wood-house',
    name: 'Casa del Tesorero',
    description: 'Hogar estable en el pueblo.',
    stage: 'pueblo',
    assetKey: 'structure',
    unlockWhen: { type: 'minProgress', value: 32 },
    grid: { col: 3, row: 3 },
    zIndex: 23,
  },
  {
    id: 'market-fence',
    name: 'Cercado del Mercado',
    description: 'Marca el comercio de la villa.',
    stage: 'villa',
    assetKey: 'fence',
    unlockWhen: { type: 'minProgress', value: 45 },
    grid: { col: 1, row: 1 },
    zIndex: 18,
    upgrades: [
      {
        level: 2,
        assetKey: 'fence-fortified',
        unlockWhen: { type: 'minProgress', value: 60 },
        label: 'Mercado fortificado',
      },
    ],
  },
  {
    id: 'market-stand',
    name: 'Puesto de Comercio',
    description: 'Flujo visible de ingresos.',
    stage: 'villa',
    assetKey: 'campfire-stand',
    unlockWhen: { type: 'minProgress', value: 52 },
    grid: { col: 2, row: 1 },
    zIndex: 19,
  },
  {
    id: 'stone-fort',
    name: 'Fortaleza',
    description: 'Protege lo construido con disciplina.',
    stage: 'ciudad',
    assetKey: 'structure-metal',
    unlockWhen: { type: 'minProgress', value: 70 },
    grid: { col: 4, row: 2 },
    zIndex: 30,
  },
  {
    id: 'royal-sign',
    name: 'Monumento del Reino',
    description: 'Corona el máximo de prosperidad.',
    stage: 'reino',
    assetKey: 'signpost',
    unlockWhen: { type: 'minProgress', value: 92 },
    grid: { col: 2, row: 3 },
    zIndex: 35,
  },
]

/** Decoraciones de campo: visibles al inicio y se retiran al urbanizar. */
export const CITY_DECORATIONS: CityDecorationCatalogEntry[] = [
  {
    id: 'tree-west',
    name: 'Árbol',
    assetKey: 'tree',
    unlockWhen: { type: 'always' },
    grid: { col: 0, row: 2 },
  },
  {
    id: 'tree-east-wild',
    name: 'Árbol salvaje',
    assetKey: 'tree-tall',
    unlockWhen: { type: 'always' },
    hideAboveProgress: 70,
    grid: { col: 4, row: 1 },
  },
  {
    id: 'tree-log',
    name: 'Tronco',
    assetKey: 'tree-log',
    unlockWhen: { type: 'always' },
    hideAboveProgress: 25,
    grid: { col: 3, row: 1 },
  },
  {
    id: 'tree-trunk',
    name: 'Tocón',
    assetKey: 'tree-trunk',
    unlockWhen: { type: 'always' },
    hideAboveProgress: 15,
    grid: { col: 1, row: 4 },
  },
  {
    id: 'rock-path',
    name: 'Roca',
    assetKey: 'rock-a',
    unlockWhen: { type: 'always' },
    hideAboveProgress: 45,
    grid: { col: 0, row: 3 },
  },
  {
    id: 'rock-c',
    name: 'Roca',
    assetKey: 'rock-c',
    unlockWhen: { type: 'always' },
    hideAboveProgress: 32,
    grid: { col: 4, row: 3 },
  },
  {
    id: 'bedroll',
    name: 'Saco de dormir',
    assetKey: 'bedroll',
    unlockWhen: { type: 'always' },
    hideAboveProgress: 8,
    grid: { col: 2, row: 2 },
  },
  {
    id: 'wood-pile',
    name: 'Leña',
    assetKey: 'resource-wood',
    unlockWhen: { type: 'always' },
    hideAboveProgress: 20,
    grid: { col: 1, row: 2 },
  },
  {
    id: 'campfire',
    name: 'Fogata',
    assetKey: 'campfire-pit',
    unlockWhen: { type: 'minProgress', value: 8 },
    hideAboveProgress: 70,
    grid: { col: 1, row: 2 },
  },
  {
    id: 'barrel-store',
    name: 'Barril',
    assetKey: 'barrel',
    unlockWhen: { type: 'minProgress', value: 45 },
    grid: { col: 3, row: 1 },
  },
  {
    id: 'tree-plaza',
    name: 'Árbol de plaza',
    assetKey: 'tree-tall',
    unlockWhen: { type: 'minProgress', value: 70 },
    grid: { col: 0, row: 1 },
  },
]

export const CITY_TERRAIN: CityTerrainCatalogEntry[] = [
  {
    id: 'grass-center',
    assetKey: 'grass-large',
    unlockWhen: { type: 'always' },
    grid: { col: 2, row: 2 },
  },
  {
    id: 'grass-nw',
    assetKey: 'patch-grass',
    unlockWhen: { type: 'always' },
    grid: { col: 1, row: 1 },
  },
  {
    id: 'grass-ne',
    assetKey: 'patch-grass',
    unlockWhen: { type: 'always' },
    hideAboveProgress: 45,
    grid: { col: 3, row: 1 },
  },
  {
    id: 'grass-sw',
    assetKey: 'grass',
    unlockWhen: { type: 'always' },
    hideAboveProgress: 45,
    grid: { col: 1, row: 3 },
  },
  {
    id: 'rock-flat',
    assetKey: 'rock-flat',
    unlockWhen: { type: 'always' },
    hideAboveProgress: 25,
    grid: { col: 3, row: 3 },
  },
  {
    id: 'grass-se',
    assetKey: 'patch-grass-large',
    unlockWhen: { type: 'minProgress', value: 20 },
    grid: { col: 3, row: 3 },
  },
  {
    id: 'floor-plaza',
    assetKey: 'floor',
    unlockWhen: { type: 'minProgress', value: 45 },
    grid: { col: 2, row: 3 },
  },
  {
    id: 'rock-flat-grass',
    assetKey: 'rock-flat-grass',
    unlockWhen: { type: 'always' },
    hideAboveProgress: 15,
    grid: { col: 0, row: 1 },
  },
]
