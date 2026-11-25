import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { INITIAL_CUSTOMERS } from '../data/initialCustomers';

export const useCustomersStore = create(
  persist(
    (set, get) => ({
      customers: INITIAL_CUSTOMERS,

      addCustomer: (customerData) => {
        const state = get();
        const newCustomer = {
          ...customerData,
          id: `cli-${Date.now()}`,
          creditLimit: Number(customerData.creditLimit) || 0,
          currentDebt: 0,
          status: customerData.status || 'active',
        };

        set({ customers: [newCustomer, ...state.customers] });
        return newCustomer;
      },

      updateCustomer: (id, updatedFields) => {
        const state = get();
        set({
          customers: state.customers.map((c) =>
            c.id === id
              ? {
                  ...c,
                  ...updatedFields,
                  creditLimit:
                    updatedFields.creditLimit !== undefined
                      ? Number(updatedFields.creditLimit)
                      : c.creditLimit,
                }
              : c
          ),
        });
      },

      toggleCustomerStatus: (id) => {
        const state = get();
        set({
          customers: state.customers.map((c) => {
            if (c.id === id) {
              const newStatus = c.status === 'active' ? 'inactive' : 'active';
              return { ...c, status: newStatus };
            }
            return c;
          }),
        });
      },

      // Ajuste de deuda por venta a crédito o abono
      adjustCustomerDebt: (customerId, amountDelta) => {
        const state = get();
        set({
          customers: state.customers.map((c) => {
            if (c.id === customerId) {
              const newDebt = Math.max(0, c.currentDebt + amountDelta);
              return { ...c, currentDebt: newDebt };
            }
            return c;
          }),
        });
      },

      resetMockData: () => {
        set({ customers: INITIAL_CUSTOMERS });
      },
    }),
    {
      name: 'stocknet_customers',
    }
  )
);
