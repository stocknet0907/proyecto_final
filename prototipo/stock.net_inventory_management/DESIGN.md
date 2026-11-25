---
name: Stock.net Inventory Management
colors:
  surface: '#fcf9f3'
  surface-dim: '#dcdad4'
  surface-bright: '#fcf9f3'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3ed'
  surface-container: '#f0eee7'
  surface-container-high: '#eae8e2'
  surface-container-highest: '#e5e2dc'
  on-surface: '#1c1c18'
  on-surface-variant: '#42474d'
  inverse-surface: '#31312d'
  inverse-on-surface: '#f3f0ea'
  outline: '#73777e'
  outline-variant: '#c2c7ce'
  surface-tint: '#406180'
  primary: '#315371'
  on-primary: '#ffffff'
  primary-container: '#4a6b8a'
  on-primary-container: '#d8eaff'
  inverse-primary: '#a8caed'
  secondary: '#805600'
  on-secondary: '#ffffff'
  secondary-container: '#fcb32e'
  on-secondary-container: '#6b4800'
  tertiary: '#6a4a19'
  on-tertiary: '#ffffff'
  tertiary-container: '#85622f'
  on-tertiary-container: '#ffe5c5'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#cee5ff'
  primary-fixed-dim: '#a8caed'
  on-primary-fixed: '#001d32'
  on-primary-fixed-variant: '#274967'
  secondary-fixed: '#ffddaf'
  secondary-fixed-dim: '#ffba44'
  on-secondary-fixed: '#281800'
  on-secondary-fixed-variant: '#614000'
  tertiary-fixed: '#ffddb3'
  tertiary-fixed-dim: '#ecbf83'
  on-tertiary-fixed: '#291800'
  on-tertiary-fixed-variant: '#5f4110'
  background: '#fcf9f3'
  on-background: '#1c1c18'
  surface-variant: '#e5e2dc'
typography:
  headline-1:
    fontFamily: Montserrat
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-1-mobile:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-2:
    fontFamily: Montserrat
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-3:
    fontFamily: Montserrat
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-base:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-base-semibold:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  body-sm-medium:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  caption:
    fontFamily: Inter
    fontSize: 10px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1.25rem
  space-xl: 2rem
---

## Brand & Style

This design system is engineered for dense, mission-critical inventory management and supply chain logistics. The interface balances high-throughput utility with visual calm, mitigating operator fatigue during long operational shifts in warehouses, logistics centers, and procurement hubs.

### Aesthetic & Movement
The design movement is **Structured Functional Modernism** with high-contrast clarity. It relies on architectural layouts, disciplined grid alignment, restrained depth, and deliberate color distribution:
- **60% Surface Foundation:** Warm, low-strain off-white canvas avoiding stark glare.
- **30% Structural Cadence:** Grounded slate blue for navigation chrome, section anchoring, and table headers.
- **10% Kinetic Accent:** Amber mustard reserved strictly for critical pathways, low-stock warnings, and primary action targets.

### Operator Persona & Tone
- **Archetype:** Floor managers, procurement officers, and inventory auditors requiring zero-ambiguity status recognition and immediate keyboard/mouse ergonomics.
- **Tone:** Authoritative, disciplined, tactical, and fatigue-reducing.

## Colors

The palette enforces clear functional hierarchy and strictly adheres to WCAG AA/AAA standards against both the warm background and slate structure tokens.

### Roles & Semantic Assignment
- **Primary (`#4A6B8A`):** Defines shell architecture, persistent navigation bars, primary table header bands, and structural UI dividers. Hover and selected states transition into Primary 700 (`#354D63`). Light accents leverage Primary 100 (`#E9EFF5`).
- **Accent / Secondary (`#E6A017`):** High-priority focus actions, "Receive Stock", "Create Purchase Order", and key actionable operational states. Hover shifts down to Accent 600 (`#C58913`).
- **Neutral Foundation:**
  - Base App Surface (`Neutral 50` - `#FFF9F0`): Warm off-white reducing visual vibration.
  - Card & Container Surface (`Neutral 100` - `#F4EFE6`): Sub-panels, drawer sheets, and filters.
  - Subtle Fill (`Neutral 200` - `#E5DECE`): Table row alternating strips, active input fills.
  - Border/Dividers (`Neutral 300` - `#D1C7B7`): Gridlines, panel delineators, and input strokes.
  - Muted Text / Secondary Labels (`Neutral 700` - `#5C5C56`): Units of measure, timestamps, and secondary captions.
  - Ink / Text Base (`Neutral 900` - `#2E2E2A`): Core text and data figures yielding >11:1 contrast against `#FFF9F0`.
- **System Feedback Statuses:**
  - Success (`#2D7A4D`): Stock in balance, audit passed, cycle count matched.
  - Danger (`#C93D33`): Stockout, discrepancies, decommissioned items.
  - Warning (`#D97706`): Approaching safety stock threshold, pending verification.
  - Info (`#2B6CB0`): In-transit shipments, scheduled replenishment.

## Typography

Typography prioritizes tabular scan speed, cross-column data parsing, and ergonomic form input.

### Hierarchy & Application
- **Montserrat (Display & Sectioning):** Reserved for level 1 to level 3 headers. Structural titles, warehouse zone headings, and summary dashboard figures use Montserrat to inject architectural presence.
- **Inter (Operational Core):** All inventory tables, barcodes, quantities, SKUs, forms, and system alerts utilize Inter. Tabular lining numbers (`tnum`) must be toggled on across all numerical table columns to ensure absolute vertical decimal alignment.
- **Level Scaling:**
  - `headline-1` (28px): Top-level dashboard summary and warehouse-level switcher.
  - `headline-2` (22px): Main panel headers, purchase order titles.
  - `headline-3` (18px): Drawer panels, sub-section dividers, modal titles.
  - `body-lg` (16px): Form input text, primary readouts.
  - `body-base` (14px): Standard data grids, core table cell typography.
  - `body-sm` (12px): Metadata tags, badge text, secondary SKU references.
  - `caption` (10px): Micro timestamps, barcode sub-labels, uppercase column sorting indicators.

## Layout & Spacing

The layout is grounded in a compact, density-optimized 12-column fluid grid system geared towards large multi-window desktop monitors, ruggedized warehouse tablets, and terminal workstations.

### Grid & Ergonomics
- **Desktop (>= 1280px):** 12-column layout with 24px (`1.5rem`) gutters and fixed 260px left-hand collapsible structural navigation. Tables support horizontal scrolling or pinned key columns (e.g., SKU, Status).
- **Tablet / Rugged Terminal (768px - 1279px):** 8-column layout with 16px (`1rem`) gutters and navigation condensed into an icon rail (64px width).
- **Mobile Handheld Scanner (< 768px):** 4-column layout with single-column stacked forms, sticky bottom actionable sheets, and barcode scanner floating buttons.

### Spacing Principles
- Density takes precedence over negative space: internal component gaps use `space-xs` (4px) and `space-sm` (8px) to reduce vertical travel when reviewing large datasets.
- Layout sections maintain clear delineation with `space-lg` (20px) and `space-xl` (32px).

## Elevation & Depth

To maximize visual clarity in varying ambient warehouse light conditions, depth is constructed via **low-contrast architectural outlines and disciplined tonal layers** rather than heavy blurred drop shadows.

### Elevation Tiers
- **Surface Level 0 (App Shell Canvas):** `#FFF9F0`. The baseline canvas for all background viewports.
- **Surface Level 1 (Data Sheets & Cards):** `#F4EFE6` or pure white `#FFFFFF` wrapped in a crisp 1px solid `#D1C7B7` border. No drop shadows.
- **Surface Level 2 (Floating Popovers & Dropdowns):** Solid container surface backed by a subtle, tight shadow: `0 4px 12px -2px rgba(46, 46, 42, 0.08)`, framed by a 1px solid `#D1C7B7` border.
- **Surface Level 3 (Modals & Critical Alert Overlays):** Anchored center-screen against a semi-opaque backdrop scrim (`rgba(46, 46, 42, 0.5)`). Shadows are clean and structured: `0 12px 32px -4px rgba(46, 46, 42, 0.16)`.

## Shapes

The design system embraces a **Soft (Level 1)** geometric geometry. Corners are subtly radiused at `0.25rem` (4px) to retain an industrial, instrument-grade personality while avoiding harsh acute angles.

### Rules of Corner Radius
- **Micro & Standard Controls (Buttons, Inputs, Badges, Tabs):** `0.25rem` (4px). Maintains clean alignment in dense grid rows.
- **Cards, Tables, and Grouping Panels:** `rounded-lg` at `0.5rem` (8px). Softens large bounded rectangular blocks without losing structural authority.
- **Modals & Drawers:** `rounded-xl` at `0.75rem` (12px) on top or perimeter corners to communicate distinct layer separation.
- **Data Indicator Dots:** Strictly circular (`rounded-full`).

## Components

### Buttons
- **Primary Action (CTA):** `#E6A017` background, `#2E2E2A` text, 4px corner radius, bold font weight. Active/hover state transitions to `#C58913`. Used exclusively for positive creation flows (e.g., "Add SKU", "Dispatch Order").
- **Secondary / Operational:** `#4A6B8A` background, `#FFFFFF` text. Hover to `#354D63`.
- **Tertiary / Outline:** Transparent fill, 1px solid border `#D1C7B7`, `#2E2E2A` text. Hover to `#E5DECE`.
- **Destructive:** Transparent or tinted background with `#C93D33` text and border; filled `#C93D33` with `#FFFFFF` text for irreversible actions.

### Tables & Data Grids
- **Header Band:** Filled with `#4A6B8A` featuring white text (`headline-3` / `body-base-semibold`), or `Neutral 200` (`#E5DECE`) with `#2E2E2A` uppercase 12px text.
- **Row Styling:** Base row `#FFFFFF`, alternate row `#F4EFE6`. Hover row state `#E9EFF5`. Row borders 1px solid `#D1C7B7`.
- **Cell Alignment:** Text aligned left, status tags centered, inventory quantities and financial values right-aligned with monospace/tabular lining numbers enabled.

### Form Inputs & Search Fields
- **Container:** Height 36px (compact) or 40px (standard). Background `#FFFFFF`, 1px solid `#D1C7B7` border, 4px radius.
- **Focus State:** 2px high-contrast outer ring in `#4A6B8A` with 0px offset.
- **Inline Prefix/Suffix:** Integrated barcode icons, SKU prefix boxes, and unit-of-measure labels (`Neutral 700`) inside a `#F4EFE6` recessed block.

### Status Chips & Badges
- Compact padding (`2px 8px`), font size 12px, font weight 600, 4px border radius.
- **In Stock:** `#2D7A4D` text with a 15% tinted green background (`#EAF4EE`) and 1px matching border.
- **Low Stock:** `#D97706` text with a 15% tinted amber background (`#FDF6E9`).
- **Out of Stock:** `#C93D33` text with a 15% tinted red background (`#FCECEB`).

### Checkboxes & Radios
- Size: 16x16px with 3px radius (checkbox) or circular (radio).
- Border: 1.5px solid `#5C5C56`.
- Checked State: Solid `#4A6B8A` fill with a sharp white checkmark or center pip.

### Operational KPI Cards
- Background `#F4EFE6` with a 1px border `#D1C7B7`. Internal padding `space-md`.
- Metric numbers rendered in Montserrat 28px (`#2E2E2A`), label in 12px Inter (`#5C5C56`), accompanied by inline trending indicators.