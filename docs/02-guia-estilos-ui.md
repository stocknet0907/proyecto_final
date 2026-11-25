# 02 — Guía de Estilos y Tokens Visuales: STOCK.NET

Esta guía documenta el inventario exhaustivo de tokens visuales extraídos del prototipo canónico (`/prototipo/stock.net_inventory_management/DESIGN.md`) y su implementación formal con Tailwind CSS.

---

## 1. Filosofía de Diseño: *Structured Functional Modernism*

La interfaz de **STOCK.NET** está orientada a operaciones de alta densidad de información (almacenes, bodegas, terminales POS y auditoría contable). El sistema prioriza:
- **Reducción de Fatiga Visual:** Fondo cálido no deslumbrante (`#FCF9F3`) que sustituye los blancos puros brillantes.
- **Estructura Arquitectónica:** Uso de azul pizarra (`#4A6B8A`) para anclar la navegación, divisiones de módulo y cabeceras de tablas.
- **Acento Cinético Focalizado:** Ámbar mostaza (`#E6A017`) reservado exclusivamente para los llamados a la acción de mayor valor operativo (*Cobrar*, *Agregar Producto*, *Nueva Orden*).
- **Legibilidad Numérica:** Fuentes de ancho numérico tabular (`tabular-nums`) para evitar desfases visuales en balances y listas de existencias.

---

## 2. Paleta Cromática y Tokens Hexadecimales

### 2.1 Superficies y Lienzos (Canvas)
| Token Tailwind | Código HEX | Rol Semántico |
| :--- | :--- | :--- |
| `bg-surface` | `#FCF9F3` | Fondo global de la aplicación (Warm Canvas). |
| `bg-surface-lowest` | `#FFFFFF` | Fondo de tarjetas, tablas, modales e inputs. |
| `bg-surface-container` | `#F0EEE7` / `#F4EFE6` | Paneles de filtrado, barras de herramientas y drawer lateral. |
| `bg-surface-high` | `#EAE8E2` | Filas alternas y elementos en reposo. |
| `bg-surface-highest` | `#E5E2DC` | Bordes divisorios y estados deshabilitados. |

### 2.2 Color Primario (Estructura y Jerarquía)
| Token Tailwind | Código HEX | Rol Semántico |
| :--- | :--- | :--- |
| `bg-primary` / `text-primary` | `#4A6B8A` | Color insignia: sidebar, cabeceras de tabla, botones de navegación. |
| `bg-primary-dark` | `#354D63` | Hover en botones primarios y pestañas activas. |
| `bg-primary-light` | `#E9EFF5` | Fila seleccionada, fondo de chips primarios. |
| `bg-primary-fixed` | `#CEE5FF` | Badges de categoría destacada. |

### 2.3 Color Secundario y Acento (Acciones Principales)
| Token Tailwind | Código HEX | Rol Semántico |
| :--- | :--- | :--- |
| `bg-secondary` / `text-secondary` | `#E6A017` | Botón principal de acción (CTA POS, Guardar, Registrar). |
| `bg-secondary-hover` | `#C58913` | Estado hover del botón secundario. |
| `bg-secondary-amber` | `#FCB32E` | Advertencias destacadas y marcadores de atención. |
| `bg-secondary-light` | `#FFDDAF` | Fondo de selección de texto y badges de alerta moderada. |

### 2.4 Tipografía e Ink (Texto)
| Token Tailwind | Código HEX | Rol Semántico |
| :--- | :--- | :--- |
| `text-ink` / `text-ink-base` | `#1C1C18` / `#2E2E2A` | Texto principal, cifras numéricas y títulos (contraste > 11:1). |
| `text-ink-muted` | `#5C5C56` | Metadatos, etiquetas secundarias, SKUs y timestamps. |
| `text-ink-variant` | `#42474D` | Descripciones secundarias y encabezados de bloque. |

### 2.5 Estados del Sistema (Feedback Visual)
| Estado | Texto | Fondo (15% tint) | Borde | Aplicación |
| :--- | :--- | :--- | :--- | :--- |
| **Success** | `#2D7A4D` | `#EAF4EE` | `#A3D9B5` | Stock óptimo, venta completada, crédito saldado. |
| **Warning** | `#D97706` | `#FDF6E9` | `#F5D28A` | Stock bajo umbral de seguridad, crédito por vencer. |
| **Error / Danger** | `#C93D33` | `#FCECEB` | `#F5B5B0` | Agotado, cliente en mora, intentos fallidos bloqueados. |
| **Info** | `#2B6CB0` | `#E9EFF5` | `#A8CAED` | Órdenes en tránsito, avisos informativos. |

---

## 3. Tipografía

El proyecto utiliza dos familias tipográficas con funciones bien diferenciadas:

### 3.1 `Montserrat` (Display & Encabezados Estructurales)
- Utilizada en: Nombre de la aplicación, títulos H1 a H3, números de tarjetas KPI y paneles modales.
- Clases Tailwind: `font-display font-bold` / `font-semibold`.
- Escalas:
  - `H1`: 28px (`text-[28px] leading-[36px] tracking-tight`)
  - `H2`: 22px (`text-[22px] leading-[28px]`)
  - `H3`: 18px (`text-[18px] leading-[24px]`)

### 3.2 `Inter` (Cuerpo, Datos, Formularios y Tablas)
- Utilizada en: Todo el contenido tabular, formularios, botones, badges y avisos.
- Clases Tailwind: `font-sans`.
- Escalas:
  - `body-lg`: 16px (`text-base leading-6`)
  - `body-base`: 14px (`text-sm leading-5`)
  - `body-sm`: 12px (`text-xs leading-4`)
  - `caption`: 10px (`text-[10px] leading-[14px] uppercase tracking-wider`)
- **Regla Numérica:** Todos los importes y cantidades usan `font-mono tabular-nums font-medium`.

---

## 4. Componentes Compartidos (`src/shared/components/`)

### 4.1 Botones (`Button.jsx`)
- **`primary`:** Fondo `#4A6B8A`, texto blanco, bordes 4px, hover `#354D63`.
- **`secondary`:** Fondo `#E6A017`, texto `#1C1C18` en negrita, hover `#C58913`.
- **`outline`:** Fondo transparente, borde 1px `#D1C7B7`, texto `#2E2E2A`, hover `#F0EEE7`.
- **`danger`:** Fondo `#C93D33`, texto blanco, hover `#A81515`.
- **`ghost`:** Sin fondo ni borde, hover suave para acciones de fila en tablas.

### 4.2 Campos de Entrada (`Input.jsx`, `Select.jsx`)
- Altura estándar de 38px a 40px con borde de 1px `#D1C7B7` y fondo `#FFFFFF`.
- Al recibir foco (`focus:ring-2 focus:ring-primary focus:border-transparent`).
- Soporte para prefijos integrados (ícono de lupa, prefijo `$`, lector de código de barras).

### 4.3 Tablas de Datos (`Table.jsx`)
- Cabecera sólida en Slate Blue `#4A6B8A` con texto blanco, o neutro `#F0EEE7` con texto en mayúsculas pequeñas.
- Filas alternadas suaves (`hover:bg-[#E9EFF5]` para máxima precisión visual al pasar el cursor).
- Alineación estricta: textos a la izquierda, badges al centro, montos y existencias a la derecha.

### 4.4 Modales (`Modal.jsx`)
- Centrado en pantalla con fondo oscurecido (`bg-black/50 backdrop-blur-sm`).
- Esquinas superiores redondeadas a 12px (`rounded-xl`).
- Cierre mediante botón de cruz (X), clic fuera del contenedor o tecla `Escape`.

### 4.5 Estados Vacíos (`EmptyState.jsx`)
- Gráficos SVG discretos con ícono de `lucide-react`.
- Título explicativo en `Montserrat` y descripción técnica en `Inter`.
- Botón de acción para invocar la creación del primer registro.
