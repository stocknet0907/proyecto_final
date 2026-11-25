import { useState, useMemo } from 'react';
import { usePurchasesStore } from '../store/purchasesStore';

export const usePurchases = () => {
  const { orders, createOrder, receiveStock, cancelOrder } = usePurchasesStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch =
        !searchTerm.trim() ||
        o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.supplierName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = selectedStatus === 'all' || o.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, selectedStatus]);

  const purchaseStats = useMemo(() => {
    const pendingCount = orders.filter((o) => o.status === 'pending' || o.status === 'partially_received').length;
    const receivedCount = orders.filter((o) => o.status === 'received').length;
    const totalExpenditure = orders
      .filter((o) => o.status === 'received')
      .reduce((acc, o) => acc + o.totalAmount, 0);

    return { pendingCount, receivedCount, totalExpenditure };
  }, [orders]);

  return {
    orders: filteredOrders,
    allOrders: orders,
    searchTerm,
    setSearchTerm,
    selectedStatus,
    setSelectedStatus,
    purchaseStats,
    createOrder,
    receiveStock,
    cancelOrder,
  };
};
