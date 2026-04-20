# TODO - Soleil Tailwind Audit & Refactor

## Fase 1: Auditoría profunda inicial
- [x] Revisar `layout/theme.liquid`
- [x] Revisar `tailwind.config.js`
- [x] Revisar CSS base: `assets/main.css`, `assets/theme.css`, `assets/base.css`, `assets/critical.css`
- [x] Revisar JS principal: `assets/global.js`, `assets/interactions.js`, `assets/cart-drawer.js`, `assets/header.module.js`, `assets/animations.js`
- [x] Revisar secciones/snippets clave: PDP, header, cart drawer, search, collections
- [x] Documentar mapa de duplicaciones, anti-patterns, acoplamientos y riesgos de regresión

## Fase 2: PDP premium modular (prioridad alta)
- [x] Refactor `sections/product.liquid` a enfoque Tailwind-first sin CSS/JS inline
- [x] Crear `assets/product.js` con inicialización por `data-section-id`
- [x] Integrar lógica de galería, variantes y tabs de forma desacoplada
- [x] Mover estilos necesarios a organización coherente (`@layer`/utilidades)

## Fase 3: Snippets PDP y dependencias
- [x] Verificar/crear `snippets/product-reviews.liquid`
- [x] Ajustar `snippets/product-details-table.liquid`
- [x] Ajustar `snippets/product-related.liquid` (si aplica)
- [x] Alinear semántica, consistencia visual y Tailwind

## Fase 4: Auditoría integral de secciones/snippets restantes
- [x] Auditar header, cart drawer, search, collection grids, home sections
- [x] Detectar estandarizaciones de spacing/typography y modularización

## Fase 5: JS global e integración/performance
- [x] Revisar modularidad y side effects en JS global
- [x] Eliminar listeners duplicados y mejorar previsibilidad

## Fase 6: Testing thorough por fases
- [ ] Testing thorough PDP
- [ ] Testing thorough Home
- [ ] Testing thorough Colecciones
- [ ] Testing thorough Cart drawer
- [ ] Testing thorough Header/Búsqueda
- [ ] Testing thorough de todas las secciones impactadas
