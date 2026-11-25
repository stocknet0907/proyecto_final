export const WAREHOUSE_LOCATIONS = [
  { id: 'wh-main', name: 'Almacén Principal (Bodega Central)', code: 'BOD-01' },
  { id: 'wh-north', name: 'Sucursal Norte (Punto de Venta)', code: 'SUC-02' },
  { id: 'wh-transit', name: 'Almacén en Tránsito / Despachos', code: 'TRN-03' },
];

export const PAYMENT_METHODS = [
  { id: 'cash', label: 'Efectivo', icon: 'Banknote' },
  { id: 'card', label: 'Tarjeta Débito/Crédito', icon: 'CreditCard' },
  { id: 'transfer', label: 'Transferencia Bancaria', icon: 'QrCode' },
  { id: 'credit', label: 'Crédito Directo Comercial', icon: 'CalendarClock' },
];

export const STOCK_STATUSES = {
  IN_STOCK: { label: 'En Existencia', variant: 'success' },
  LOW_STOCK: { label: 'Stock Bajo', variant: 'warning' },
  OUT_OF_STOCK: { label: 'Agotado', variant: 'error' },
};
