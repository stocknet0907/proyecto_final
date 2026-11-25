import React from 'react';
import { Search, Filter, Layers, AlertTriangle } from 'lucide-react';
import { Input } from '../../../shared/components/Input';
import { Select } from '../../../shared/components/Select';

export const ProductFilters = ({
  searchTerm,
  onSearchChange,
  categories = [],
  selectedCategory,
  onCategoryChange,
  selectedStockStatus,
  onStockStatusChange,
  selectedActiveStatus,
  onActiveStatusChange,
}) => {
  return (
    <div className="bg-surface-lowest border border-borderline rounded-lg p-4 space-y-3 shadow-subtle">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Buscador Universal */}
        <Input
          placeholder="Buscar por SKU, Nombre o Código..."
          icon={Search}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />

        {/* Filtro por Categoría */}
        <Select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          <option value="all">Todas las Categorías</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </Select>

        {/* Filtro por Nivel de Existencia */}
        <Select
          value={selectedStockStatus}
          onChange={(e) => onStockStatusChange(e.target.value)}
        >
          <option value="all">Todos los Niveles de Stock</option>
          <option value="in_stock">Óptimo (En Existencia)</option>
          <option value="low_stock">Stock Bajo (Bajo Umbral)</option>
          <option value="out_of_stock">Agotado (0 Unidades)</option>
        </Select>

        {/* Filtro por Estado Activo/Inactivo */}
        <Select
          value={selectedActiveStatus}
          onChange={(e) => onActiveStatusChange(e.target.value)}
        >
          <option value="all">Estado: Todos</option>
          <option value="active">Solo Activos</option>
          <option value="inactive">Solo Inactivos</option>
        </Select>
      </div>
    </div>
  );
};
