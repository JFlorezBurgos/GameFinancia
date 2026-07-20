/**
 * Registro de assets de la ciudad.
 * Añade nuevas claves aquí al incorporar PNG en `src/assets/city/`.
 */

import placeholderUrl from '@/assets/city/placeholders/building.svg'

import tent from '@/assets/city/buildings/tent.png'
import chest from '@/assets/city/buildings/chest.png'
import workbench from '@/assets/city/buildings/workbench.png'
import workbenchAnvil from '@/assets/city/buildings/workbench-anvil.png'
import structure from '@/assets/city/buildings/structure.png'
import structureMetal from '@/assets/city/buildings/structure-metal.png'
import campfireStand from '@/assets/city/buildings/campfire-stand.png'
import signpost from '@/assets/city/buildings/signpost.png'
import fence from '@/assets/city/buildings/fence.png'
import fenceFortified from '@/assets/city/buildings/fence-fortified.png'

import grass from '@/assets/city/terrain/grass.png'
import grassLarge from '@/assets/city/terrain/grass-large.png'
import patchGrass from '@/assets/city/terrain/patch-grass.png'
import patchGrassLarge from '@/assets/city/terrain/patch-grass-large.png'
import floor from '@/assets/city/terrain/floor.png'
import rockFlatGrass from '@/assets/city/terrain/rock-flat-grass.png'
import rockFlat from '@/assets/city/terrain/rock-flat.png'

import tree from '@/assets/city/decorations/tree.png'
import treeTall from '@/assets/city/decorations/tree-tall.png'
import treeLog from '@/assets/city/decorations/tree-log.png'
import treeTrunk from '@/assets/city/decorations/tree-trunk.png'
import rockA from '@/assets/city/decorations/rock-a.png'
import rockB from '@/assets/city/decorations/rock-b.png'
import rockC from '@/assets/city/decorations/rock-c.png'
import barrel from '@/assets/city/decorations/barrel.png'
import campfirePit from '@/assets/city/decorations/campfire-pit.png'
import bedroll from '@/assets/city/decorations/bedroll.png'
import resourceWood from '@/assets/city/decorations/resource-wood.png'

const CITY_ASSET_MAP: Record<string, string> = {
  tent,
  chest,
  workbench,
  'workbench-anvil': workbenchAnvil,
  structure,
  'structure-metal': structureMetal,
  'campfire-stand': campfireStand,
  signpost,
  fence,
  'fence-fortified': fenceFortified,
  grass,
  'grass-large': grassLarge,
  'patch-grass': patchGrass,
  'patch-grass-large': patchGrassLarge,
  floor,
  'rock-flat-grass': rockFlatGrass,
  'rock-flat': rockFlat,
  tree,
  'tree-tall': treeTall,
  'tree-log': treeLog,
  'tree-trunk': treeTrunk,
  'rock-a': rockA,
  'rock-b': rockB,
  'rock-c': rockC,
  barrel,
  'campfire-pit': campfirePit,
  bedroll,
  'resource-wood': resourceWood,
}

export function resolveCityAssetUrl(assetKey: string): string {
  return CITY_ASSET_MAP[assetKey] ?? placeholderUrl
}

export function hasCityAsset(assetKey: string): boolean {
  return Boolean(CITY_ASSET_MAP[assetKey])
}

export const CITY_ASSET_PLACEHOLDER = placeholderUrl
