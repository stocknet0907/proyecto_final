# 03 — Diccionario de Datos Mock y Llaves de Persistencia: STOCK.NET

Este documento especifica la estructura formal de las entidades del dominio, tipos de datos, modelos relacionales en cliente y las llaves empleadas en el almacenamiento persistente (`localStorage`).

---

## 1. Llaves de Almacenamiento Local (`localStorage`)

Cada tienda (*store*) de Zustand utiliza una llave única con el prefijo `stocknet_` para garantizar el aislamiento de datos y facilitar la restauración controlada:

| Store Zustand | Llave `localStorage` | Entidad Principal |
| :--- | :--- | :--- |
| `authStore` | `stocknet_auth` | Sesión activa, usuario autenticado, intentos fallidos |
| `inventoryStore` | `stocknet_inventory` | Catálogo de productos, categorías, movimientos de auditoría |
| `posStore` | `stocknet_pos` | Carrito activo de venta, configuración de caja |
| `salesStore` | `stocknet_sales` | Historial de transacciones de venta y tickets generados |
| `purchasesStore` | `stocknet_purchases` | Órdenes de compra y recepciones con trazabilidad de lote |
| `suppliersStore` | `stocknet_suppliers` | Proveedores registrados y métricas de servicio |
| `customersStore` | `stocknet_customers` | Clientes, cupos crediticios y estados de cuenta |
| `creditsStore` | `stocknet_credits` | Cartera activa, créditos otorgados y abonos registrados |
| `usersStore` | `stocknet_users` | Usuarios del sistema y bitácora de auditoría |

---

## 2. Modelos de Datos y Entidades

### 2.1 Usuario (`User`)
```typescript
interface User {
  id: string;               // Ej: "usr-001"
  name: string;             // Ej: "Carlos Rodríguez"
  email: string;            // Ej: "admin@stocknet.com"
  username: string;         // Ej: "admin"
  role: 'admin' | 'db_admin' | 'cashier'; // Rol de acceso
  roleLabel: string;        // Ej: "Administrador Propietario"
  status: 'active' | 'inactive' | 'locked'; // Estado
  failedAttempts: number;   // Conteo de fallos acumulados
  lastLogin?: string;       // Timestamp ISO
  avatar?: string;
}
```

### 2.2 Categoría (`Category`)
```typescript
interface Category {
  id: string;               // Ej: "cat-001"
  code: string;             // Ej: "CAT-LUB"
  name: string;             // Ej: "Lubricantes y Fluidos"
  department: string;       // Ej: "Mantenimiento Automotriz"
  description: string;      // Ej: "Aceites sintéticos y refrigerantes"
  productCount: number;     // Conteo de referencias
  active: boolean;          // Switch funcional de estado
  icon?: string;            // Nombre de icono lucide-react
}
```

### 2.3 Producto (`Product`)
```typescript
interface Product {
  id: string;               // Ej: "prod-001"
  sku: string;              // Ej: "OIL-5W30-01"
  barcode: string;          // Ej: "7701234567890"
  name: string;             // Ej: "Aceite Sintético 5W-30 1Gal"
  categoryId: string;       // Relación con Category.id
  categoryName: string;
  supplierId: string;       // Relación con Supplier.id
  supplierName: string;
  costPrice: number;        // Costo de compra unitario (ej. 85000)
  salePrice: number;        // Precio de venta sugerido (ej. 125000)
  marginPercent: number;    // Margen calculado automáticamente: ((salePrice - costPrice) / salePrice) * 100
  currentStock: number;     // Existencia física actual
  minStock: number;         // Umbral de stock de seguridad
  location: string;         // Ubicación en bodega (ej. "Pasillo A - Estante 2")
  unit: string;             // Unidad (Unidad, Galón, Caja, Litro)
  active: boolean;          // Estado de habilitación
}
```

### 2.4 Movimiento de Inventario / Auditoría (`StockMovement`)
```typescript
interface StockMovement {
  id: string;               // Ej: "mov-001"
  productId: string;
  productName: string;
  type: 'in' | 'out' | 'adjustment' | 'loss'; // Tipo de ajuste
  quantity: number;         // Cantidad alterada
  previousStock: number;
  newStock: number;
  reason: string;           // Motivo (ej: "Ajuste por conteo físico", "Merma por rotura")
  operatorName: string;     // Usuario responsable
  timestamp: string;        // Fecha ISO
}
```

### 2.5 Cliente (`Customer`)
```typescript
interface Customer {
  id: string;               // Ej: "cli-001"
  documentId: string;       // Cédula o NIT (ej. "1098234561")
  name: string;             // Ej: "Transportes del Norte S.A.S."
  phone: string;            // Ej: "312-555-0192"
  email: string;            // Ej: "contacto@transnorte.com"
  address: string;          // Ej: "Cra 45 # 12-80"
  creditLimit: number;      // Cupo máximo de crédito aprobado
  currentDebt: number;      // Saldo deudor actual
  status: 'active' | 'inactive' | 'overdue_blocked'; // Switch funcional
  notes?: string;
}
```

### 2.6 Proveedor (`Supplier`)
```typescript
interface Supplier {
  id: string;               // Ej: "prov-001"
  taxId: string;            // NIT o RFC (ej. "900.542.118-4")
  companyName: string;      // Ej: "Distribuidora Industrial Mobil Colombia"
  contactPerson: string;    // Ej: "Mariana Restrepo"
  phone: string;            // Ej: "601-380-4500"
  email: string;            // Ej: "ventas@distrimobil.com"
  leadTimeDays: number;     // Días promedio de entrega (ej: 3)
  rating: number;           // Calificación de servicio (1 a 5)
  active: boolean;          // Switch funcional
}
```

### 2.7 Venta (`Sale`)
```typescript
interface SaleItem {
  productId: string;
  productName: string;
  sku: string;
  unitPrice: number;
  costPrice: number;
  quantity: number;
  subtotal: number;
  margin: number;
}

interface Sale {
  id: string;               // Ej: "VTA-2024-001"
  date: string;             // Timestamp ISO
  customerId?: string;      // ID de cliente si es registrado o contado genérico
  customerName: string;
  paymentMethod: 'cash' | 'card' | 'transfer' | 'credit';
  items: SaleItem[];
  subtotal: number;
  tax: number;              // IVA (19%)
  discount: number;
  total: number;
  totalCost: number;
  netMargin: number;        // total - totalCost
  marginPercent: number;    // (netMargin / total) * 100
  cashierName: string;
  status: 'completed' | 'cancelled';
}
```

### 2.8 Crédito / Cuenta por Cobrar (`CreditAccount`)
```typescript
interface CreditPayment {
  id: string;               // Ej: "ABN-001"
  date: string;
  amount: number;
  paymentMethod: 'cash' | 'transfer';
  cashierName: string;
  receiptNumber: string;
}

interface CreditAccount {
  id: string;               // Ej: "CRE-001"
  saleId: string;           // Venta vinculada
  customerId: string;
  customerName: string;
  originalAmount: number;   // Monto inicial del crédito
  currentBalance: number;   // Saldo pendiente
  termDays: number;         // Plazo (ej: 30 días)
  dueDate: string;          // Fecha límite de pago
  status: 'current' | 'overdue' | 'paid'; // Al día, En mora, Saldado
  payments: CreditPayment[]; // Historial de abonos
}
```

### 2.9 Orden de Compra (`PurchaseOrder`)
```typescript
interface PurchaseOrderItem {
  productId: string;
  productName: string;
  sku: string;
  orderedQty: number;
  receivedQty: number;
  unitCost: number;
  totalCost: number;
}

interface PurchaseOrder {
  id: string;               // Ej: "OC-2024-089"
  supplierId: string;
  supplierName: string;
  issueDate: string;
  expectedDate: string;
  status: 'draft' | 'pending' | 'partially_received' | 'received' | 'cancelled';
  items: PurchaseOrderItem[];
  totalAmount: number;
  receptionHistory?: {
    date: string;
    lotNumber: string;
    expiryDate?: string;
    notes: string;
  }[];
}
```
