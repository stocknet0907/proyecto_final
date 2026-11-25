# Especificación de Requisitos de Software (ERS) — STOCK.NET
**Estándar:** Conforme con IEEE Std 830-1998  
**Proyecto:** STOCK.NET — Sistema de Gestión Integral de Inventario, POS y Cadena de Suministro  
**Versión:** 2.0 (Refactorización Frontend-First React + Tailwind)

---

## 1. Introducción

### 1.1 Propósito
El presente documento tiene como objetivo definir y formalizar los Requisitos Funcionales (RF) y Requisitos No Funcionales (RNF) para la plataforma **STOCK.NET**, garantizando una comprensión compartida entre los analistas de requerimientos, arquitectos de software, desarrolladores y las partes interesadas del negocio.

### 1.2 Alcance
El sistema comprende el ciclo operativo y comercial completo de una empresa distribuidora y comercializadora: control de existencias en almacén, parametrización de categorías, operaciones en punto de venta (POS) con flujo de cobro contado y crédito, facturación, auditoría y ajuste de inventarios, órdenes de compra y recepción técnica con lote/vencimiento, evaluación de proveedores, fidelización y scoring crediticio de clientes, cobranza y amortización de cartera, y panel analítico de rentabilidad y márgenes brutos.

### 1.3 Personal Involucrado
| Nombre | Rol / Cargo |
| :--- | :--- |
| Carlos Rodríguez | Administrador Propietario / Stakeholder |
| Laura Morales | Administradora de Base de Datos y Sistemas |
| Julián Méndez | Cajero / Operador de Punto de Venta |
| Santiago Sánchez | Arquitecto Frontend & Líder de Desarrollo |

### 1.4 Definiciones, Acrónimos y Abreviaturas
- **SGI:** Sistema de Gestión de Inventario.
- **POS:** *Point of Sale* (Punto de Venta).
- **SKU:** *Stock Keeping Unit* (Identificador único de referencia).
- **COGS:** *Cost of Goods Sold* (Costo de Mercancía Vendida).
- **RF:** Requerimiento Funcional.
- **RNF:** Requerimiento No Funcional.
- **CRUD:** Crear, Leer, Actualizar y Eliminar (*Create, Read, Update, Delete*).
- **WCAG:** *Web Content Accessibility Guidelines*.

---

## 2. Descripción General

### 2.1 Perspectiva del Producto
STOCK.NET opera como una aplicación web autónoma de alto desempeño en el cliente (*Client-Side Application*), desarrollada sobre React, Vite, Tailwind CSS y Zustand con persistencia en `localStorage`. Ofrece una experiencia reactiva inmediata, tolerante a caídas de conexión y con capacidad de restauración de datos de prueba.

### 2.2 Características de los Usuarios
1. **Administrador Propietario (`admin`):** Acceso integral al sistema, reportes ejecutivos de rentabilidad, márgenes brutos, bitácora de auditoría, autorización de cupos de crédito y administración de usuarios.
2. **Administrador de BD / Almacén (`db_admin`):** Gestión técnica de catálogo, recepciones de compras, ajuste de existencias físicas, control de lotes y mantenimiento de datos maestros.
3. **Empleado / Cajero (`cashier`):** Terminal POS para registro ágil de ventas, cobro en caja (efectivo, tarjetas, crédito), consulta de existencias y comprobantes térmicos.

---

## 3. Requisitos Funcionales (RF01 - RF46)

### RF01: Crear Usuario
| Campo | Detalle |
| :--- | :--- |
| **Identificación:** | RF01 |
| **Nombre:** | Crear Usuario |
| **Características:** | Permite al administrador registrar nuevos operadores definiendo credenciales y asignando uno de los 3 roles predefinidos (`admin`, `db_admin`, `cashier`). |
| **Descripción:** | El sistema debe suministrar un formulario validado para capturar nombre, correo, usuario, contraseña inicial y nivel de acceso del nuevo operador. |
| **Requerimientos No Funcionales:** | RNF01, RNF05, RNF06, RNF08, RNF11, RNF12 |
| **Prioridad:** | Alta |

### RF02: Ingresar Credenciales
| Campo | Detalle |
| :--- | :--- |
| **Identificación:** | RF02 |
| **Nombre:** | Ingresar Credenciales |
| **Características:** | Formulario de entrada en pantalla de bienvenida con inputs sanitizados para identificador y contraseña. |
| **Descripción:** | El usuario ingresa sus credenciales en la vista institucional de login antes de interactuar con cualquier módulo protegido. |
| **Requerimientos No Funcionales:** | RNF01, RNF02, RNF06, RNF12 |
| **Prioridad:** | Alta |

### RF03: Autenticación de Credenciales
| Campo | Detalle |
| :--- | :--- |
| **Identificación:** | RF03 |
| **Nombre:** | Autenticación de Credenciales |
| **Características:** | Verificación contra la base de usuarios encriptada/hasheada sin exponer texto plano. |
| **Descripción:** | Comprueba la existencia y validez de la combinación usuario/clave, generando la sesión activa y token local de acceso. |
| **Requerimientos No Funcionales:** | RNF01, RNF02, RNF05, RNF08 |
| **Prioridad:** | Alta |

### RF04: Control de Acceso por Intentos
| Campo | Detalle |
| :--- | :--- |
| **Identificación:** | RF04 |
| **Nombre:** | Control de Acceso por Intentos Fallidos |
| **Características:** | Contador regresivo de intentos permitidos y aviso disuasivo en caso de anomalías. |
| **Descripción:** | El sistema registra los intentos fallidos consecutivos; tras 3 fallos consecutivos, bloquea temporalmente el formulario, activa un banner de alerta de intrusión y exige intervención administrativa o espera programada. |
| **Requerimientos No Funcionales:** | RNF01, RNF02, RNF06, RNF08 |
| **Prioridad:** | Alta |

### RF05: Cierre de Sesión Seguro
| Campo | Detalle |
| :--- | :--- |
| **Identificación:** | RF05 |
| **Nombre:** | Cierre de Sesión Seguro |
| **Características:** | Destrucción de la sesión en memoria y redirección a login impidiendo navegación histórica con botón "Atrás". |
| **Descripción:** | Al presionar "Cerrar Sesión", se invalidan las credenciales en curso, se limpia la sesión activa de `localStorage` y se redirige a `/login`. |
| **Requerimientos No Funcionales:** | RNF01, RNF02, RNF06, RNF12 |
| **Prioridad:** | Alta |

### RF06: Redirección por Roles
| Campo | Detalle |
| :--- | :--- |
| **Identificación:** | RF06 |
| **Nombre:** | Redirección por Roles |
| **Características:** | Rutas protegidas que evalúan el rol del usuario autenticado. |
| **Descripción:** | Tras iniciar sesión con éxito, `admin` y `db_admin` son conducidos al Dashboard ejecutivo (`/dashboard`), mientras que `cashier` es redirigido directamente al Punto de Venta (`/pos`), impidiendo su acceso a reportes financieros o configuración sensible. |
| **Requerimientos No Funcionales:** | RNF04, RNF06, RNF08, RNF10 |
| **Prioridad:** | Alta |

### RF07: Gestión de Categorías
| Campo | Detalle |
| :--- | :--- |
| **Identificación:** | RF07 |
| **Nombre:** | Gestión de Categorías |
| **Características:** | Registro jerárquico con código único, nombre, departamento y descripción. |
| **Descripción:** | El sistema permite crear, editar y consultar la estructura de categorías bajo las cuales se organizan los productos de inventario. |
| **Requerimientos No Funcionales:** | RNF06, RNF09, RNF10 |
| **Prioridad:** | Alta |

### RF08: Inactivación de Categoría
| Campo | Detalle |
| :--- | :--- |
| **Identificación:** | RF08 |
| **Nombre:** | Inactivación de Categoría |
| **Características:** | Switch de estado funcional que valida la integridad de productos asociados. |
| **Descripción:** | Permite alternar entre estado Activo e Inactivo. Si la categoría cuenta con referencias asociadas activas, emite una advertencia de protección de integridad referencial. |
| **Requerimientos No Funcionales:** | RNF06, RNF09 |
| **Prioridad:** | Alta |

### RF09: Gestión de Productos
| Campo | Detalle |
| :--- | :--- |
| **Identificación:** | RF09 |
| **Nombre:** | Gestión de Productos |
| **Características:** | Catálogo maestro de productos con SKU, código de barras, categoría, proveedor, costo, precio de venta, margen y stock mínimo. |
| **Descripción:** | Permite dar de alta, actualizar y consultar fichas de productos comerciales. |
| **Requerimientos No Funcionales:** | RNF03, RNF05, RNF06, RNF09 |
| **Prioridad:** | Alta |

### RF10: Cálculo Automático de Totales
| Campo | Detalle |
| :--- | :--- |
| **Identificación:** | RF10 |
| **Nombre:** | Cálculo Automático de Totales |
| **Características:** | Liquidación reactiva en tiempo real sin requerir recarga. |
| **Descripción:** | En el POS y órdenes de compra, calcula subtotal, porcentaje de descuento, IVA (19%) y total a pagar de forma automática ante cada variación de ítem o cantidad. |
| **Requerimientos No Funcionales:** | RNF03, RNF05 |
| **Prioridad:** | Alta |

### RF11: Gestión de Métodos de Pago
| Campo | Detalle |
| :--- | :--- |
| **Identificación:** | RF11 |
| **Nombre:** | Gestión de Métodos de Pago |
| **Características:** | Habilitación de cobro por Efectivo, Tarjeta débito/crédito, Transferencia bancaria y Crédito directo. |
| **Descripción:** | El cajero selecciona el medio de pago en el modal de checkout; si es efectivo, calcula el cambio/devuelta instantáneamente según el importe recibido. |
| **Requerimientos No Funcionales:** | RNF06, RNF09 |
| **Prioridad:** | Alta |

### RF12: Cancelación de Ventas en Curso
| Campo | Detalle |
| :--- | :--- |
| **Identificación:** | RF12 |
| **Nombre:** | Cancelación de Ventas en Curso |
| **Características:** | Vaciado seguro del carrito con cuadro de confirmación modal. |
| **Descripción:** | Permite al cajero descartar una orden no concretada, restaurando los valores en cero sin afectar las existencias físicas. |
| **Requerimientos No Funcionales:** | RNF06, RNF07 |
| **Prioridad:** | Media |

### RF13: Inactivación de Producto
| Campo | Detalle |
| :--- | :--- |
| **Identificación:** | RF13 |
| **Nombre:** | Inactivación de Producto |
| **Características:** | Desactivación de catálogo sin pérdida de datos históricos de ventas pasadas. |
| **Descripción:** | Oculta el producto para nuevas ventas en POS manteniendo la trazabilidad histórica de transacciones y balances contables anteriores. |
| **Requerimientos No Funcionales:** | RNF09, RNF11 |
| **Prioridad:** | Alta |

### RF14: Visualizar Producto
| Campo | Detalle |
| :--- | :--- |
| **Identificación:** | RF14 |
| **Nombre:** | Visualizar Producto |
| **Características:** | Consulta rápida de existencias, ubicación en bodega y márgenes. |
| **Descripción:** | Muestra la ficha detallada de un producto seleccionado en catálogo o POS. |
| **Requerimientos No Funcionales:** | RNF06 |
| **Prioridad:** | Alta |

### RF15: Agregar Productos a una Venta
| Campo | Detalle |
| :--- | :--- |
| **Identificación:** | RF15 |
| **Nombre:** | Agregar Productos a una Venta |
| **Características:** | Búsqueda por escaneo de código de barras o clic directo en grid con validación de stock disponible. |
| **Descripción:** | Añade el artículo al carrito. Si la cantidad excede la existencia actual, bloquea la adición y alerta al operador. |
| **Requerimientos No Funcionales:** | RNF03, RNF06, RNF09 |
| **Prioridad:** | Alta |

### RF16: Visualización de Precios y Márgenes
| Campo | Detalle |
| :--- | :--- |
| **Identificación:** | RF16 |
| **Nombre:** | Visualización de Precios y Márgenes |
| **Características:** | Cálculo visible del margen bruto `((Precio Venta - Costo) / Precio Venta) * 100`. |
| **Descripción:** | En el formulario de producto y en el análisis de ventas, expone el margen porcentual y monetario en tiempo real. |
| **Requerimientos No Funcionales:** | RNF03, RNF05 |
| **Prioridad:** | Alta |

### RF17: Asociación de Productos a Proveedores
| Campo | Detalle |
| :--- | :--- |
| **Identificación:** | RF17 |
| **Nombre:** | Asociación de Productos a Proveedores |
| **Características:** | Vinculación del proveedor primario en la ficha de cada artículo. |
| **Descripción:** | Asocia cada producto a un proveedor registrado para facilitar la reposición mediante órdenes de compra. |
| **Requerimientos No Funcionales:** | RNF09 |
| **Prioridad:** | Media |

### RF18: Gestión de Base de Datos de Clientes
| Campo | Detalle |
| :--- | :--- |
| **Identificación:** | RF18 |
| **Nombre:** | Gestión de Clientes |
| **Características:** | Directorio de clientes con documento, nombre, teléfono, cupo de crédito y switch de estado. |
| **Descripción:** | Permite registrar, editar y consultar clientes, asignando límites crediticios según políticas comerciales. |
| **Requerimientos No Funcionales:** | RNF06, RNF09 |
| **Prioridad:** | Alta |

### RF19: Historial de Compras de Clientes
| Campo | Detalle |
| :--- | :--- |
| **Identificación:** | RF19 |
| **Nombre:** | Historial de Compras de Clientes |
| **Características:** | Listado cronológico de comprobantes emitidos a nombre del cliente. |
| **Descripción:** | Permite inspeccionar en un modal el histórico transaccional de compras y saldos adeudados de cada cliente. |
| **Requerimientos No Funcionales:** | RNF06 |
| **Prioridad:** | Media |

### RF20: Gestión de Proveedores
| Campo | Detalle |
| :--- | :--- |
| **Identificación:** | RF20 |
| **Nombre:** | Gestión de Proveedores |
| **Características:** | Directorio maestro de proveedores con NIT, contacto comercial, calificación y tiempo de entrega. |
| **Descripción:** | CRUD completo para administrar los socios de abastecimiento y suministro. |
| **Requerimientos No Funcionales:** | RNF06, RNF09 |
| **Prioridad:** | Alta |

### RF21: Historial de Compras por Proveedor
| Campo | Detalle |
| :--- | :--- |
| **Identificación:** | RF21 |
| **Nombre:** | Historial de Compras por Proveedor |
| **Características:** | Trazabilidad de órdenes de compra emitidas y recepcionadas por cada proveedor. |
| **Descripción:** | Muestra el histórico consolidado de pedidos suministrados, cumplimiento y montos acumulados. |
| **Requerimientos No Funcionales:** | RNF06 |
| **Prioridad:** | Media |

### RF22: Registrar Orden de Compra
| Campo | Detalle |
| :--- | :--- |
| **Identificación:** | RF22 |
| **Nombre:** | Registrar Orden de Compra |
| **Características:** | Generación de pedido formal a proveedor con detalle de ítems, cantidades y costo estimado. |
| **Descripción:** | Crea órdenes en estado *Borrador* o *Pendiente* para programar el reabastecimiento de almacén. |
| **Requerimientos No Funcionales:** | RNF06, RNF09 |
| **Prioridad:** | Alta |

### RF23: Recepción de Compra
| Campo | Detalle |
| :--- | :--- |
| **Identificación:** | RF23 |
| **Nombre:** | Recepción de Compra e Inspección |
| **Características:** | Cotejo de cantidades recibidas, registro de lote/serie y fecha de caducidad. |
| **Descripción:** | Al confirmar la recepción física, actualiza el estado de la orden a *Recibida*, suma el stock al inventario y actualiza el costo promedio. |
| **Requerimientos No Funcionales:** | RNF05, RNF09 |
| **Prioridad:** | Alta |

### RF24: Devoluciones
| Campo | Detalle |
| :--- | :--- |
| **Identificación:** | RF24 |
| **Nombre:** | Devoluciones de Mercancía |
| **Características:** | Registro de retorno de productos defectuosos a proveedores o devoluciones de clientes. |
| **Descripción:** | Realiza el ajuste correspondiente en existencias y en los balances de compras/ventas. |
| **Requerimientos No Funcionales:** | RNF09 |
| **Prioridad:** | Media |

### RF25: Historial de Precios de Compra
| Campo | Detalle |
| :--- | :--- |
| **Identificación:** | RF25 |
| **Nombre:** | Historial de Precios de Compra |
| **Características:** | Registro cronológico de fluctuaciones de costo de adquisición en cada recepción. |
| **Descripción:** | Permite evaluar la variación de precios de insumos en el tiempo para ajustar márgenes de venta. |
| **Requerimientos No Funcionales:** | RNF05 |
| **Prioridad:** | Media |

### RF26: Venta a Crédito
| Campo | Detalle |
| :--- | :--- |
| **Identificación:** | RF26 |
| **Nombre:** | Venta a Crédito |
| **Características:** | Validación en caliente de cupo crediticio disponible y estado de mora del cliente. |
| **Descripción:** | Si el cliente está *Activo* y el monto no supera su cupo disponible, autoriza la venta a crédito, crea la cuenta por cobrar en cartera e incrementa su saldo deudor. |
| **Requerimientos No Funcionales:** | RNF03, RNF09 |
| **Prioridad:** | Alta |

### RF27: Registrar Abono
| Campo | Detalle |
| :--- | :--- |
| **Identificación:** | RF27 |
| **Nombre:** | Registrar Abono a Crédito |
| **Características:** | Registro de amortización parcial o total de la deuda con emisión de recibo de caja. |
| **Descripción:** | Reduce el saldo pendiente del crédito y la deuda consolidada del cliente, registrando fecha, monto y cajero. |
| **Requerimientos No Funcionales:** | RNF03, RNF09 |
| **Prioridad:** | Alta |

### RF28: Reporte de Cartera
| Campo | Detalle |
| :--- | :--- |
| **Identificación:** | RF28 |
| **Nombre:** | Reporte de Cartera |
| **Características:** | Clasificación de créditos en cartera corriente, créditos por vencer y cuentas en mora. |
| **Descripción:** | Presenta las métricas consolidadas de cobro pendiente para facilitar la gestión de cobranza. |
| **Requerimientos No Funcionales:** | RNF06 |
| **Prioridad:** | Alta |

### RF29: Cerrar Crédito
| Campo | Detalle |
| :--- | :--- |
| **Identificación:** | RF29 |
| **Nombre:** | Cerrar Crédito |
| **Características:** | Finalización automática del crédito cuando el saldo remanente llega a $0. |
| **Descripción:** | Cambia el estado del crédito a *Saldado* y libera el cupo crediticio en el perfil del cliente. |
| **Requerimientos No Funcionales:** | RNF09 |
| **Prioridad:** | Alta |

### RF30: Auditoría de Inventario
| Campo | Detalle |
| :--- | :--- |
| **Identificación:** | RF30 |
| **Nombre:** | Auditoría de Inventario |
| **Características:** | Módulo para cotejar conteos físicos periódicos con los registros del sistema. |
| **Descripción:** | Detecta discrepancias de stock y genera sugerencias de ajuste contable. |
| **Requerimientos No Funcionales:** | RNF05, RNF09 |
| **Prioridad:** | Alta |

### RF31: Bitácora de Usuarios
| Campo | Detalle |
| :--- | :--- |
| **Identificación:** | RF31 |
| **Nombre:** | Bitácora de Usuarios |
| **Características:** | Registro cronológico inmutable de operaciones sensibles (ajustes, creación de usuarios, accesos). |
| **Descripción:** | Permite a los administradores auditar qué operador ejecutó cada acción crítica, con fecha y detalle. |
| **Requerimientos No Funcionales:** | RNF01, RNF05 |
| **Prioridad:** | Media |

### RF32: Ajuste de Inventario
| Campo | Detalle |
| :--- | :--- |
| **Identificación:** | RF32 |
| **Nombre:** | Ajuste de Inventario |
| **Características:** | Entrada o salida manual justificada (merma, rotura, donación, calibración de conteo). |
| **Descripción:** | Actualiza el stock físico de un producto registrando el motivo y el usuario responsable en la bitácora. |
| **Requerimientos No Funcionales:** | RNF06, RNF09 |
| **Prioridad:** | Alta |

### RF33: Buscar por Categoría
| Campo | Detalle |
| :--- | :--- |
| **Identificación:** | RF33 |
| **Nombre:** | Buscar y Filtrar por Categoría |
| **Características:** | Filtro reactivo multinivel en catálogo y POS. |
| **Descripción:** | Permite segmentar productos instantáneamente seleccionando categorías o departamentos. |
| **Requerimientos No Funcionales:** | RNF03, RNF06 |
| **Prioridad:** | Alta |

### RF34: Búsqueda de Proveedores
| Campo | Detalle |
| :--- | :--- |
| **Identificación:** | RF34 |
| **Nombre:** | Búsqueda de Proveedores |
| **Características:** | Filtro en tiempo real por razón social, NIT o persona de contacto. |
| **Descripción:** | Facilita la localización rápida de proveedores en tablas y selectores de compra. |
| **Requerimientos No Funcionales:** | RNF03 |
| **Prioridad:** | Media |

### RF35: Búsqueda de Clientes
| Campo | Detalle |
| :--- | :--- |
| **Identificación:** | RF35 |
| **Nombre:** | Búsqueda de Clientes |
| **Características:** | Búsqueda predictiva por cédula/NIT, nombre o teléfono en POS y Cartera. |
| **Descripción:** | Localiza clientes en milisegundos para asignación de ventas o registro de abonos. |
| **Requerimientos No Funcionales:** | RNF03 |
| **Prioridad:** | Alta |

### RF36: Venta de Contado
| Campo | Detalle |
| :--- | :--- |
| **Identificación:** | RF36 |
| **Nombre:** | Venta de Contado |
| **Características:** | Liquidación inmediata con emisión de comprobante y cálculo de cambio. |
| **Descripción:** | Registra la venta finalizada en efectivo, tarjeta o transferencia con descuento directo de inventario. |
| **Requerimientos No Funcionales:** | RNF03, RNF09 |
| **Prioridad:** | Alta |

### RF37: Registrar Gastos de Mantenimiento / Operativos
| Campo | Detalle |
| :--- | :--- |
| **Identificación:** | RF37 |
| **Nombre:** | Gastos Operativos |
| **Características:** | Registro de egresos para consolidación del balance financiero y utilidad neta. |
| **Descripción:** | Permite documentar salidas menores de caja y gastos de logística/mantenimiento. |
| **Requerimientos No Funcionales:** | RNF05 |
| **Prioridad:** | Media |

### RF38: Lista de Usuarios
| Campo | Detalle |
| :--- | :--- |
| **Identificación:** | RF38 |
| **Nombre:** | Lista de Usuarios |
| **Características:** | Tabla administrativa de operadores con roles, estado y último acceso. |
| **Descripción:** | Permite al administrador supervisar las cuentas activas e inactivar operadores. |
| **Requerimientos No Funcionales:** | RNF06 |
| **Prioridad:** | Alta |

### RF39: Filtrar por Estado
| Campo | Detalle |
| :--- | :--- |
| **Identificación:** | RF39 |
| **Nombre:** | Filtrar por Estado |
| **Características:** | Filtros globales tipo dropdown o pills (*Activo*, *Inactivo*, *Al día*, *Mora*, *Agotado*). |
| **Descripción:** | Disponible en todas las grillas de datos para focalizar registros operativos. |
| **Requerimientos No Funcionales:** | RNF06 |
| **Prioridad:** | Alta |

### RF40: Historial de Transacciones
| Campo | Detalle |
| :--- | :--- |
| **Identificación:** | RF40 |
| **Nombre:** | Historial de Transacciones |
| **Características:** | Bitácora consolidada de ventas con número de factura, cliente, medio de pago y total. |
| **Descripción:** | Permite auditar y reimprimir tickets de cualquier transacción pasada. |
| **Requerimientos No Funcionales:** | RNF05, RNF06 |
| **Prioridad:** | Alta |

### RF41: Análisis de Márgenes
| Campo | Detalle |
| :--- | :--- |
| **Identificación:** | RF41 |
| **Nombre:** | Análisis de Márgenes y Rentabilidad |
| **Características:** | Métrica de utilidad neta y margen bruto promedio sobre el costo de adquisición. |
| **Descripción:** | Presenta KPIs ejecutivos y gráficos comparativos de ventas vs costo y utilidad real. |
| **Requerimientos No Funcionales:** | RNF05 |
| **Prioridad:** | Alta |

### RF42: Exportar Créditos / Reportes
| Campo | Detalle |
| :--- | :--- |
| **Identificación:** | RF42 |
| **Nombre:** | Exportar Reportes de Cartera |
| **Características:** | Generación de vista imprimible y exportación de estados de cuenta. |
| **Descripción:** | Facilita la impresión de extractos de deuda para entregar a clientes o auditores. |
| **Requerimientos No Funcionales:** | RNF06, RNF12 |
| **Prioridad:** | Media |

### RF43: Filtros Globales
| Campo | Detalle |
| :--- | :--- |
| **Identificación:** | RF43 |
| **Nombre:** | Filtros Globales y Búsqueda Universal |
| **Características:** | Búsqueda instantánea con debouncing en todas las vistas de tablas. |
| **Descripción:** | Permite buscar por texto libre en múltiples columnas simultáneamente. |
| **Requerimientos No Funcionales:** | RNF03, RNF06 |
| **Prioridad:** | Alta |

### RF44: Estadísticas de Resumen
| Campo | Detalle |
| :--- | :--- |
| **Identificación:** | RF44 |
| **Nombre:** | Estadísticas de Resumen (KPI Cards) |
| **Características:** | Indicadores clave en dashboard con variación porcentual e iconos contextuales. |
| **Descripción:** | Muestra ventas del día, productos bajo stock mínimo, cartera pendiente y margen global. |
| **Requerimientos No Funcionales:** | RNF05, RNF06 |
| **Prioridad:** | Alta |

### RF45: Gráficos Analíticos de Rendimiento
| Campo | Detalle |
| :--- | :--- |
| **Identificación:** | RF45 |
| **Nombre:** | Gráficos Analíticos de Rendimiento |
| **Características:** | Gráficos SVG responsivos de tendencias de ingresos y comparación costo/margen. |
| **Descripción:** | Facilita la toma de decisiones gerenciales mediante análisis visual de ventas semanales/mensuales. |
| **Requerimientos No Funcionales:** | RNF06 |
| **Prioridad:** | Alta |

### RF46: Tablas de Detalle Operativo
| Campo | Detalle |
| :--- | :--- |
| **Identificación:** | RF46 |
| **Nombre:** | Tablas de Detalle Operativo |
| **Características:** | Grillas de alta densidad con paginación, ordenamiento por columna y estados vacíos (*Empty States*). |
| **Descripción:** | Componente unificado con soporte de lectura ágil y resaltado de filas al pasar el cursor. |
| **Requerimientos No Funcionales:** | RNF06, RNF13 |
| **Prioridad:** | Alta |

---

## 4. Requisitos No Funcionales (RNF01 - RNF13)

### RNF01: Encriptación y Protección de Credenciales
- **Descripción:** El sistema no almacena ni expone contraseñas en texto claro. En el cliente se utiliza cifrado/hashing seguro para validar autenticidad de sesión y protección de tokens.
- **Prioridad:** Alta

### RNF02: Control de Sesiones
- **Descripción:** Las sesiones se aíslan por pestaña y almacenamiento local. Al cerrar sesión o bloquear la cuenta, se purgan los tokens de acceso activo.
- **Prioridad:** Alta

### RNF03: Tiempo de Respuesta en Transacciones
- **Descripción:** Toda operación de filtrado, adición al carrito y cálculo de totales en cliente debe completarse en un tiempo inferior a 150 milisegundos.
- **Prioridad:** Alta

### RNF04: Capacidad de Concurrencia y Escalabilidad
- **Descripción:** La arquitectura modular en capas desacopladas garantiza que la plataforma pueda integrarse a futuro con APIs backend concurrentes y múltiples terminales simultáneas.
- **Prioridad:** Alta

### RNF05: Desempeño y Confiabilidad
- **Descripción:** El renderizado de listas extensas de inventario y transacciones optimiza el Virtual DOM mediante llaves estables y hooks selectivos para evitar re-renderizados innecesarios.
- **Prioridad:** Alta

### RNF06: Interfaz Intuitiva y Responsiva
- **Descripción:** El diseño se adapta ergonómicamente a resoluciones de escritorio (12 columnas), terminales tablet (8 columnas) y escáneres móviles (4 columnas) sin solapamiento de componentes.
- **Prioridad:** Alta

### RNF07: Tiempo de Aprendizaje
- **Descripción:** Un operador de caja o almacén debe ser capaz de ejecutar un flujo completo de venta o consulta en menos de 10 minutos de inducción básica.
- **Prioridad:** Media

### RNF08: Disponibilidad del Sistema
- **Descripción:** El sistema opera de forma 100% autónoma en el navegador, permitiendo continuar las labores comerciales aun ante cortes esporádicos de red externa.
- **Prioridad:** Crítica

### RNF09: Integridad Referencial Transaccional
- **Descripción:** Toda venta confirmada ejecuta de forma atómica el descuento de stock, la generación de factura y la afectación de cartera si es a crédito, previniendo datos huérfanos.
- **Prioridad:** Crítica

### RNF10: Modularidad del Código (Feature-First)
- **Descripción:** El código fuente se distribuye bajo arquitectura de módulos independientes; la modificación o mantenimiento de un módulo (ej. Créditos) no altera ni desestabiliza a los demás (ej. POS).
- **Prioridad:** Crítica

### RNF11: Respaldo y Recuperación de Datos (Backup / Reset)
- **Descripción:** Persistencia automática continua en `localStorage` ante cada mutación y disponibilidad de una función de restauración de fábrica (*Reset Mock Data*) en un clic.
- **Prioridad:** Crítica

### RNF12: Compatibilidad Multiplataforma
- **Descripción:** La aplicación es 100% compatible y visualmente homogénea en Google Chrome, Mozilla Firefox, Microsoft Edge y Apple Safari.
- **Prioridad:** Crítica

### RNF13: Accesibilidad (WCAG 2.1 Nivel AA)
- **Descripción:** Ratios de contraste de texto superiores a 4.5:1 en contenido y 11:1 en cifras principales, foco visible en inputs y capacidad de navegación integral mediante teclado (Tab, Enter, Escape).
- **Prioridad:** Crítica
