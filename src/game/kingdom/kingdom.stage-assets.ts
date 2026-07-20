/**
 * Ilustraciones del reino: una imagen completa por etapa (no por objeto).
 * Sustituye la imagen aquí para reemplazar el arte de una etapa sin tocar
 * ninguna otra parte del sistema.
 */

import stageBaldio from '@/assets/kingdom/stages/stage-baldio.png'
import stageCampamento from '@/assets/kingdom/stages/stage-campamento.png'
import stageAldea from '@/assets/kingdom/stages/stage-aldea.png'
import stageVilla from '@/assets/kingdom/stages/stage-villa.png'
import stageCiudad from '@/assets/kingdom/stages/stage-ciudad.png'
import stageReino from '@/assets/kingdom/stages/stage-reino.png'

const KINGDOM_STAGE_IMAGES: Record<string, string> = {
  baldio: stageBaldio,
  campamento: stageCampamento,
  aldea: stageAldea,
  villa: stageVilla,
  ciudad: stageCiudad,
  reino: stageReino,
}

export function resolveKingdomStageImage(imageKey: string): string {
  return KINGDOM_STAGE_IMAGES[imageKey] ?? stageBaldio
}
