import { useState, useMemo } from 'react';
import { useCustomersStore } from '../store/customersStore';

export const useCustomers = () => {
  const {
    customers,
    addCustomer,
    updateCustomer,
    toggleCustomerStatus,
    adjustCustomerDebt,
  } = useCustomersStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const matchesSearch =
        !searchTerm.trim() ||
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.documentId.includes(searchTerm) ||
        c.phone.includes(searchTerm);

      const matchesStatus =
        selectedStatus === 'all' || c.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [customers, searchTerm, selectedStatus]);

  const debtStats = useMemo(() => {
    const totalDebt = customers.reduce((acc, c) => acc + (c.currentDebt || 0), 0);
    const totalCreditAssigned = customers.reduce((acc, c) => acc + (c.creditLimit || 0), 0);
    const blockedCount = customers.filter((c) => c.status === 'overdue_blocked').length;

    return { totalDebt, totalCreditAssigned, blockedCount };
  }, [customers]);

  return {
    customers: filteredCustomers,
    allCustomers: customers,
    searchTerm,
    setSearchTerm,
    selectedStatus,
    setSelectedStatus,
    debtStats,
    addCustomer,
    updateCustomer,
    toggleCustomerStatus,
    adjustCustomerDebt,
  };
};
