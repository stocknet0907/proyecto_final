import { useState, useMemo } from 'react';
import { useInventoryStore } from '../store/inventoryStore';

export const useProducts = () => {
  const {
    products,
    categories,
    movements,
    addProduct,
    updateProduct,
    toggleProductStatus,
    adjustStock,
  } = useInventoryStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStockStatus, setSelectedStockStatus] = useState('all'); // 'all', 'in_stock', 'low_stock', 'out_of_stock'
  const [selectedActiveStatus, setSelectedActiveStatus] = useState('all'); // 'all', 'active', 'inactive'

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Búsqueda por término (SKU, nombre, código de barras) (RF34, RF35, RF43)
      const matchesSearch =
        !searchTerm.trim() ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.barcode.includes(searchTerm);

      // Filtro por categoría (RF33)
      const matchesCategory =
        selectedCategory === 'all' || product.categoryId === selectedCategory;

      // Filtro por nivel de stock
      let matchesStock = true;
      if (selectedStockStatus === 'in_stock') {
        matchesStock = product.currentStock > product.minStock;
      } else if (selectedStockStatus === 'low_stock') {
        matchesStock = product.currentStock > 0 && product.currentStock <= product.minStock;
      } else if (selectedStockStatus === 'out_of_stock') {
        matchesStock = product.currentStock === 0;
      }

      // Filtro por estado activo/inactivo (RF39)
      let matchesActive = true;
      if (selectedActiveStatus === 'active') {
        matchesActive = product.active === true;
      } else if (selectedActiveStatus === 'inactive') {
        matchesActive = product.active === false;
      }

      return matchesSearch && matchesCategory && matchesStock && matchesActive;
    });
  }, [products, searchTerm, selectedCategory, selectedStockStatus, selectedActiveStatus]);

  // Contadores de stock para KPIs
  const stockStats = useMemo(() => {
    const totalCount = products.length;
    const lowStockCount = products.filter(
      (p) => p.currentStock > 0 && p.currentStock <= p.minStock
    ).length;
    const outOfStockCount = products.filter((p) => p.currentStock === 0).length;
    const activeCount = products.filter((p) => p.active).length;

    return { totalCount, lowStockCount, outOfStockCount, activeCount };
  }, [products]);

  return {
    products: filteredProducts,
    allProducts: products,
    categories,
    movements,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedStockStatus,
    setSelectedStockStatus,
    selectedActiveStatus,
    setSelectedActiveStatus,
    stockStats,
    addProduct,
    updateProduct,
    toggleProductStatus,
    adjustStock,
  };
};
