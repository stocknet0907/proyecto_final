import React, { useState } from 'react';
import { Plus, Boxes, Search } from 'lucide-react';
import { useCategories } from '../hooks/useCategories';
import { CategoryTable } from '../components/CategoryTable';
import { CategoryFormModal } from '../components/CategoryFormModal';
import { Button } from '../../../shared/components/Button';
import { Input } from '../../../shared/components/Input';
import { Select } from '../../../shared/components/Select';
import { useToast } from '../../../shared/components/Toast';

export const CategoriesPage = () => {
  const {
    categories,
    searchTerm,
    setSearchTerm,
    selectedStatus,
    setSelectedStatus,
    addCategory,
    updateCategory,
    toggleCategoryStatus,
  } = useCategories();

  const { addToast } = useToast();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (category) => {
    setEditingCategory(category);
    setIsFormOpen(true);
  };

  const handleSaveCategory = (catData) => {
    if (editingCategory) {
      updateCategory(editingCategory.id, catData);
      addToast({ message: 'Categoría actualizada exitosamente.', type: 'success' });
    } else {
      addCategory(catData);
      addToast({ message: 'Nueva categoría registrada.', type: 'success' });
    }
  };

  const handleToggleStatus = (id) => {
    const res = toggleCategoryStatus(id);
    if (res && res.hasActiveProducts && !res.newStatus) {
      addToast({
        message: 'Advertencia: La categoría posee productos activos asociados.',
        type: 'info',
      });
    } else {
      addToast({ message: 'Estado de categoría actualizado.', type: 'info' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-2xl text-ink-base">
            Estructura de Categorías de Inventario
          </h2>
          <p className="text-xs sm:text-sm text-ink-muted">
            Agrupación departamental de referencias comerciales y control de jerarquías
          </p>
        </div>
        <Button variant="secondary" onClick={handleOpenCreate} icon={Plus}>
          Crear Categoría
        </Button>
      </div>

      {/* Barra de Filtros */}
      <div className="bg-surface-lowest border border-borderline rounded-lg p-4 flex flex-col sm:flex-row items-center gap-3 shadow-subtle">
        <div className="flex-1 w-full">
          <Input
            placeholder="Buscar por código, nombre o departamento..."
            icon={Search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-56">
          <Select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">Todos los Estados</option>
            <option value="active">Solo Activas</option>
            <option value="inactive">Solo Inactivas</option>
          </Select>
        </div>
      </div>

      {/* Tabla de Categorías */}
      <CategoryTable
        categories={categories}
        onEdit={handleOpenEdit}
        onToggleStatus={handleToggleStatus}
      />

      {/* Modal */}
      <CategoryFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveCategory}
        category={editingCategory}
      />
    </div>
  );
};
