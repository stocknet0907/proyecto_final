export const INITIAL_PURCHASES = [
  {
    id: 'OC-2024-001',
    supplierId: 'prov-01',
    supplierName: 'Distribuidora Industrial Mobil Colombia',
    issueDate: '2026-11-15T08:00:00.000Z',
    expectedDate: '2026-11-18',
    status: 'received', // 'draft', 'pending', 'partially_received', 'received', 'cancelled'
    items: [
      {
        productId: 'prod-01',
        productName: 'Aceite Sintético 5W-30 Mobil 1 (1 Galón)',
        sku: 'LUB-MOB-5W30',
        orderedQty: 20,
        receivedQty: 20,
        unitCost: 95000,
        totalCost: 1900000,
      },
    ],
    totalAmount: 1900000,
    receptions: [
      {
        date: '2026-11-18T14:30:00.000Z',
        lotNumber: 'LOT-MOB-2026-B9',
        expiryDate: '2029-11-15',
        notes: 'Mercancía recibida en perfecto estado de sellado con certificado de calidad.',
        receivedBy: 'Laura Morales',
      },
    ],
  },
  {
    id: 'OC-2024-002',
    supplierId: 'prov-02',
    supplierName: 'Importadora Automotriz Andina S.A.S.',
    issueDate: '2026-11-19T10:00:00.000Z',
    expectedDate: '2026-11-23',
    status: 'pending',
    items: [
      {
        productId: 'prod-05',
        productName: 'Filtro de Aceite Blindado Bosch 0986AF0',
        sku: 'FLT-BOS-ACEITE',
        orderedQty: 30,
        receivedQty: 0,
        unitCost: 18000,
        totalCost: 540000,
      },
      {
        productId: 'prod-06',
        productName: 'Filtro de Aire Alto Flujo Mann Filter C250',
        sku: 'FLT-MAN-AIRE',
        orderedQty: 25,
        receivedQty: 0,
        unitCost: 28000,
        totalCost: 700000,
      },
    ],
    totalAmount: 1240000,
    receptions: [],
  },
];
