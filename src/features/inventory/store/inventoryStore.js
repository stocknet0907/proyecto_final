import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_STOCK_MOVEMENTS,
} from '../data/initialInventory';

export const useInventoryStore = create(
  persist(
    (set, get) => ({
      products: INITIAL_PRODUCTS,
      categories: INITIAL_CATEGORIES,
      movements: INITIAL_STOCK_MOVEMENTS,

      // --- Operaciones de Productos (RF09, RF13, RF14, RF16, RF17) ---
      addProduct: (newProductData) => {
        const state = get();
        const cost = Number(newProductData.costPrice) || 0;
        const sale = Number(newProductData.salePrice) || 0;
        const marginPercent = sale > 0 ? Number((((sale - cost) / sale) * 100).toFixed(1)) : 0;

        const newProduct = {
          ...newProductData,
          id: `prod-${Date.now()}`,
          costPrice: cost,
          salePrice: sale,
          marginPercent,
          currentStock: Number(newProductData.currentStock) || 0,
          minStock: Number(newProductData.minStock) || 5,
          active: newProductData.active !== undefined ? newProductData.active : true,
        };

        // Actualizar conteo en categoría
        const updatedCategories = state.categories.map((c) =>
          c.id === newProduct.categoryId ? { ...c, productCount: (c.productCount || 0) + 1 } : c
        );

        set({
          products: [newProduct, ...state.products],
          categories: updatedCategories,
        });

        return newProduct;
      },

      updateProduct: (id, updatedFields) => {
        const state = get();
        const existing = state.products.find((p) => p.id === id);
        if (!existing) return null;

        const cost = updatedFields.costPrice !== undefined ? Number(updatedFields.costPrice) : existing.costPrice;
        const sale = updatedFields.salePrice !== undefined ? Number(updatedFields.salePrice) : existing.salePrice;
        const marginPercent = sale > 0 ? Number((((sale - cost) / sale) * 100).toFixed(1)) : 0;

        const updatedProducts = state.products.map((p) =>
          p.id === id
            ? {
                ...p,
                ...updatedFields,
                costPrice: cost,
                salePrice: sale,
                marginPercent,
                currentStock:
                  updatedFields.currentStock !== undefined
                    ? Number(updatedFields.currentStock)
                    : p.currentStock,
                minStock:
                  updatedFields.minStock !== undefined
                    ? Number(updatedFields.minStock)
                    : p.minStock,
              }
            : p
        );

        set({ products: updatedProducts });
      },

      toggleProductStatus: (id) => {
        const state = get();
        set({
          products: state.products.map((p) => (p.id === id ? { ...p, active: !p.active } : p)),
        });
      },

      // --- Ajuste Físico de Existencias y Auditoría (RF30, RF32) ---
      adjustStock: ({ productId, type, quantity, reason, operatorName }) => {
        const state = get();
        const product = state.products.find((p) => p.id === productId);
        if (!product) return { success: false, error: 'Producto no encontrado' };

        const qty = Number(quantity);
        let newStock = product.currentStock;

        if (type === 'in') {
          newStock += qty;
        } else if (type === 'out' || type === 'loss') {
          if (product.currentStock < qty) {
            return { success: false, error: 'La cantidad a retirar supera la existencia actual.' };
          }
          newStock -= qty;
        } else if (type === 'adjustment') {
          newStock = qty; // Reajuste absoluto tras conteo físico
        }

        const newMovement = {
          id: `mov-${Date.now()}`,
          productId: product.id,
          productName: product.name,
          type,
          quantity: qty,
          previousStock: product.currentStock,
          newStock,
          reason: reason || 'Ajuste manual de inventario',
          operatorName: operatorName || 'Operador',
          timestamp: new Date().toISOString(),
        };

        const updatedProducts = state.products.map((p) =>
          p.id === productId ? { ...p, currentStock: newStock } : p
        );

        set({
          products: updatedProducts,
          movements: [newMovement, ...state.movements],
        });

        return { success: true, newStock, movement: newMovement };
      },

      // Decrementar stock directo por venta POS
      decrementStockBatch: (saleItems, operatorName = 'Cajero POS') => {
        const state = get();
        const updatedProducts = [...state.products];
        const newMovements = [];

        for (const item of saleItems) {
          const idx = updatedProducts.findIndex((p) => p.id === item.productId);
          if (idx !== -1) {
            const current = updatedProducts[idx];
            const newStock = Math.max(0, current.currentStock - item.quantity);
            updatedProducts[idx] = { ...current, currentStock: newStock };

            newMovements.push({
              id: `mov-sale-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
              productId: current.id,
              productName: current.name,
              type: 'out',
              quantity: item.quantity,
              previousStock: current.currentStock,
              newStock,
              reason: `Venta POS`,
              operatorName,
              timestamp: new Date().toISOString(),
            });
          }
        }

        set({
          products: updatedProducts,
          movements: [...newMovements, ...state.movements],
        });
      },

      // Incrementar stock por recepción de compra
      incrementStockBatch: (purchaseItems, operatorName = 'Almacén') => {
        const state = get();
        const updatedProducts = [...state.products];
        const newMovements = [];

        for (const item of purchaseItems) {
          const idx = updatedProducts.findIndex((p) => p.id === item.productId);
          if (idx !== -1) {
            const current = updatedProducts[idx];
            const newStock = current.currentStock + item.receivedQty;
            updatedProducts[idx] = {
              ...current,
              currentStock: newStock,
              costPrice: item.unitCost || current.costPrice,
            };

            newMovements.push({
              id: `mov-rec-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
              productId: current.id,
              productName: current.name,
              type: 'in',
              quantity: item.receivedQty,
              previousStock: current.currentStock,
              newStock,
              reason: `Recepción de Orden de Compra`,
              operatorName,
              timestamp: new Date().toISOString(),
            });
          }
        }

        set({
          products: updatedProducts,
          movements: [...newMovements, ...state.movements],
        });
      },

      // --- Operaciones de Categorías (RF07, RF08) ---
      addCategory: (newCategoryData) => {
        const state = get();
        const newCategory = {
          ...newCategoryData,
          id: `cat-${Date.now()}`,
          productCount: 0,
          active: newCategoryData.active !== undefined ? newCategoryData.active : true,
        };

        set({ categories: [...state.categories, newCategory] });
        return newCategory;
      },

      updateCategory: (id, updatedFields) => {
        const state = get();
        set({
          categories: state.categories.map((c) => (c.id === id ? { ...c, ...updatedFields } : c)),
        });
      },

      toggleCategoryStatus: (id) => {
        const state = get();
        const category = state.categories.find((c) => c.id === id);
        if (!category) return;

        // Si se va a inactivar y tiene productos asociados activos, alertar
        const hasActiveProducts = state.products.some(
          (p) => p.categoryId === id && p.active
        );

        set({
          categories: state.categories.map((c) =>
            c.id === id ? { ...c, active: !c.active } : c
          ),
        });

        return { hasActiveProducts, newStatus: !category.active };
      },

      resetMockData: () => {
        set({
          products: INITIAL_PRODUCTS,
          categories: INITIAL_CATEGORIES,
          movements: INITIAL_STOCK_MOVEMENTS,
        });
      },
    }),
    {
      name: 'stocknet_inventory',
    }
  )
);
