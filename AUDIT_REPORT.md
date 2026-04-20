# Soleil-Tailwind — Auditoría Técnica (Fase 1)

## Alcance revisado
- `layout/theme.liquid`
- `tailwind.config.js`
- `assets/main.css`, `assets/theme.css`, `assets/base.css`, `assets/critical.css`
- `assets/global.js`, `assets/interactions.js`, `assets/cart-drawer.js`, `assets/header.module.js`, `assets/animations.js`
- `sections/product.liquid`, `templates/product.json`
- `snippets/product-details-table.liquid`, `snippets/product-related.liquid`
- Verificación de existencia de `snippets/product-reviews.liquid` (no existe)

---

## Hallazgos principales (resumen ejecutivo)

1. **PDP con alto acoplamiento y anti‑patterns**
   - `sections/product.liquid` contiene:
     - JS inline (2 bloques `<script>`)
     - CSS inline (`<style>` completo)
     - selectores globales sin scope robusto para múltiples instancias
   - Impacto: mantenibilidad baja, riesgo de colisiones, difícil testeo y reutilización.

2. **Inconsistencia de arquitectura Tailwind**
   - Mezcla de enfoque utility-first con CSS tradicional fuertemente acoplado.
   - `assets/base.css` incluye directivas Tailwind + estilos legacy de header.
   - `assets/main.css` también define base global extensa.
   - `assets/theme.css` compilado incluye utilidades y además estilos custom duplicados.
   - Impacto: deuda técnica, duplicación de responsabilidades, confusión de fuente de verdad de estilos.

3. **Posibles conflictos de estilos globales**
   - `assets/critical.css` aplica reset/base global.
   - `assets/theme.css` (compilado desde `main.css`) vuelve a definir resets/base.
   - `assets/base.css` también inyecta directivas Tailwind.
   - Impacto: cascada impredecible, riesgo de regresiones visuales por orden de carga.

4. **JS global con doble inicialización potencial y acoplamiento implícito**
   - `assets/global.js` (módulo) inicializa Header y CartDrawer, y además intenta ejecutar funciones globales `initAnimations` / `initInteractions` que **no están expuestas** como globals.
   - `assets/interactions.js` y `assets/animations.js` son IIFE con su propio `DOMContentLoaded`, sin contrato modular explícito.
   - Impacto: arquitectura híbrida ESM+IIFE inconsistente, difícil trazabilidad de eventos/listeners.

5. **Cart drawer con dependencia rígida de DOM**
   - `assets/cart-drawer.js` captura nodos al cargar módulo (`getElementById`) con IDs fijos (`mini-cart`, `mini-cart-items`, etc.).
   - Si snippet/markup no existe o cambia, falla funcionalmente.
   - Usa `.header__cart-btn` fijo; no hay fallback por data attributes.
   - Impacto: baja resiliencia, difícil reutilización.

6. **Snippet faltante referenciado por PDP**
   - `sections/product.liquid` hace `{% render 'product-reviews' %}` y el snippet no existe.
   - Impacto: error de render en PDP.

7. **`product-related` con lógica frágil**
   - `snippets/product-related.liquid` usa:
     - `product.collections.first.products`
     - filtro `where` con patrón no confiable para excluir producto actual
   - Riesgo de edge cases cuando producto no tiene colección o colección vacía.
   - Impacto: resultados incorrectos o nulos, UX inconsistente.

8. **Configuración de fuentes inconsistente**
   - `tailwind.config.js`: `"Spartan League"` y `"Mulish"`.
   - `layout/theme.liquid` carga Google Fonts: `League Spartan`, `Manrope`, `Playfair Display`.
   - `main.css` define variables con `League Spartan` y `Manrope`.
   - Impacto: fallback inesperado y diferencias visuales no intencionales.

9. **Detalles de calidad detectados**
   - En `theme.css`: `.announcement-bar { width: 50; }` (valor inválido sin unidad).
   - `theme.css` parece incluir bloques que no deberían editarse manualmente por ser compilado.
   - Impacto: bugs sutiles y riesgo operativo al editar artefactos compilados.

---

## Mapa de duplicaciones y solapamientos

### CSS
- **Duplicación de reset/base** entre:
  - `assets/critical.css`
  - bloque base generado por Tailwind dentro de `assets/theme.css`
  - base custom de `assets/main.css`
- **Solapamiento de utilidades/componentes**:
  - clases custom (`.container`, `.btn`, etc.) en `main.css/theme.css`
  - estilos por sección inline (PDP, mobile-menu, search-overlay, etc.)

### JS
- **Inicializaciones repetidas por `DOMContentLoaded`**:
  - `global.js`
  - `interactions.js`
  - `animations.js`
- **Modelo mixto de módulos**:
  - ESM (`global.js`, `header.module.js`, `cart-drawer.js`)
  - IIFE no exportado (`interactions.js`, `animations.js`)

### Liquid
- **Dependencias no garantizadas**:
  - Render de snippet inexistente (`product-reviews`)
  - Estructuras de markup que JS asume presentes sin validación robusta

---

## Riesgos de regresión (priorizados)

### Críticos
1. Error de render de PDP por snippet faltante `product-reviews`.
2. Refactor de PDP puede romper add-to-cart si no se preserva `form 'product'` y `name="id"` variant binding.
3. Duplicidad/orden CSS puede alterar layout global (header, spacing, typografía).

### Altos
4. Cart drawer puede dejar de abrir si cambian selectores rígidos.
5. Tabs/galería de PDP con JS inline no escalan a re-render/sections dinámicas.
6. Inconsistencia de fuentes puede alterar diseño en páginas clave.

### Medios
7. Animaciones e interacciones con listeners globales pueden causar side effects.
8. Secciones con `<style>` inline (search/mobile menu) dificultan control de prioridad CSS.

---

## Recomendaciones de arquitectura (objetivo premium modular)

1. **Definir fuente única de estilos**
   - Mantener `assets/main.css` como source de Tailwind.
   - Tratar `assets/theme.css` como artefacto compilado.
   - Reducir resets duplicados y separar claramente:
     - `@layer base`
     - `@layer components`
     - `@layer utilities`

2. **Eliminar JS/CSS inline en secciones críticas**
   - Empezar por PDP.
   - JS dedicado `assets/product.js` con init por `data-section-id`.
   - Evitar selectores globales; usar scope por sección.

3. **Unificar arquitectura JS (preferente ESM)**
   - Convertir `interactions.js` y `animations.js` a módulos con funciones exportadas.
   - Orquestar inicialización desde `global.js` de forma explícita.

4. **Robustecer snippets de PDP**
   - Crear `snippets/product-reviews.liquid` base (fallback seguro).
   - Refactor de `product-related` con lógica defensiva.

5. **Alinear tipografías y tokens**
   - Corregir `tailwind.config.js` para coincidir con fuentes realmente cargadas.
   - Estandarizar spacing/typography tokens en utilidades Tailwind.

---

## Plan de ejecución aprobado (siguiente fase)
1. Refactor modular de PDP (`sections/product.liquid` + `assets/product.js`)
2. Ajustes de snippets PDP (`product-details-table`, `product-related`, creación `product-reviews`)
3. Integración JS y limpieza progresiva
4. Testing thorough funcional **después de cada bloque**

---

## Checklist de validación para fases siguientes
- [ ] PDP render sin errores Liquid
- [ ] Variante seleccionada actualiza precio/imagen correctamente
- [ ] Add-to-cart (normal + dynamic checkout) funciona
- [ ] Tabs accesibles (estado activo, aria, teclado básico)
- [ ] Responsive móvil/tablet/desktop estable
- [ ] Cart drawer no rompe flujos existentes
- [ ] Header/search/mobile menu sin regresiones
- [ ] Sin snippets faltantes ni referencias rotas
