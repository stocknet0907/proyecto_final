import React, { useState, useMemo } from 'react';
import { Search, Barcode, Plus, Package } from 'lucide-react';
import { Input } from '../../../shared/components/Input';
import { Badge } from '../../../shared/components/Badge';
import { formatCurrency } from '../../../shared/utils/formatters';

export const PosProductGrid = ({ products = [], categories = [], onAddToCart }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        !searchTerm.trim() ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.barcode.includes(searchTerm);

      const matchesCat =
        selectedCategory === 'all' || p.categoryId === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [products, searchTerm, selectedCategory]);

  return (
    <div className="flex flex-col h-full space-y-3">
      {/* Barra de Búsqueda y Código de Barras */}
      <div className="bg-surface-lowest border border-borderline rounded-lg p-3 shadow-subtle flex gap-2">
        <Input
          placeholder="Escanear código de barras o escribir SKU/Nombre..."
          icon={Search}
          rightIcon={Barcode}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
          autoFocus
        />
      </div>

      {/* Chips de Categorías */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 rounded-sm text-xs font-semibold whitespace-nowrap transition-colors ${
            selectedCategory === 'all'
              ? 'bg-primary text-white shadow-xs'
              : 'bg-surface-lowest border border-borderline text-ink-muted hover:bg-surface-container'
          }`}
        >
          Todas
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-sm text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === cat.id
                ? 'bg-primary text-white shadow-xs'
                : 'bg-surface-lowest border border-borderline text-ink-muted hover:bg-surface-container'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Grid de Productos */}
      <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 pr-1">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full py-12 text-center text-ink-muted text-xs">
            No se encontraron productos disponibles para venta con los criterios indicados.
          </div>
        ) : (
          filteredProducts.map((p) => {
            const isOutOfStock = p.currentStock === 0;
            return (
              <div
                key={p.id}
                onClick={() => !isOutOfStock && onAddToCart(p)}
                className={`bg-surface-lowest border rounded-lg p-3 flex flex-col justify-between transition-all select-none ${
                  isOutOfStock
                    ? 'border-borderline/60 opacity-60 cursor-not-allowed bg-surface-container/30'
                    : 'border-borderline hover:border-primary hover:shadow-subtle cursor-pointer active:scale-[0.98]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span className="text-[10px] font-mono font-semibold text-primary truncate">
                      {p.sku}
                    </span>
                    <Badge
                      variant={isOutOfStock ? 'error' : p.currentStock <= p.minStock ? 'warning' : 'success'}
                      size="xs"
                    >
                      {isOutOfStock ? '0' : p.currentStock} {p.unit}
                    </Badge>
                  </div>
                  <h4 className="text-xs font-semibold text-ink-base line-clamp-2 leading-tight">
                    {p.name}
                  </h4>
                </div>

                <div className="mt-3 pt-2 border-t border-borderline/60 flex items-center justify-between">
                  <span className="font-display font-bold text-sm text-ink-base font-mono">
                    {formatCurrency(p.salePrice)}
                  </span>
                  <div className="w-6 h-6 rounded-sm bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                    <Plus className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
