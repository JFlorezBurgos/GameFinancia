# Reino Financiero

PWA gamificada de finanzas personales. Convierte ingresos, gastos y metas de ahorro en progreso de un reino (XP, niveles, medallas y ciudad).

## Stack

- Vue 3 + TypeScript + Vite
- Pinia + Vue Router + VueUse
- Tailwind CSS 4
- Dexie (IndexedDB)
- PWA (vite-plugin-pwa)

## Scripts

```bash
npm install
npm run dev      # desarrollo
npm run build    # producción
npm run preview  # preview del build
npm run lint     # ESLint
npm run format   # Prettier
```

## Arquitectura

```
src/
  assets/         Estilos y recursos estáticos
  components/     UI reutilizable (ui/, game/, layout/)
  views/          Pantallas
  layouts/        Layouts de app
  router/         Vue Router
  stores/         Pinia (orquestación)
  composables/    Lógica reutilizable de UI
  services/       Infraestructura (DB, futuro Supabase)
  game/           Dominio puro (sin Vue): xp, levels, city...
  types/          Tipos compartidos
  utils/          Utilidades puras
```

## Fases

- **Fase 1** ✅ Fundación, PWA, design system, app shell
- **Fase 2** ✅ Finanzas core (ingresos/gastos + IndexedDB)
- **Fase 3** ✅ Motor de juego (XP, niveles, eventos)
- **Fase 4** ✅ Metas y presupuesto
- **Fase 5** ✅ Medallas y rachas
- **Fase 6** ✅ Mi Ciudad (capa visual isométrica + CityProgressEngine)
- **Fase 7** — Misiones y pulido
- **Fase 8** — Vista 3D opcional (TresJS)

## Mi Reino

Capa visual de patrimonio neto (no XP, no cantidad de registros).

- `KingdomEngine` en `src/game/kingdom/` — puro, desacoplado de Vue
- Objetos aditivos con `requiredBalance` en `kingdom.catalog.ts`
- Assets en `src/assets/kingdom/` (+ placeholders SVG intercambiables)
- UI: diorama + timeline de evolución (estilo mockup)

**Kenney Survival Kit (actual):** terreno, árboles, rocas, cercas, estructuras básicas.  
**Faltan para el mockup final:** casas medievales, mercado, molino, castillo, murallas elaboradas.  
Recomendado complementar con [Castle Kit](https://kenney.nl/assets/castle-kit) o [Isometric Tiles Buildings](https://kenney.nl/assets/isometric-tiles-buildings) — solo hay que mapear claves en `kingdom.assets.ts`.

Preview: `/preview/reino`

## Assets Kenney

Los modelos 3D están en `kenney_survival-kit/` (licencia CC0). Las previews PNG se usarán en Fase 6 para la ciudad isométrica 2D; los GLB en Fase 8 para vista 3D.
# GameFinancia
