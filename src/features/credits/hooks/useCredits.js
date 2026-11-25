import { useState, useMemo } from 'react';
import { useCreditsStore } from '../store/creditsStore';

export const useCredits = () => {
  const { credits, createCreditAccount, registerPayment } = useCreditsStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all'); // 'all', 'current', 'overdue', 'paid'

  const filteredCredits = useMemo(() => {
    return credits.filter((c) => {
      const matchesSearch =
        !searchTerm.trim() ||
        c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.saleId.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = selectedStatus === 'all' || c.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [credits, searchTerm, selectedStatus]);

  // Estadísticas consolidadas de Cartera (RF28)
  const portfolioStats = useMemo(() => {
    const totalCurrentDebt = credits
      .filter((c) => c.status === 'current')
      .reduce((acc, c) => acc + c.currentBalance, 0);

    const totalOverdueDebt = credits
      .filter((c) => c.status === 'overdue')
      .reduce((acc, c) => acc + c.currentBalance, 0);

    const totalRecovered = credits.reduce(
      (acc, c) => acc + (c.payments?.reduce((pAcc, p) => pAcc + p.amount, 0) || 0),
      0
    );

    return {
      totalCurrentDebt,
      totalOverdueDebt,
      totalPortfolio: totalCurrentDebt + totalOverdueDebt,
      totalRecovered,
    };
  }, [credits]);

  return {
    credits: filteredCredits,
    allCredits: credits,
    searchTerm,
    setSearchTerm,
    selectedStatus,
    setSelectedStatus,
    portfolioStats,
    createCreditAccount,
    registerPayment,
  };
};
