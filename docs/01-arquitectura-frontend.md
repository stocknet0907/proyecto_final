# 01 — Arquitectura Frontend: STOCK.NET

## 1. Visión General y Principios de Diseño
**STOCK.NET** es una plataforma web para la gestión integral de inventario, punto de venta (POS), compras, proveedores, clientes, créditos y control de márgenes. Ha sido refactorizada para operar bajo el modelo **Frontend-First / Client-Side First**, permitiendo que toda la experiencia de usuario, validaciones de negocio, cálculos de rentabilidad y operaciones CRUD se ejecuten con latencia cero en el cliente, apoyadas en persistencia local reactiva.

### Principios Fundamentales:
1. **Feature-First / Domain-Driven UI:** Cada módulo funcional se encapsula en su propia carpeta bajo `src/features/`, aislando sus componentes, hooks, store y mockData.
2. **Alta Cohesión y Bajo Acoplamiento:** Los módulos interactúan a través de interfaces bien definidas o stores globales específicos, impidiendo que cambios en el POS rompan Créditos o Compras.
3. **Persistencia Reactiva y Resiliencia:** Toda modificación en el estado se persiste atómicamente en `localStorage` mediante Zustand (`persist`), permitiendo refrescar la página sin perder datos y ofreciendo restauración de fábrica (*Reset Mock Data*).
4. **Ergonomía de Almacén y Terminal:** Diseñado siguiendo el movimiento *Structured Functional Modernism*, eliminando fatiga visual mediante tonalidades cálidas (`#FCF9F3`), alto contraste textual y fuentes legibles con cifras tabulares.

---

## 2. Diagrama de Arquitectura de Capas

```
┌─────────────────────────────────────────────────────────────┐
│                       Navegador Web                         │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    Entorno de Aplicación                    │
│                 (React 18 + Vite + Tailwind)                │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                         App Router                          │
│     (react-router-dom: Rutas Públicas, Protegidas y 404)     │
└──────────────┬───────────────────────────────┬──────────────┘
               │                               │
               ▼                               ▼
┌──────────────────────────────┐ ┌────────────────────────────┐
│      Shared UI & Layout      │ │       Feature Modules      │
│  - AppShell (Sidebar/Header) │ │  - auth                    │
│  - Button, Modal, Card       │ │  - dashboard               │
│  - Input, Select, Switch     │ │  - inventory               │
│  - Table, Badge, Toast       │ │  - pos                     │
│  - EmptyState, ConfirmDialog │ │  - sales                   │
└──────────────┬───────────────┘ │  - purchases               │
               │                 │  - suppliers               │
               │                 │  - customers               │
               │                 │  - credits                 │
               │                 │  - users                   │
               │                 └──────────────┬─────────────┘
               │                                │
               ▼                                ▼
┌─────────────────────────────────────────────────────────────┐
│                Capa de Estado y Lógica (Zustand)            │
│       - authStore         - inventoryStore    - posStore    │
│       - salesStore        - purchasesStore    - creditsStore│
│       - suppliersStore    - customersStore    - usersStore  │
└──────────────────────────────┬──────────────────────────────┘
                               │ (persist middleware)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                     Almacenamiento Local                    │
│                     (Browser localStorage)                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Estructura de Carpetas (`Feature-First`)

```
src/
├── app/                        # Configuración raíz de la aplicación
│   ├── App.jsx                 # Contenedor raíz con Toaster y Providers
│   ├── AppRouter.jsx           # Enrutamiento central, rutas protegidas y 404
│   ├── index.css               # Estilos globales y tokens Tailwind
│   └── main.jsx                # Punto de entrada de React en el DOM
│
├── features/                   # Módulos organizados por dominio funcional
│   ├── auth/                   # Autenticación, control de accesos e intentos fallidos
│   ├── dashboard/              # Panel administrativo con KPIs y gráficos
│   ├── inventory/              # Catálogo de productos, categorías y ajustes de stock
│   ├── pos/                    # Terminal de venta (POS), escaneo y cobro
│   ├── sales/                  # Historial de ventas, márgenes y comprobantes
│   ├── purchases/              # Órdenes de compra y recepción física con lotes
│   ├── suppliers/              # Directorio y gestión de proveedores
│   ├── customers/              # Directorio de clientes y límites de crédito
│   ├── credits/                # Cuentas por cobrar, cartera y abonos
│   ├── users/                  # Operadores, matriz de permisos y auditoría
│   └── notFound/               # Página 404 de recurso no encontrado
│
└── shared/                     # Elementos reutilizables transversales
    ├── components/             # Componentes UI atómicos (Button, Modal, etc.)
    ├── constants/              # Constantes de roles, permisos y temas
    └── utils/                  # Utilidades (formatters, classnames helper)
```

### Anatomía Interna de un Módulo Feature:
Cada subcarpeta en `src/features/<modulo>/` respeta rigurosamente esta división:
- `components/`: Subcomponentes específicos de la vista (máximo 150-200 líneas).
- `hooks/`: Custom hooks encapsulando lógica de negocio y filtros.
- `store/`: Tienda Zustand persistida con acciones atómicas CRUD.
- `data/`: Conjunto de datos iniciales representativos (*mockData*).
- `pages/`: Vista o página exportada para su consumo en `AppRouter`.

---

## 4. Gestión del Estado Global y Flujo de Datos

### 4.1 Elección de Zustand con Middleware `persist`
Se seleccionó **Zustand** frente a alternativas como Redux o Context API debido a:
- **Cero Boilerplate:** No requiere reducers, actions types ni context providers anidados.
- **Selector-based Re-rendering:** Los componentes solo se re-renderizan si la porción específica del estado seleccionada cambia.
- **Persistencia Transparente:** La integración con `create(persist(...))` serializa y sincroniza en caliente los cambios en `localStorage`, garantizando que ventas, compras, modificaciones de productos y cobros permanezcan intactos tras recargar el navegador.

### 4.2 Sincronización entre Módulos (Integridad Referencial Frontend)
Para cumplir con el **RNF09 (Integridad Referencial)** y los flujos transaccionales:
- **Venta en POS:** Al confirmar una venta (`posStore.processSale`):
  1. Descuenta automáticamente el stock de los productos vendidos en `inventoryStore`.
  2. Registra la transacción finalizada en `salesStore`.
  3. Si la venta fue a *Crédito*, incrementa la deuda del cliente en `customersStore` y genera el registro de cuenta por cobrar en `creditsStore`.
- **Recepción de Compra:** Al recibir mercancía en `purchasesStore`:
  1. Actualiza el estado de la orden de compra (*Recibida* o *Parcial*).
  2. Incrementa el inventario en `inventoryStore` asignando lote y fecha de vencimiento.
  3. Registra el precio de compra en el historial de costos.

### 4.3 Botón de Restablecimiento de Fábrica (*Reset Mock Data*)
En la barra superior (`Header.jsx`) se dispone de un botón de mantenimiento que borra las llaves de `localStorage` correspondientes al sistema y recarga los datos maestros de prueba predeterminados, facilitando demostraciones continuas y pruebas de control de calidad.

---

## 5. Estrategia de Enrutamiento y Control de Acceso

La aplicación implementa `react-router-dom` v6 estructurada en:
1. **Ruta Pública:** `/login` (Acceso al formulario institucional de credenciales).
2. **Rutas Protegidas (Bajo `Layout` compartido):**
   - `/dashboard` — Panel de control y métricas ejecutivas.
   - `/inventory/products` — Gestión de productos y catálogo.
   - `/inventory/categories` — Gestión de categorías.
   - `/pos` — Terminal de Punto de Venta.
   - `/sales` — Consulta histórica y análisis de rentabilidad.
   - `/purchases` — Órdenes de compra y recepción.
   - `/suppliers` — Directorio de proveedores.
   - `/customers` — Directorio de clientes y créditos.
   - `/credits` — Cuentas por cobrar y abonos.
   - `/users` — Usuarios, roles y auditoría.
3. **Ruta Comodín (404):** `*` redirige a `NotFoundPage.jsx`, con navegación de retorno amigable.
4. **Control por Rol:** El hook `useAuth` evalúa los permisos del usuario activo (`Administrador Propietario`, `Administrador BD` o `Empleado Cajero`). Si un cajero intenta ingresar a `/users` o `/sales`, el sistema bloquea la vista o lo redirige inmediatamente a `/pos` (**RF06**).
