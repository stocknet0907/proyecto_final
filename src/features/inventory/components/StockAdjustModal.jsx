import React, { useState } from 'react';
import { Modal } from '../../../shared/components/Modal';
import { Input } from '../../../shared/components/Input';
import { Select } from '../../../shared/components/Select';
import { Button } from '../../../shared/components/Button';
import { Sliders, ArrowUpCircle, ArrowDownCircle, AlertTriangle } from 'lucide-react';

export const StockAdjustModal = ({ isOpen, onClose, product, onAdjust }) => {
  const [type, setType] = useState('in'); // 'in', 'out', 'adjustment', 'loss'
  const [quantity, setQuantity] = useState('1');
  const [reason, setReason] = useState('Conteo físico de rutina');
  const [error, setError] = useState('');

  if (!product) return null;

  const current = product.currentStock || 0;
  const qtyNum = Number(quantity) || 0;
  let simulatedStock = current;

  if (type === 'in') simulatedStock = current + qtyNum;
  else if (type === 'out' || type === 'loss') simulatedStock = Math.max(0, current - qtyNum);
  else if (type === 'adjustment') simulatedStock = qtyNum;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (qtyNum <= 0 && type !== 'adjustment') {
      setError('La cantidad debe ser mayor a cero.');
      return;
    }
    if ((type === 'out' || type === 'loss') && qtyNum > current) {
      setError(`No puede retirar más unidades que las existentes (${current}).`);
      return;
    }

    const res = onAdjust({
      productId: product.id,
      type,
      quantity: qtyNum,
      reason,
    });

    if (res && !res.success) {
      setError(res.error);
      return;
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Ajuste Físico de Inventario & Auditoría"
      subtitle={`Referencia: ${product.name} (SKU: ${product.sku})`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-3 bg-surface-container rounded-sm flex items-center justify-between text-xs">
          <span className="text-ink-muted">Stock actual registrado:</span>
          <span className="font-mono font-bold text-ink-base text-sm">
            {current} {product.unit}s
          </span>
        </div>

        <Select
          label="Tipo de Movimiento"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="in">Entrada Manual (Ingreso no documentado)</option>
          <option value="out">Salida Manual (Consumo interno / Muestra)</option>
          <option value="loss">Merma o Deterioro (Producto dañado)</option>
          <option value="adjustment">Conteo Físico Absoluto (Sobrescribir)</option>
        </Select>

        <Input
          label={
            type === 'adjustment'
              ? 'Nueva Cantidad Física Contada'
              : 'Cantidad de Unidades a Mover'
          }
          type="number"
          min="0"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
        />

        <Input
          label="Motivo o Justificación del Ajuste (Bitácora)"
          placeholder="Ej: Calibración por auditoría trimestral"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
        />

        {/* Visualización del impacto */}
        <div className="p-3 rounded-lg border border-primary/30 bg-primary-light/40 flex items-center justify-between">
          <span className="text-xs font-semibold text-primary">Resultado proyectado:</span>
          <span className="font-mono font-bold text-sm text-primary">
            {simulatedStock} {product.unit}s
          </span>
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
            Confirmar Ajuste
          </Button>
        </div>
      </form>
    </Modal>
  );
};
