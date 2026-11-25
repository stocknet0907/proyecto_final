import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useInventoryStore } from '../../inventory/store/inventoryStore';
import { useSalesStore } from '../../sales/store/salesStore';
import { useCustomersStore } from '../../customers/store/customersStore';
import { useCreditsStore } from '../../credits/store/creditsStore';

export const usePosStore = create(
  persist(
    (set, get) => ({
      cartItems: [],
      selectedCustomer: null,
      discountPercent: 0,
      activeSaleReceipt: null, // Para mostrar modal de ticket recién impreso

      // Añadir producto al carrito con validación de existencia (RF10, RF15)
      addItem: (product) => {
        const state = get();
        if (product.currentStock <= 0) {
          return { success: false, error: 'Producto agotado sin existencias en almacén.' };
        }

        const existingItem = state.cartItems.find((i) => i.productId === product.id);
        const currentQtyInCart = existingItem ? existingItem.quantity : 0;

        if (currentQtyInCart + 1 > product.currentStock) {
          return {
            success: false,
            error: `Existencia insuficiente. Solo quedan ${product.currentStock} unidades disponibles.`,
          };
        }

        if (existingItem) {
          const updatedItems = state.cartItems.map((item) => {
            if (item.productId === product.id) {
              const newQty = item.quantity + 1;
              const subtotal = newQty * item.unitPrice;
              const totalCost = newQty * item.costPrice;
              return {
                ...item,
                quantity: newQty,
                subtotal,
                margin: subtotal - totalCost,
              };
            }
            return item;
          });
          set({ cartItems: updatedItems });
        } else {
          const unitPrice = product.salePrice;
          const costPrice = product.costPrice;
          const newItem = {
            productId: product.id,
            productName: product.name,
            sku: product.sku,
            unitPrice,
            costPrice,
            quantity: 1,
            subtotal: unitPrice,
            margin: unitPrice - costPrice,
            unit: product.unit || 'Unidad',
            maxStock: product.currentStock,
          };
          set({ cartItems: [...state.cartItems, newItem] });
        }

        return { success: true };
      },

      updateQuantity: (productId, newQuantity) => {
        const state = get();
        if (newQuantity <= 0) {
          get().removeItem(productId);
          return;
        }

        const item = state.cartItems.find((i) => i.productId === productId);
        if (item && newQuantity > item.maxStock) {
          return {
            success: false,
            error: `Existencia máxima disponible: ${item.maxStock} unidades.`,
          };
        }

        const updatedItems = state.cartItems.map((item) => {
          if (item.productId === productId) {
            const subtotal = newQuantity * item.unitPrice;
            const totalCost = newQuantity * item.costPrice;
            return {
              ...item,
              quantity: newQuantity,
              subtotal,
              margin: subtotal - totalCost,
            };
          }
          return item;
        });

        set({ cartItems: updatedItems });
        return { success: true };
      },

      removeItem: (productId) => {
        const state = get();
        set({
          cartItems: state.cartItems.filter((i) => i.productId !== productId),
        });
      },

      clearCart: () => {
        set({ cartItems: [], selectedCustomer: null, discountPercent: 0 });
      },

      setCustomer: (customer) => {
        set({ selectedCustomer: customer });
      },

      setDiscount: (percent) => {
        set({ discountPercent: Math.max(0, Math.min(100, Number(percent) || 0)) });
      },

      setActiveSaleReceipt: (receipt) => {
        set({ activeSaleReceipt: receipt });
      },

      // Procesar venta atómica (RF10, RF11, RF26, RF36, RNF09)
      processSale: ({
        paymentMethod,
        cashTendered,
        creditTermDays = 30,
        cashierName = 'Cajero Turno 1',
      }) => {
        const state = get();
        if (state.cartItems.length === 0) {
          return { success: false, error: 'El carrito de venta se encuentra vacío.' };
        }

        // Cálculos de liquidación
        const subtotal = state.cartItems.reduce((acc, i) => acc + i.subtotal, 0);
        const discountAmount = (subtotal * state.discountPercent) / 100;
        const subtotalAfterDiscount = subtotal - discountAmount;
        const tax = Math.round(subtotalAfterDiscount * 0.19); // IVA 19%
        const total = subtotalAfterDiscount + tax;

        const totalCost = state.cartItems.reduce((acc, i) => acc + i.costPrice * i.quantity, 0);
        const netMargin = total - tax - totalCost; // Margen antes de impuestos
        const marginPercent = total > 0 ? Number(((netMargin / (total - tax)) * 100).toFixed(1)) : 0;

        // Si es venta a crédito, validar cupo de cliente (RF26)
        if (paymentMethod === 'credit') {
          if (!state.selectedCustomer) {
            return { success: false, error: 'Debe seleccionar un cliente registrado para venta a crédito.' };
          }
          if (state.selectedCustomer.status !== 'active') {
            return { success: false, error: 'El cliente no está habilitado para créditos comerciales.' };
          }
          const availableCredit =
            (state.selectedCustomer.creditLimit || 0) - (state.selectedCustomer.currentDebt || 0);
          if (total > availableCredit) {
            return {
              success: false,
              error: `El valor de la venta ($ ${total}) excede el cupo disponible del cliente ($ ${availableCredit}).`,
            };
          }
        }

        const saleRecord = {
          id: `FAC-${Date.now().toString().slice(-6)}`,
          date: new Date().toISOString(),
          customerId: state.selectedCustomer?.id || null,
          customerName: state.selectedCustomer?.name || 'Cliente de Mostrador (Contado)',
          customerDocument: state.selectedCustomer?.documentId || '222222222222',
          paymentMethod,
          items: state.cartItems,
          subtotal,
          discount: discountAmount,
          tax,
          total,
          totalCost,
          netMargin,
          marginPercent,
          cashTendered: Number(cashTendered) || total,
          change: Number(cashTendered) ? Math.max(0, Number(cashTendered) - total) : 0,
          cashierName,
          status: 'completed',
        };

        // 1. Descontar inventario en caliente
        useInventoryStore.getState().decrementStockBatch(state.cartItems, cashierName);

        // 2. Registrar en historial de ventas
        useSalesStore.getState().addSale(saleRecord);

        // 3. Si fue a crédito, actualizar deuda y crear cuenta por cobrar
        if (paymentMethod === 'credit' && state.selectedCustomer) {
          useCustomersStore.getState().adjustCustomerDebt(state.selectedCustomer.id, total);
          useCreditsStore.getState().createCreditAccount({
            saleId: saleRecord.id,
            customerId: state.selectedCustomer.id,
            customerName: state.selectedCustomer.name,
            originalAmount: total,
            termDays: creditTermDays,
          });
        }

        // Limpiar carrito y establecer recibo activo para visualización
        set({
          cartItems: [],
          selectedCustomer: null,
          discountPercent: 0,
          activeSaleReceipt: saleRecord,
        });

        return { success: true, sale: saleRecord };
      },

      resetMockData: () => {
        set({ cartItems: [], selectedCustomer: null, discountPercent: 0, activeSaleReceipt: null });
      },
    }),
    {
      name: 'stocknet_pos',
    }
  )
);
