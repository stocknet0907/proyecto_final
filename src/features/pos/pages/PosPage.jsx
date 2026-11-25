import React, { useState } from 'react';
import { usePos } from '../hooks/usePos';
import { PosProductGrid } from '../components/PosProductGrid';
import { PosCartDrawer } from '../components/PosCartDrawer';
import { PosCheckoutModal } from '../components/PosCheckoutModal';
import { PosReceiptModal } from '../components/PosReceiptModal';
import { Modal } from '../../../shared/components/Modal';
import { Button } from '../../../shared/components/Button';
import { useToast } from '../../../shared/components/Toast';

export const PosPage = () => {
  const {
    cartItems,
    selectedCustomer,
    discountPercent,
    activeSaleReceipt,
    posProducts,
    categories,
    customers,
    cartTotals,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    setCustomer,
    setDiscount,
    processSale,
    setActiveSaleReceipt,
  } = usePos();

  const { addToast } = useToast();

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);

  const handleAddToCart = (product) => {
    const res = addItem(product);
    if (!res.success) {
      addToast({ message: res.error, type: 'error' });
    }
  };

  const handleUpdateQty = (productId, newQty) => {
    const res = updateQuantity(productId, newQty);
    if (res && !res.success) {
      addToast({ message: res.error, type: 'error' });
    }
  };

  const handleConfirmSale = (checkoutData) => {
    const res = processSale(checkoutData);
    if (res.success) {
      addToast({ message: `Venta ${res.sale.id} completada exitosamente.`, type: 'success' });
    }
    return res;
  };

  return (
    <div className="h-[calc(100vh-6.5rem)] flex flex-col lg:flex-row gap-4">
      {/* Columna Izquierda: Grid de Productos */}
      <div className="flex-1 h-full min-w-0">
        <PosProductGrid
          products={posProducts}
          categories={categories}
          onAddToCart={handleAddToCart}
        />
      </div>

      {/* Columna Derecha: Carrito de Venta Fijo */}
      <div className="w-full lg:w-96 h-full shrink-0">
        <PosCartDrawer
          cartItems={cartItems}
          totals={cartTotals}
          selectedCustomer={selectedCustomer}
          discountPercent={discountPercent}
          onUpdateQty={handleUpdateQty}
          onRemoveItem={removeItem}
          onClearCart={clearCart}
          onOpenCustomerSelect={() => setIsCustomerModalOpen(true)}
          onSetDiscount={setDiscount}
          onProceedCheckout={() => setIsCheckoutOpen(true)}
        />
      </div>

      {/* Modal de Cobro */}
      <PosCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        total={cartTotals.total}
        selectedCustomer={selectedCustomer}
        customers={customers}
        onSelectCustomer={setCustomer}
        onConfirmSale={handleConfirmSale}
      />

      {/* Modal de Recibo Recién Emitido */}
      <PosReceiptModal
        isOpen={!!activeSaleReceipt}
        onClose={() => setActiveSaleReceipt(null)}
        sale={activeSaleReceipt}
      />

      {/* Modal Rápido de Asignación de Cliente */}
      <Modal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        title="Asignar Cliente a la Orden"
        subtitle="Seleccione un comprador para facturación nominal o crédito"
        maxWidth="max-w-md"
      >
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => {
              setCustomer(null);
              setIsCustomerModalOpen(false);
            }}
            className="w-full p-2.5 rounded-sm border border-borderline hover:bg-surface-container text-left flex items-center justify-between text-xs"
          >
            <span className="font-semibold text-ink-base">Cliente de Mostrador (Contado General)</span>
            <span className="text-ink-muted">Sin Crédito</span>
          </button>

          {customers.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                setCustomer(c);
                setIsCustomerModalOpen(false);
              }}
              className="w-full p-2.5 rounded-sm border border-borderline hover:border-primary text-left flex items-center justify-between text-xs"
            >
              <div>
                <p className="font-semibold text-ink-base">{c.name}</p>
                <p className="text-[10px] text-ink-muted">NIT/CC: {c.documentId}</p>
              </div>
              <span className="font-mono text-primary font-semibold">
                Cupo: {c.creditLimit > 0 ? `$ ${(c.creditLimit - c.currentDebt) / 1000}k` : '$ 0'}
              </span>
            </button>
          ))}
        </div>
      </Modal>
    </div>
  );
};
