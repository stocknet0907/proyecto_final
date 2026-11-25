import React, { useState } from 'react';
import { Plus, Package, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { ProductTable } from '../components/ProductTable';
import { ProductFilters } from '../components/ProductFilters';
import { ProductFormModal } from '../components/ProductFormModal';
import { StockAdjustModal } from '../components/StockAdjustModal';
import { Button } from '../../../shared/components/Button';
import { useToast } from '../../../shared/components/Toast';
import { INITIAL_SUPPLIERS } from '../../suppliers/data/initialSuppliers';

export const ProductsPage = () => {
  const {
    products,
    categories,
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
  } = useProducts();

  const { addToast } = useToast();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isAdjustOpen, setIsAdjustOpen] = useState(false);
  const [adjustingProduct, setAdjustingProduct] = useState(null);

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleOpenAdjust = (product) => {
    setAdjustingProduct(product);
    setIsAdjustOpen(true);
  };

  const handleSaveProduct = (productData) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
      addToast({ message: 'Producto actualizado satisfactoriamente.', type: 'success' });
    } else {
      addProduct(productData);
      addToast({ message: 'Nuevo producto incorporado al catálogo.', type: 'success' });
    }
  };

  const handleStockAdjustment = (adjustData) => {
    const res = adjustStock(adjustData);
    if (res.success) {
      addToast({ message: 'Existencias de almacén actualizadas.', type: 'info' });
    }
    return res;
  };

  const handleToggleStatus = (id) => {
    toggleProductStatus(id);
    addToast({ message: 'Estado del producto modificado.', type: 'info' });
  };

  return (
    <div className="space-y-6">
      {/* Cabecera de Página */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-2xl text-ink-base">
            Catálogo Maestro de Productos
          </h2>
          <p className="text-xs sm:text-sm text-ink-muted">
            Control de referencias comerciales, existencias por almacén y márgenes de utilidad
          </p>
        </div>
        <Button variant="secondary" onClick={handleOpenCreate} icon={Plus}>
          Registrar Producto
        </Button>
      </div>

      {/* Tarjetas Resumen de Existencias */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-surface-lowest border border-borderline rounded-lg p-3.5 flex items-center gap-3 shadow-subtle">
          <div className="w-10 h-10 rounded-sm bg-primary-light flex items-center justify-center text-primary">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-ink-muted block">Total Referencias</span>
            <span className="font-display font-bold text-lg text-ink-base font-mono">
              {stockStats.totalCount}
            </span>
          </div>
        </div>

        <div className="bg-surface-lowest border border-borderline rounded-lg p-3.5 flex items-center gap-3 shadow-subtle">
          <div className="w-10 h-10 rounded-sm bg-status-success-bg flex items-center justify-center text-status-success">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-ink-muted block">En Existencia Óptima</span>
            <span className="font-display font-bold text-lg text-status-success font-mono">
              {stockStats.totalCount - stockStats.lowStockCount - stockStats.outOfStockCount}
            </span>
          </div>
        </div>

        <div className="bg-surface-lowest border border-borderline rounded-lg p-3.5 flex items-center gap-3 shadow-subtle">
          <div className="w-10 h-10 rounded-sm bg-status-warning-bg flex items-center justify-center text-status-warning">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-ink-muted block">Bajo Umbral Mínimo</span>
            <span className="font-display font-bold text-lg text-status-warning font-mono">
              {stockStats.lowStockCount}
            </span>
          </div>
        </div>

        <div className="bg-surface-lowest border border-borderline rounded-lg p-3.5 flex items-center gap-3 shadow-subtle">
          <div className="w-10 h-10 rounded-sm bg-status-error-bg flex items-center justify-center text-status-error">
            <XCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-ink-muted block">Sin Stock (Agotados)</span>
            <span className="font-display font-bold text-lg text-status-error font-mono">
              {stockStats.outOfStockCount}
            </span>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <ProductFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedStockStatus={selectedStockStatus}
        onStockStatusChange={setSelectedStockStatus}
        selectedActiveStatus={selectedActiveStatus}
        onActiveStatusChange={setSelectedActiveStatus}
      />

      {/* Tabla de Productos */}
      <ProductTable
        products={products}
        onEditProduct={handleOpenEdit}
        onAdjustStock={handleOpenAdjust}
        onToggleStatus={handleToggleStatus}
      />

      {/* Modales */}
      <ProductFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveProduct}
        product={editingProduct}
        categories={categories}
        suppliers={INITIAL_SUPPLIERS}
      />

      <StockAdjustModal
        isOpen={isAdjustOpen}
        onClose={() => setIsAdjustOpen(false)}
        product={adjustingProduct}
        onAdjust={handleStockAdjustment}
      />
    </div>
  );
};
