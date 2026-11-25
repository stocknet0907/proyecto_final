import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { INITIAL_CREDITS } from '../data/initialCredits';
import { useCustomersStore } from '../../customers/store/customersStore';

export const useCreditsStore = create(
  persist(
    (set, get) => ({
      credits: INITIAL_CREDITS,

      createCreditAccount: ({
        saleId,
        customerId,
        customerName,
        customerDocument,
        originalAmount,
        termDays = 30,
      }) => {
        const state = get();
        const issueDate = new Date();
        const dueDate = new Date(issueDate.getTime() + termDays * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0];

        const newCredit = {
          id: `CRE-${Date.now().toString().slice(-6)}`,
          saleId,
          customerId,
          customerName,
          customerDocument: customerDocument || 'Doc. Registrado',
          originalAmount,
          currentBalance: originalAmount,
          termDays,
          issueDate: issueDate.toISOString(),
          dueDate,
          status: 'current',
          payments: [],
        };

        set({ credits: [newCredit, ...state.credits] });
        return newCredit;
      },

      // Registrar abono con amortización y cierre automático (RF27, RF29)
      registerPayment: ({ creditId, amount, paymentMethod = 'cash', notes, cashierName = 'Cajero' }) => {
        const state = get();
        const credit = state.credits.find((c) => c.id === creditId);
        if (!credit) return { success: false, error: 'Crédito no encontrado.' };

        const payNum = Number(amount) || 0;
        if (payNum <= 0) return { success: false, error: 'El importe del abono debe ser positivo.' };
        if (payNum > credit.currentBalance) {
          return {
            success: false,
            error: `El abono ($ ${payNum}) supera el saldo pendiente ($ ${credit.currentBalance}).`,
          };
        }

        const newBalance = credit.currentBalance - payNum;
        const isPaidInFull = newBalance === 0;

        const paymentRecord = {
          id: `ABN-${Date.now().toString().slice(-6)}`,
          date: new Date().toISOString(),
          amount: payNum,
          paymentMethod,
          receiptNumber: `REC-${Date.now().toString().slice(-5)}`,
          cashierName,
          notes: notes || 'Abono a capital de crédito',
        };

        const updatedCredits = state.credits.map((c) =>
          c.id === creditId
            ? {
                ...c,
                currentBalance: newBalance,
                status: isPaidInFull ? 'paid' : c.status,
                payments: [paymentRecord, ...(c.payments || [])],
              }
            : c
        );

        // Descontar la deuda consolidada del cliente en customersStore
        useCustomersStore.getState().adjustCustomerDebt(credit.customerId, -payNum);

        set({ credits: updatedCredits });
        return { success: true, payment: paymentRecord, newBalance, isPaidInFull };
      },

      resetMockData: () => {
        set({ credits: INITIAL_CREDITS });
      },
    }),
    {
      name: 'stocknet_credits',
    }
  )
);
