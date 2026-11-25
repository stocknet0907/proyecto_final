import React, { useState } from 'react';
import { Modal } from '../../../shared/components/Modal';
import { Input } from '../../../shared/components/Input';
import { Select } from '../../../shared/components/Select';
import { Button } from '../../../shared/components/Button';
import { Plus, Trash2 } from 'lucide-react';
import { formatCurrency } from '../../../shared/utils/formatters';

export const PurchaseOrderModal = ({
  isOpen,
  onClose,
  onSave,
  suppliers = [],
  products = [],
}) => {
  const [supplierId, setSupplierId] = useState(suppliers[0]?.id || '');
  const [expectedDate, setExpectedDate] = useState(
    new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [items, setItems] = useState([
    {
      productId: products[0]?.id || '',
      orderedQty: 10,
      unitCost: products[0]?.costPrice || 50000,
    },
  ]);
  const [error, setError] = useState('');

  const handleAddItemRow = () => {
    const firstProd = products[0];
    setItems((prev) => [
      ...prev,
      {
        productId: firstProd?.id || '',
        orderedQty: 5,
        unitCost: firstProd?.costPrice || 20000,
      },
    ]);
  };

  const handleRemoveItemRow = (index) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    setItems((prev) =>
      prev.map((row, i) => {
        if (i === index) {
          if (field === 'productId') {
            const matchedProd = products.find((p) => p.id === value);
            return {
              ...row,
              productId: value,
              unitCost: matchedProd ? matchedProd.costPrice : row.unitCost,
            };
          }
          return { ...row, [field]: value };
        }
        return row;
      })
    );
  };

  const totalCalculated = items.reduce(
    (acc, row) => acc + (Number(row.unitCost) || 0) * (Number(row.orderedQty) || 0),
    0
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!supplierId) {
      setError('Debe seleccionar un proveedor para la orden.');
      return;
    }

    const validItems = items.map((i) => {
      const prod = products.find((p) => p.id === i.productId);
      return {
        productId: i.productId,
        productName: prod?.name || 'Artículo no especificado',
        sku: prod?.sku || 'SKU-000',
        orderedQty: Number(i.orderedQty) || 1,
        unitCost: Number(i.unitCost) || 0,
      };
    });

    const selectedSup = suppliers.find((s) => s.id === supplierId);

    onSave({
      supplierId,
      supplierName: selectedSup?.companyName || 'Proveedor',
      expectedDate,
      items: validItems,
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Registrar Orden de Compra (OC)"
      subtitle="Generación de pedido a proveedor y previsión de reabastecimiento"
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Proveedor Suministrador"
            value={supplierId}
            onChange={(e) => setSupplierId(e.target.value)}
            required
          >
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.companyName} (Plazo: {s.leadTimeDays} días)
              </option>
            ))}
          </Select>

          <Input
            label="Fecha Estimada de Entrega"
            type="date"
            value={expectedDate}
            onChange={(e) => setExpectedDate(e.target.value)}
            required
          />
        </div>

        {/* Tabla de Artículos Solicitados */}
        <div className="border border-borderline rounded-lg overflow-hidden bg-surface-lowest">
          <div className="p-3 bg-surface-container flex items-center justify-between border-b border-borderline">
            <span className="font-semibold text-xs text-ink-base">Artículos del Pedido</span>
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={handleAddItemRow}
              icon={Plus}
            >
              Agregar Fila
            </Button>
          </div>

          <div className="p-3 space-y-2 max-h-60 overflow-y-auto">
            {items.map((row, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs">
                <div className="flex-1">
                  <select
                    value={row.productId}
                    onChange={(e) => handleItemChange(idx, 'productId', e.target.value)}
                    className="w-full bg-surface-lowest border border-borderline rounded-sm py-1.5 px-2 text-xs"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.sku} - {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="w-24">
                  <input
                    type="number"
                    min="1"
                    placeholder="Cant"
                    value={row.orderedQty}
                    onChange={(e) => handleItemChange(idx, 'orderedQty', e.target.value)}
                    className="w-full bg-surface-lowest border border-borderline rounded-sm py-1.5 px-2 text-xs text-center font-mono"
                  />
                </div>

                <div className="w-32">
                  <input
                    type="number"
                    placeholder="Costo Unit"
                    value={row.unitCost}
                    onChange={(e) => handleItemChange(idx, 'unitCost', e.target.value)}
                    className="w-full bg-surface-lowest border border-borderline rounded-sm py-1.5 px-2 text-xs text-right font-mono"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveItemRow(idx)}
                  disabled={items.length <= 1}
                  className="p-1 text-ink-muted hover:text-status-error disabled:opacity-30"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-borderline bg-surface-container/40 flex items-center justify-between">
            <span className="text-xs font-semibold text-ink-muted">TOTAL ESTIMADO:</span>
            <span className="font-display font-bold text-base text-primary font-mono">
              {formatCurrency(totalCalculated)}
            </span>
          </div>
        </div>

        {error && (
          <div className="p-2.5 bg-status-error-bg border border-status-error-border rounded-sm text-xs text-status-error font-medium">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2 border-t border-borderline/60">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="secondary" size="sm">
            Crear Orden de Compra
          </Button>
        </div>
      </form>
    </Modal>
  );
};
