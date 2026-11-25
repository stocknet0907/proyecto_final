import React, { useState, useEffect } from 'react';
import { Modal } from '../../../shared/components/Modal';
import { Input } from '../../../shared/components/Input';
import { Select } from '../../../shared/components/Select';
import { Button } from '../../../shared/components/Button';
import { formatPercent, formatCurrency } from '../../../shared/utils/formatters';

export const ProductFormModal = ({
  isOpen,
  onClose,
  onSave,
  product = null,
  categories = [],
  suppliers = [],
}) => {
  const isEditing = !!product;

  const [formData, setFormData] = useState({
    sku: '',
    barcode: '',
    name: '',
    categoryId: '',
    supplierId: '',
    costPrice: '',
    salePrice: '',
    currentStock: '0',
    minStock: '5',
    location: '',
    unit: 'Unidad',
    active: true,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (product) {
      setFormData({
        sku: product.sku || '',
        barcode: product.barcode || '',
        name: product.name || '',
        categoryId: product.categoryId || (categories[0]?.id || ''),
        supplierId: product.supplierId || (suppliers[0]?.id || ''),
        costPrice: product.costPrice || '',
        salePrice: product.salePrice || '',
        currentStock: product.currentStock || '0',
        minStock: product.minStock || '5',
        location: product.location || '',
        unit: product.unit || 'Unidad',
        active: product.active !== undefined ? product.active : true,
      });
    } else {
      setFormData({
        sku: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
        barcode: `770${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        name: '',
        categoryId: categories[0]?.id || '',
        supplierId: suppliers[0]?.id || '',
        costPrice: '',
        salePrice: '',
        currentStock: '10',
        minStock: '5',
        location: 'Bodega Central - Estante A-1',
        unit: 'Unidad',
        active: true,
      });
    }
    setErrors({});
  }, [product, isOpen, categories, suppliers]);

  // Cálculo en caliente de margen de ganancia comercial (RF10, RF16)
  const cost = Number(formData.costPrice) || 0;
  const sale = Number(formData.salePrice) || 0;
  const marginGross = sale - cost;
  const marginPercent = sale > 0 ? ((marginGross / sale) * 100) : 0;

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'El nombre del producto es obligatorio';
    if (!formData.sku.trim()) newErrors.sku = 'El SKU es obligatorio';
    if (!formData.costPrice || Number(formData.costPrice) <= 0) {
      newErrors.costPrice = 'El costo debe ser mayor a 0';
    }
    if (!formData.salePrice || Number(formData.salePrice) <= 0) {
      newErrors.salePrice = 'El precio de venta debe ser mayor a 0';
    } else if (Number(formData.salePrice) < Number(formData.costPrice)) {
      newErrors.salePrice = 'El precio de venta no puede ser inferior al costo de compra';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const selectedCat = categories.find((c) => c.id === formData.categoryId);
    const selectedSup = suppliers.find((s) => s.id === formData.supplierId);

    onSave({
      ...formData,
      categoryName: selectedCat?.name || 'General',
      supplierName: selectedSup?.companyName || 'Proveedor General',
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Editar Ficha de Producto' : 'Registrar Nuevo Producto'}
      subtitle="Parámetros comerciales, existencias iniciales y margen de rentabilidad"
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Código SKU"
            value={formData.sku}
            onChange={(e) => handleChange('sku', e.target.value)}
            error={errors.sku}
            required
          />
          <Input
            label="Código de Barras (EAN-13)"
            value={formData.barcode}
            onChange={(e) => handleChange('barcode', e.target.value)}
          />
        </div>

        <Input
          label="Denominación / Nombre del Producto"
          placeholder="Ej: Aceite Sintético 5W-30 Mobil 1 Galón"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          error={errors.name}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Categoría"
            value={formData.categoryId}
            onChange={(e) => handleChange('categoryId', e.target.value)}
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>

          <Select
            label="Proveedor Primario"
            value={formData.supplierId}
            onChange={(e) => handleChange('supplierId', e.target.value)}
          >
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.companyName}
              </option>
            ))}
          </Select>
        </div>

        {/* Sección de Costos y Rentabilidad (RF16) */}
        <div className="p-4 bg-surface-container rounded-lg border border-borderline space-y-3">
          <h4 className="font-display font-semibold text-xs uppercase tracking-wider text-ink-muted">
            Estructura de Precios y Margen Comercial
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Costo de Compra ($ COP)"
              type="number"
              placeholder="0"
              value={formData.costPrice}
              onChange={(e) => handleChange('costPrice', e.target.value)}
              error={errors.costPrice}
              required
            />
            <Input
              label="Precio de Venta ($ COP)"
              type="number"
              placeholder="0"
              value={formData.salePrice}
              onChange={(e) => handleChange('salePrice', e.target.value)}
              error={errors.salePrice}
              required
            />
            <div className="flex flex-col justify-end pb-1">
              <span className="text-xs font-semibold text-ink-muted">Margen Bruto Calculado:</span>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`text-base font-bold font-mono ${
                    marginPercent >= 35 ? 'text-status-success' : 'text-secondary-dark'
                  }`}
                >
                  {formatPercent(marginPercent)}
                </span>
                <span className="text-xs text-ink-muted font-mono">
                  ({formatCurrency(marginGross)})
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Stock Actual"
            type="number"
            value={formData.currentStock}
            onChange={(e) => handleChange('currentStock', e.target.value)}
            disabled={isEditing}
            helperText={isEditing ? 'Utilice el modal de ajuste físico' : ''}
          />
          <Input
            label="Stock Mínimo (Alerta)"
            type="number"
            value={formData.minStock}
            onChange={(e) => handleChange('minStock', e.target.value)}
          />
          <Input
            label="Ubicación en Bodega"
            placeholder="Pasillo A - Estante 2"
            value={formData.location}
            onChange={(e) => handleChange('location', e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3 pt-3 border-t border-borderline/60">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="secondary" size="sm">
            {isEditing ? 'Guardar Cambios' : 'Registrar Producto'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
