import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { INITIAL_SUPPLIERS } from '../data/initialSuppliers';

export const useSuppliersStore = create(
  persist(
    (set, get) => ({
      suppliers: INITIAL_SUPPLIERS,

      addSupplier: (supplierData) => {
        const state = get();
        const newSupplier = {
          ...supplierData,
          id: `prov-${Date.now()}`,
          active: supplierData.active !== undefined ? supplierData.active : true,
          rating: Number(supplierData.rating) || 5,
          leadTimeDays: Number(supplierData.leadTimeDays) || 3,
        };

        set({ suppliers: [newSupplier, ...state.suppliers] });
        return newSupplier;
      },

      updateSupplier: (id, updatedFields) => {
        const state = get();
        set({
          suppliers: state.suppliers.map((s) =>
            s.id === id
              ? {
                  ...s,
                  ...updatedFields,
                  rating:
                    updatedFields.rating !== undefined ? Number(updatedFields.rating) : s.rating,
                  leadTimeDays:
                    updatedFields.leadTimeDays !== undefined
                      ? Number(updatedFields.leadTimeDays)
                      : s.leadTimeDays,
                }
              : s
          ),
        });
      },

      toggleSupplierStatus: (id) => {
        const state = get();
        set({
          suppliers: state.suppliers.map((s) =>
            s.id === id ? { ...s, active: !s.active } : s
          ),
        });
      },

      resetMockData: () => {
        set({ suppliers: INITIAL_SUPPLIERS });
      },
    }),
    {
      name: 'stocknet_suppliers',
    }
  )
);
