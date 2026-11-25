import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { INITIAL_PURCHASES } from '../data/initialPurchases';
import { useInventoryStore } from '../../inventory/store/inventoryStore';

export const usePurchasesStore = create(
  persist(
    (set, get) => ({
      orders: INITIAL_PURCHASES,

      createOrder: (orderData) => {
        const state = get();
        const items = orderData.items || [];
        const totalAmount = items.reduce((acc, i) => acc + (i.unitCost * i.orderedQty), 0);

        const newOrder = {
          ...orderData,
          id: `OC-${Date.now().toString().slice(-6)}`,
          issueDate: new Date().toISOString(),
          status: 'pending',
          items: items.map((i) => ({ ...i, receivedQty: 0, totalCost: i.unitCost * i.orderedQty })),
          totalAmount,
          receptions: [],
        };

        set({ orders: [newOrder, ...state.orders] });
        return newOrder;
      },

      receiveStock: ({ orderId, receivedItems, lotNumber, expiryDate, notes, receivedBy = 'Almacén' }) => {
        const state = get();
        const order = state.orders.find((o) => o.id === orderId);
        if (!order) return { success: false, error: 'Orden de compra no encontrada' };

        const updatedOrderItems = order.items.map((item) => {
          const rec = receivedItems.find((r) => r.productId === item.productId);
          const addQty = rec ? Number(rec.receivedQty) || 0 : 0;
          return {
            ...item,
            receivedQty: item.receivedQty + addQty,
          };
        });

        // Determinar si ya se completaron todas las cantidades
        const isFullyReceived = updatedOrderItems.every((i) => i.receivedQty >= i.orderedQty);

        const newReception = {
          date: new Date().toISOString(),
          lotNumber: lotNumber || `LOT-${Date.now().toString().slice(-5)}`,
          expiryDate: expiryDate || null,
          notes: notes || 'Recepción técnica conforme',
          receivedBy,
        };

        const updatedOrders = state.orders.map((o) =>
          o.id === orderId
            ? {
                ...o,
                status: isFullyReceived ? 'received' : 'partially_received',
                items: updatedOrderItems,
                receptions: [newReception, ...(o.receptions || [])],
              }
            : o
        );

        // Incrementar el stock en inventario (RF23, RNF09)
        const itemsToIncrement = receivedItems
          .filter((i) => Number(i.receivedQty) > 0)
          .map((i) => {
            const original = order.items.find((item) => item.productId === i.productId);
            return {
              productId: i.productId,
              receivedQty: Number(i.receivedQty),
              unitCost: original?.unitCost,
            };
          });

        if (itemsToIncrement.length > 0) {
          useInventoryStore.getState().incrementStockBatch(itemsToIncrement, receivedBy);
        }

        set({ orders: updatedOrders });
        return { success: true };
      },

      cancelOrder: (orderId) => {
        const state = get();
        set({
          orders: state.orders.map((o) =>
            o.id === orderId ? { ...o, status: 'cancelled' } : o
          ),
        });
      },

      resetMockData: () => {
        set({ orders: INITIAL_PURCHASES });
      },
    }),
    {
      name: 'stocknet_purchases',
    }
  )
);
