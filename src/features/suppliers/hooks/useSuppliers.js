import { useState, useMemo } from 'react';
import { useSuppliersStore } from '../store/suppliersStore';

export const useSuppliers = () => {
  const { suppliers, addSupplier, updateSupplier, toggleSupplierStatus } = useSuppliersStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((s) => {
      const matchesSearch =
        !searchTerm.trim() ||
        s.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.taxId.includes(searchTerm) ||
        s.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        selectedStatus === 'all' ||
        (selectedStatus === 'active' && s.active) ||
        (selectedStatus === 'inactive' && !s.active);

      return matchesSearch && matchesStatus;
    });
  }, [suppliers, searchTerm, selectedStatus]);

  return {
    suppliers: filteredSuppliers,
    allSuppliers: suppliers,
    searchTerm,
    setSearchTerm,
    selectedStatus,
    setSelectedStatus,
    addSupplier,
    updateSupplier,
    toggleSupplierStatus,
  };
};
