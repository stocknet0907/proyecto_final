import { useState, useMemo } from 'react';
import { useSalesStore } from '../store/salesStore';

export const useSales = () => {
  const { sales, addSale, cancelSale } = useSalesStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const filteredSales = useMemo(() => {
    return sales.filter((s) => {
      const matchesSearch =
        !searchTerm.trim() ||
        s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.customerDocument.includes(searchTerm);

      const matchesPayment =
        selectedPaymentMethod === 'all' || s.paymentMethod === selectedPaymentMethod;

      const matchesStatus = selectedStatus === 'all' || s.status === selectedStatus;

      return matchesSearch && matchesPayment && matchesStatus;
    });
  }, [sales, searchTerm, selectedPaymentMethod, selectedStatus]);

  // Indicadores de Rentabilidad y Márgenes (RF16, RF41, RF44)
  const financialMetrics = useMemo(() => {
    const completed = sales.filter((s) => s.status === 'completed');
    const grossSales = completed.reduce((acc, s) => acc + s.total, 0);
    const subtotalBeforeTax = completed.reduce((acc, s) => acc + s.subtotal - s.discount, 0);
    const totalCOGS = completed.reduce((acc, s) => acc + s.totalCost, 0);
    const netProfit = subtotalBeforeTax - totalCOGS;
    const avgMarginPercent =
      subtotalBeforeTax > 0 ? Number(((netProfit / subtotalBeforeTax) * 100).toFixed(1)) : 0;

    return {
      grossSales,
      totalCOGS,
      netProfit,
      avgMarginPercent,
      salesCount: completed.length,
    };
  }, [sales]);

  return {
    sales: filteredSales,
    allSales: sales,
    searchTerm,
    setSearchTerm,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    selectedStatus,
    setSelectedStatus,
    financialMetrics,
    addSale,
    cancelSale,
  };
};
