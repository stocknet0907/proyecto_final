import { useState, useMemo } from 'react';
import { useInventoryStore } from '../store/inventoryStore';

export const useCategories = () => {
  const {
    categories,
    products,
    addCategory,
    updateCategory,
    toggleCategoryStatus,
  } = useInventoryStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all'); // 'all', 'active', 'inactive'

  const enrichedCategories = useMemo(() => {
    return categories.map((cat) => {
      const liveProductCount = products.filter((p) => p.categoryId === cat.id).length;
      return {
        ...cat,
        productCount: liveProductCount,
      };
    });
  }, [categories, products]);

  const filteredCategories = useMemo(() => {
    return enrichedCategories.filter((cat) => {
      const matchesSearch =
        !searchTerm.trim() ||
        cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.department.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        selectedStatus === 'all' ||
        (selectedStatus === 'active' && cat.active) ||
        (selectedStatus === 'inactive' && !cat.active);

      return matchesSearch && matchesStatus;
    });
  }, [enrichedCategories, searchTerm, selectedStatus]);

  return {
    categories: filteredCategories,
    allCategories: enrichedCategories,
    searchTerm,
    setSearchTerm,
    selectedStatus,
    setSelectedStatus,
    addCategory,
    updateCategory,
    toggleCategoryStatus,
  };
};
