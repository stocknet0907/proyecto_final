import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { INITIAL_SALES } from '../data/initialSales';

export const useSalesStore = create(
  persist(
    (set, get) => ({
      sales: INITIAL_SALES,

      addSale: (newSale) => {
        const state = get();
        set({ sales: [newSale, ...state.sales] });
      },

      cancelSale: (saleId) => {
        const state = get();
        set({
          sales: state.sales.map((s) => (s.id === saleId ? { ...s, status: 'cancelled' } : s)),
        });
      },

      resetMockData: () => {
        set({ sales: INITIAL_SALES });
      },
    }),
    {
      name: 'stocknet_sales',
    }
  )
);
