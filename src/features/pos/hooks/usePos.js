import { useMemo } from 'react';
import { usePosStore } from '../store/posStore';
import { useInventoryStore } from '../../inventory/store/inventoryStore';
import { useCustomersStore } from '../../customers/store/customersStore';

export const usePos = () => {
  const {
    cartItems,
    selectedCustomer,
    discountPercent,
    activeSaleReceipt,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    setCustomer,
    setDiscount,
    processSale,
    setActiveSaleReceipt,
  } = usePosStore();

  const { products, categories } = useInventoryStore();
  const { customers } = useCustomersStore();

  // Productos disponibles para venta en el POS (solo activos)
  const posProducts = useMemo(() => {
    return products.filter((p) => p.active);
  }, [products]);

  // Totales calculados en caliente
  const cartTotals = useMemo(() => {
    const subtotal = cartItems.reduce((acc, i) => acc + i.subtotal, 0);
    const discountAmount = Math.round((subtotal * discountPercent) / 100);
    const subtotalAfterDiscount = subtotal - discountAmount;
    const tax = Math.round(subtotalAfterDiscount * 0.19); // IVA 19%
    const total = subtotalAfterDiscount + tax;
    const totalItems = cartItems.reduce((acc, i) => acc + i.quantity, 0);

    return {
      subtotal,
      discountAmount,
      subtotalAfterDiscount,
      tax,
      total,
      totalItems,
    };
  }, [cartItems, discountPercent]);

  return {
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
  };
};
