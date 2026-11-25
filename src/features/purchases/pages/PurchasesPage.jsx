import React, { useState } from 'react';
import { Plus, Search, Truck, Clock, CheckCircle2 } from 'lucide-react';
import { usePurchases } from '../hooks/usePurchases';
import { PurchaseOrdersTable } from '../components/PurchaseOrdersTable';
import { PurchaseOrderModal } from '../components/PurchaseOrderModal';
import { ReceiveStockModal } from '../components/ReceiveStockModal';
import { Button } from '../../../shared/components/Button';
import { Input } from '../../../shared/components/Input';
import { Select } from '../../../shared/components/Select';
import { useToast } from '../../../shared/components/Toast';
import { useInventoryStore } from '../../inventory/store/inventoryStore';
import { useSuppliersStore } from '../../suppliers/store/suppliersStore';
import { formatCurrency } from '../../../shared/utils/formatters';

export const PurchasesPage = () => {
  const {
    orders,
    searchTerm,
    setSearchTerm,
    selectedStatus,
    setSelectedStatus,
    purchaseStats,
    createOrder,
    receiveStock,
    cancelOrder,
  } = usePurchases();

  const { products } = useInventoryStore();
  const { suppliers } = useSuppliersStore();
  const { addToast } = useToast();

  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
  const [selectedOrderForReceive, setSelectedOrderForReceive] = useState(null);

  const handleCreateOrder = (orderData) => {
    const res = createOrder(orderData);
    addToast({ message: `Orden ${res.id} emitida exitosamente.`, type: 'success' });
  };

  const handleOpenReceive = (order) => {
    setSelectedOrderForReceive(order);
    setIsReceiveModalOpen(true);
  };

  const handleConfirmReceive = (receiveData) => {
    const res = receiveStock(receiveData);
    if (res.success) {
      addToast({
        message: 'Recepción completada. Stock de almacén incrementado.',
        type: 'success',
      });
    }
  };

  const handleCancelOrder = (order) => {
    cancelOrder(order.id);
    addToast({ message: `Orden ${order.id} cancelada.`, type: 'info' });
  };

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-2xl text-ink-base">
            Compras & Control de Recepción Unificado
          </h2>
          <p className="text-xs sm:text-sm text-ink-muted">
            Trazabilidad de órdenes de compra, verificación física con lote y actualización de stock
          </p>
        </div>
        <Button variant="secondary" onClick={() => setIsOrderModalOpen(true)} icon={Plus}>
          Nueva Orden de Compra
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-surface-lowest border border-borderline rounded-lg p-3.5 flex items-center gap-3 shadow-subtle">
          <div className="w-10 h-10 rounded-sm bg-status-warning-bg flex items-center justify-center text-status-warning">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-ink-muted block">Órdenes Pendientes de Recepción</span>
            <span className="font-display font-bold text-lg text-status-warning font-mono">
              {purchaseStats.pendingCount}
            </span>
          </div>
        </div>

        <div className="bg-surface-lowest border border-borderline rounded-lg p-3.5 flex items-center gap-3 shadow-subtle">
          <div className="w-10 h-10 rounded-sm bg-status-success-bg flex items-center justify-center text-status-success">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-ink-muted block">Órdenes Recibidas Conformes</span>
            <span className="font-display font-bold text-lg text-status-success font-mono">
              {purchaseStats.receivedCount}
            </span>
          </div>
        </div>

        <div className="bg-surface-lowest border border-borderline rounded-lg p-3.5 flex items-center gap-3 shadow-subtle">
          <div className="w-10 h-10 rounded-sm bg-primary-light flex items-center justify-center text-primary">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-ink-muted block">Gasto Histórico Recepcionado</span>
            <span className="font-display font-bold text-lg text-primary font-mono">
              {formatCurrency(purchaseStats.totalExpenditure)}
            </span>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-surface-lowest border border-borderline rounded-lg p-4 flex flex-col sm:flex-row items-center gap-3 shadow-subtle">
        <div className="flex-1 w-full">
          <Input
            placeholder="Buscar por N° Orden o Nombre de Proveedor..."
            icon={Search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-56">
          <Select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">Todos los Estados</option>
            <option value="pending">Pendientes</option>
            <option value="partially_received">Recepción Parcial</option>
            <option value="received">Recibidas Conformes</option>
            <option value="cancelled">Canceladas</option>
          </Select>
        </div>
      </div>

      {/* Tabla de Órdenes */}
      <PurchaseOrdersTable
        orders={orders}
        onReceiveStock={handleOpenReceive}
        onCancelOrder={handleCancelOrder}
      />

      {/* Modales */}
      <PurchaseOrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        onSave={handleCreateOrder}
        suppliers={suppliers}
        products={products}
      />

      <ReceiveStockModal
        isOpen={isReceiveModalOpen}
        onClose={() => setIsReceiveModalOpen(false)}
        order={selectedOrderForReceive}
        onConfirmReceive={handleConfirmReceive}
      />
    </div>
  );
};
