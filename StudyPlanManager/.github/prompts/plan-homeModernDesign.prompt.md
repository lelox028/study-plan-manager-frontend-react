# Plan: Reestructurar Home.js con diseño moderno (Dark Mode Only)

## TL;DR
Replicate el diseño moderno mostrado en el HTML (sidebar + main grid de facultades). Solo dark mode. Cambios SIGNIFICATIVOS en estructura JSX de Home.js: 
- Actualmente: muestra todas las universidades en una lista expandible
- Nuevo: muestra UNA universidad seleccionada con sus facultades en un grid de cards visual

Se usarán variables de globalStyles.module.scss y nuevas variables reutilizables, todas optimizadas para dark mode únicamente.

## Steps

### ⚠️ CAMBIOS ESTRUCTURALES IMPORTANTES EN JSX/COMPONENTES

**Nota sobre datos disponibles**:
- Facultades NO tienen imagen_url ni fecha_establecimiento
- Carreras sí tienen: nombreC, duracion, fechaInscripcion, tituloIntermedio (opcional)
- Se adapta el diseño para funcionar SIN modificar BD (ver decisiones de diseño abajo)

**ESTRUCTURA ACTUAL (Home.js)**:
```
Body
├── TopBar
└── Container
    ├── SidebarHome (muestra universidades expandibles)
    └── Main
        ├── Title ("Study Plan Manager v0.0.1")
        ├── Description (párrafos estáticos)
        └── Data (lista de universidades expandibles)
            ├── Universidad 1
            │   └── Facultades (árbol jerárquico)
            └── Universidad 2
                └── Facultades (árbol jerárquico)
```

**ESTRUCTURA NUEVA REQUERIDA (como en el HTML referencia)**:
```
Body
├── TopBar (IdénIco)
└── Container
    ├── SidebarHome (CAMBIO: muestra jerarquía universidad > facultades > carreras)
    │   └── El item seleccionado en sidebar → resaltado
    │       (ej: si selecciono "Faculty 1", se ve con estilos de selected)
    └── Main (CAMBIO: mostrar UNA universidad/facultad seleccionada con grid de cards)
        ├── Breadcrumb + Header section
        │   ├── Universidad navegación/selector
        │   ├── Title: "Faculties" o "Careers" (según nivel)
        │   ├── Description
        │   └── Add New button
        ├── Tabs (cuando estoy en nivel Facultades)
        └── Grid de Cards
            ├── Si vista == "Facultades": Faculty Cards
            │   └── Click en card → selecciona facultad → sidebar reflejado + cards cambian a carreras
            ├── Si vista == "Carreras": Career Cards
            │   └── Click en card → selecciona carrera → abre detail (o lo que hagas)
            └── "Add New" card siempre visible
```

**FLUJO DE ESTADO SINCRONIZADO**:
1. **Universidad seleccionada** → muestra facultades en cards + facultades en sidebar
2. **Click en card de facultad** → 
   - Actualiza `activeUni` (si cambió) + `activeFacu` (nueva selección)
   - Sidebar refleja la nueva facultad seleccionada (con estilo highlighted)
   - Main content cambia a mostrar carreras de ESA facultad
3. **Click en item facultad en sidebar** → 
   - Actualiza `activeFacu`
   - Cards en main cambian a mostrar carreras de esa facultad
   - Cards visualmente reflejan el cambio
4. **Click en card de carrera** → abre detail de carrera (sin cambiar facultad seleccionada en sidebar)

**CAMBIOS CONCRETOS EN JSX**:
1. El `.Data` section que muestra universidades expandibles → REEMPLAZAR con grid dinámico:
   - Si `activeUni` seleccionada y `activeFacu` NO seleccionada → mostrar grid de FACULTADES
   - Si `activeUni` seleccionada y `activeFacu` seleccionada → mostrar grid de CARRERAS
   - Si nada seleccionado → mostrar message "Select a university"
2. Agregar navigation/breadcrumb dinámico mostrando qué está seleccionado
3. Agregar tabs SOLO cuando estamos viendo facultades (no cuando vemos carreras)
4. **SINCRONIZACIÓN DE ESTADO**: El sidebar y las cards deben ser dos vistas del mismo estado:
   - `activeUni` y `activeFacu` son la fuente de verdad
   - Click en sidebar → actualiza variables de estado → cards se re-renderizan
   - Click en card → actualiza variables de estado → sidebar refleja el cambio
   - El sidebar visualmente resalta el item actualmente seleccionado (con estilos de "active")
5. Las funciones de crear/eliminar facultades y carreras deben mantener sincronización de estado

### Fase 1.5: State Management (NUEVO)
Define la lógica de sincronización:
- `activeUni` (seleccionada) → visible en sidebar + breadcrumb + header
- `activeFacu` (seleccionada) → visible en sidebar + breadcrumb (si aplica) + determina qué carreras mostrar
- Cuando `activeFacu` cambia → refrescar grid de carreras
- Sidebar item ACTIVO tiene clase CSS `.active` para resaltado visual
- Cards tienen click handler que actualiza estado directamente (no navega a página nueva)
*Dependencies: Fase 1, 2*

### Fase 1: Variables de Colores en globalStyles.module.scss (DARK MODE ONLY)
1. Eliminar TODAS las referencias a light mode (bg-light, colores claros)
2. Agregar variables exclusively para dark mode:
   - Background colors: backgrounds oscuros, borders sutiles
   - Text colors: usando valores de dark mode solo
   - Hover states: oscuros, sutiles
   - Sombras y borders para dark mode
3. Agregar variables de spacing y radiuses (reutilizables en múltiples módulos)
4. Agregar variables para tipografía (font-weights, sizes)
5. Agregar variables de transiciones suaves
*Dependencies: NONE*

### Fase 2: Reestructurar Body y Container
1. Update `.Body` para usar flexbox vertical correcto (header full-width, luego flex row para sidebar + main)
2. Update `.Container` para distribuir sidebar (fixed width) y main (flex: 1)
3. Aplicar estilos de background correcto según design

### Fase 3: Estilizar Sidebar
1. Update `SideBarMain`, `SideBarMainTitle`, `SideBarMainContent` con typography correcta
2. Update `SideBarItem` para mostrar items de la jerarquía con estilos por nivel
3. Update `SideBarItemContainer` para bordes y indentación visual
4. Agregar academic progress section si aplicable
*Depends on: Fase 1, 2*

### Fase 4: Reestructurar Main Content (DINÁMICO)
1. Reemplazar `.Title`, `.Description`, `.Data` con estructura dinámica:
   - **Vista 1 (si `activeUni` existe pero `activeFacu` = null)**: Mostrar Facultades
     - Breadcrumb: "Universidad X > [Faculties]"
     - Title: "Faculties"
     - Description: "Manage and organize the academic departments..."
     - Tabs: "Faculties" (active) | "All Careers"
     - Grid: Faculty Cards (con onClick que selecciona facultad)
   - **Vista 2 (si `activeFacu` existe)**: Mostrar Carreras
     - Breadcrumb: "Universidad X > Facultad Y > [Careers]"
     - Title: "Careers"
     - Description: dinámico según facultad
     - NO mostrar tabs (o mostrar tabs si quieres volver a facultades)
     - Grid: Career Cards (con onClick que abre detail)
   - **Vista 0 (si nada seleccionado)**: Empty state
     - Message: "Select a university from the sidebar"
2. Crear estilos para breadcrumb/header section (dinámicos según nivel)
3. Crear estilos para grid de cards (reutilizable para facultades y carreras)
4. Agregar estilos para tabs de navegación (SOLO en vista de facultades)
*Depends on: Fase 1, 2, 1.5*

### Fase 5: Estilizar Cards (Facultades y Carreras)
1. Crear clase `.Card` (reutilizable para Faculty Cards y Career Cards)
2. Crear clase `.CardHeader` con imagen y botones (edit, delete)
3. Crear clase `.CardBody` con titulo, descripción, metadata
4. Crear clase `.CardFooter` con información adicional
5. Update grid responsive (1 col mobile, 2 tablet, 3-4 desktop)
6. Agregar click handler a `.Card` que:
   - Si es Faculty Card → actualiza `activeFacu` state
   - Si es Career Card → puede navegar o actualizar estado según necesites
7. Estilo `.Card.active` para cuando está seleccionada (si aplica)
*Depends on: Fase 1, 4*

## Relevant files
- `src/dist/globalStyles.module.scss` — agregar variables de color, spacing, tipografía
- `src/dist/home.module.scss` — reestructurar todas las clases para nuevo layout
- `src/Pages/Home.js` — posibles ajustes menores de className si es necesario

## Verification
1. ✅ Sidebar aparece a la izquierda con ancho fijo (288px)
2. ✅ Main content ocupa resto del espacio y es scrollable
3. ✅ Dark mode aplicado vía variables (sin light mode)
4. ✅ **Faculty Cards**:
   - Cada facultad tiene un color sólido único (determinista por nombre)
   - Icon "account_balance" en blanco sobre color
   - Título: nombre_F
   - Footer: "X Careers" (conteo de carreras.length)
   - Edit/Delete buttons en overlay esquina superior
5. ✅ **Career Cards** (cuando facultad seleccionada):
   - Color sólido (heredado de facultad padre)
   - Icon "school"
   - Título: nombreC
   - Metadata: duracion, tituloIntermedio (si existe), año de fechaInscripcion
6. ✅ **Click en faculty card**: 
   - Card se selecciona (estilo visual)
   - Sidebar refleja la facultad como "activa/seleccionada" (resaltada)
   - Main content cambia a mostrar carreras de esa facultad
7. ✅ **Click en item de facultad en sidebar**:
   - Facultad se marca como activa en sidebar
   - Cards en main cambian a mostrar carreras de esa facultad
   - State sincronizado (no hay inconsistencias)
8. ✅ Hover effects en items y cards
9. ✅ Funcionalidad CRUD intacta (agregar/eliminar universidades, facultades, carreras)
10. ✅ NO hay estados inconsistentes: sidebar ↔ cards siempre sincronizados
11. ✅ Breadcrumb dinámico: "Uni > " o "Uni > Facultad >"
12. ✅ Fallbacks: facultad sin carreras, carrera sin tituloIntermedio, etc

## Decisions
- **Dark mode only**: Eliminar TODA la lógica de light/dark mode switching. Solo dark mode.
- **Cambios JSX significativos**: No solo estilos, sino estructura JSX completa en Main content
- **Usar SCSS modules**, no Tailwind
- **Priorizar variables en globalStyles.module.scss** para reutilización entre módulos
- Colors: mantener `$accent: #136dec` como primary color
- Mantener funcionalidad CRUD (crear/eliminar universidades, facultades, carreras) intacta
- **Cambios de componentes**: SidebarHome permanece similar, pero Main content se reestructura completamente

## Decisiones de Diseño Pragmático (Sin BD Changes)

### 1. IMÁGENES DE FACULTADES
**Problema**: Las facultades no tienen campo `image_url` en BD
**Solución**: 
- Usar un **color sólido/gradiente por facultad** basado en hash del nombre
- Cada facultad tiene un color único determinista (mismo nombre = mismo color siempre)
- Implementar función `getColorForFaculty(facultyName)` que devuelve color hex
- Mostrar icono material "account_balance" en blanco sobre el color

**Pseudocódigo**:
```js
const getColorForFaculty = (nombre_F) => {
  // Hash simple del nombre → número 0-N
  // Seleccionar de array de colores predefinidos
  const colors = ['#136dec', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899', '#06b6d4'];
  const index = nombre_F.charCodeAt(0) % colors.length;
  return colors[index];
}
// Usar: <div style={{ backgroundColor: getColorForFaculty(facultad.nombre_F) }} />
```

### 2. FECHA/METADATA DE FACULTADES 
**Problema**: Las facultades no tienen fecha_establecimiento
**Solución**: 
- En lugar de mostrar "Established: Sep 1985"
- Mostrar **"Number of Careers: X"** (conteo directo de `facultad.carreras.length`)
- Más útil y disponible con datos actuales

**En Faculty Card Footer**:
```
Icon: school | Text: "X Careers" (donde X = facultad.carreras.length)
```

### 3. CAREER CARDS - QUÉ MOSTRAR
**Datos disponibles**: nombreC, duracion, fechaInscripcion, tituloIntermedio
**Mostrar**:
- **Titulo**: nombreC
- **Metadata línea 1**: "Duration: X years" (duracion)
- **Metadata línea 2**: "Título Intermedio: XXX" (si tituloIntermedio existe)
- **Año de inscripción**: Formato año extraído de fechaInscripcion (ej: "2024")

**En Career Card**:
```
[Color header similar a facultad padre]
[Icon: school]
---
Título: Licenciatura en Informática
Duración: 5 años
Título Intermedio: Analista Universitario (si existe)
Año: 2024
```

### 4. FALLBACKS Y EDGE CASES
- **Facultad sin carreras**: Grid vacío + mensaje "No careers yet" + "Add Career" button
- **Carrera sin tituloIntermedio**: No mostrar esa línea, leave it empty
- **fechaInscripcion mal formateada**: Fallback a "N/A"

## Design Details from Reference HTML

### Header/TopBar
- Full-width header con flex row (logo + user info + logout)
- Border-bottom subtle
- Background bg-white en light mode, dark en dark mode

### Sidebar
- Width: 288px (w-72)
- Border-right subtle
- Padding: 16px (p-4)
- Flex column con gap-6
- Scrollable con overflow-y-auto
- Section: "University Hierarchy" con h3 uppercase, small, muted color
- Sidebar Items:
  - Level 1 (Universidad): bg-primary/10, text-primary, border border-primary/20
  - Level 2-3: hover:bg-slate-100, text-slate-700, transparent background
  - Add buttons: opacity-0 by default, opacity-1 on hover
  - Indentation con border-left-2 y margin-left

### Main Content
- Flex-1, overflow-y-auto
- Padding: 32px (p-8)
- Max-width container: 96rem (max-w-6xl)

### Header Section (mostrando universidad seleccionada)
- Breadcrumb: icon + "Stanford University" (text-xs uppercase, text-primary)
- Title: "Faculties" (text-4xl, font-black)
- Description: paragraph (text-base, max-w-lg)
- Add button: bg-primary, text-white, hover:bg-primary/90

### Tabs de navegación
- Border-bottom-2 con border-primary en active
- Flex gap-8
- Text-sm, font-bold
- Badge con contador: bg-primary/10, text-primary

### Grid de Facultades
- Grid responsive: grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6
- Card: bg-white/dark, border, rounded-xl, hover:border-primary/50, hover:shadow-md
- Card Header Image: h-32, bg-center bg-cover
- Image buttons (edit/delete): size-8, bg-white/90, rounded-lg, absolute top-3 right-3
- Card Body: p-5
  - Title: font-bold, text-lg
  - Subtitle: text-xs, text-slate-500 (fechas)
  - Footer: flex justify-between, border-t, con icon + metadata

### Add Button Card
- Border-2 border-dashed
- Flex column items-center justify-center
- Hover: border-primary, bg-primary/5
- Icon: size-12, rounded-full, bg-slate-100, group-hover:bg-primary

## Color Scheme Reference
```
Primary: #136dec
Background Dark ONLY: #101822
Dark surfaces: #1a1f2e
Borders OSC: #2a3140
Text subtle: #94a3b8
Text default: #e2e8f0
(Todos los valores extraídos del dark mode únicamente)
```

## ⚠️ PREGUNTAS CRÍTICAS SOBRE BACKEND Y ESTRUCTURA DE DATOS

Antes de proceder con la implementación, necesito aclaraciones EXACTAS sobre:

### 1. IMÁGENES DE FACULTADES
- **Pregunta**: ¿Las facultades tienen un campo de imagen en la base de datos?
- **Necesito saber**: 
  - ¿Cuál es el nombre del campo? (ej: `image_url`, `thumbnail`, `coverImage`)
  - ¿Cómo se almacena? (URL completa, ruta relativa, blob)
  - ¿Qué endpoint las proporciona?
  - ¿Qué hacer si una facultad no tiene imagen? (usar placeholder, color por defecto)
- **Referencia HTML**: Las cards tienen imágenes de 128px de alto (h-32) como background-image

### 2. FECHA DE ESTABLECIMIENTO
- **Pregunta**: ¿Las facultades tienen un campo de fecha de establecimiento?
- **Necesito saber**:
  - ¿Cuál es el nombre del campo en el model? (ej: `established_date`, `createdAt`, `founded_year`)
  - ¿Qué formato tiene? (YYYY-MM-DD, timestamp, solo año)
  - ¿Cómo debo formatearlo para mostrar? (ej: "Sep 1985", "September 1985", "1985")
- **Referencia HTML**: "Established: Sep 1985"

### 3. ESTRUCTURA DE DATOS ACTUAL
**Mostrame exactamente**:
```
{
  universidades: [
    {
      id_Universidad: number,
      nombre_Universidad: string,
      ??? (otros campos)
    }
  ],
  facultades: [
    {
      id_F: number,
      nombreF: string,
      id_Universidad: number (FK),
      ??? (otros campos - ¿image?, ¿established_date?)
    }
  ],
  carreras: [
    {
      id_C: number,
      nombreC: string,
      id_F: number (FK),
      ??? (otros campos)
    }
  ]
}
```

### 4. ENDPOINTS DE BACKEND
**Preciso ubicación exacta**:
- ¿Dónde se cargan las universidades? (GET endpoint)
- ¿Dónde se cargan las facultades de una universidad? (GET endpoint - ¿por ID_UNIVERSIDAD?)
- ¿Dónde se cargan las carreras de una facultad? (GET endpoint - ¿por ID_F?)
- ¿Los endpoints actuales ya incluyen los campos de imagen y fecha establecimiento, o necesitan agregarse en el backend?

### 5. LÓGICA DE CARGA DE DATOS
**Pregunta**: En el nuevo diseño:
- Cuando selecciono una universidad → cargar facultades de SOLO esa universidad ¿correctamente?
- Cuando hago click en una facultad (para verla en detail) → cargar carreras de esa facultad ¿correctamente?
- ¿Necesito cambiar los endpoints o la lógica de React, o ambos?

### 6. CAMPO DE "CARRERAS POR FACULTAD" EN LA CARD
- **Pregunta**: Las cards muestran "12 Careers", "8 Careers", etc.
- **Necesito saber**: ¿Es un contador de carreras relacionadas, o es un campo almacenado en BD?
- **Referencia HTML**: Badge con número en footer de la card

### 7. OPERACIONES CRUD
- ¿Se mantienen iguales los endpoints para crear/actualizar/eliminar?
- ¿La creación de una nueva facultad requiere campos adicionales? (ej: imagen, fecha)
- ¿La creación de una nueva carrera requiere campos adicionales?
- ¿Hay validaciones que cambie?

## Datos Disponibles (Confirmado)

**Endpoint**: GET `/universidades`

**Estructura JSON**:
```
[
  {
    id_Universidad: number,
    nombre_Universidad: string,
    facultades: [
      {
        id_F: number,
        nombre_F: string,  // ← Usar para nombre en card
        carreras: [
          {
            id_C: number,
            nombreC: string,  // ← Nombre completo carrera
            fechaInscripcion: ISO8601 string,  // ← Extraer año
            duracion: number,  // ← Mostrar como "X años"
            tituloIntermedio: string|null,  // ← Mostrar si existe
            plan: null
            facultad: { ... }  // ← Redundante pero presente
          }
        ]
      }
    ]
  }
]
```

**Decisiones ejecutadas sin BD changes**:
1. ✅ Sin image_url en facultades → usar color sólido/gradiente por nombre
2. ✅ Sin fecha_establecimiento → mostrar "X Careers" (conteo de carreras)
3. ✅ Career cards con nombreC, duracion, tituloIntermedio, año de inscripción

**Listos para proceder a implementación**. ¿Comienzo con Fase 1 (globalStyles variables)?
