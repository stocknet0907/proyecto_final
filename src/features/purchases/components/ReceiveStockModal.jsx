import React, { useState, useEffect } from 'react';
import { Modal } from '../../../shared/components/Modal';
import { Input } from '../../../shared/components/Input';
import { Button } from '../../../shared/components/Button';
import { PackageCheck, CheckCircle2 } from 'lucide-react';

export const ReceiveStockModal = ({ isOpen, onClose, order, onConfirmReceive }) => {
  const [receivedItems, setReceivedItems] = useState([]);
  const [lotNumber, setLotNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [notes, setNotes] = useState('Recepción e inspección física conforme');
  const [error, setError] = useState('');

  useEffect(() => {
    if (order && order.items) {
      setReceivedItems(
        order.items.map((i) => ({
          productId: i.productId,
          productName: i.productName,
          sku: i.sku,
          orderedQty: i.orderedQty,
          alreadyReceived: i.receivedQty || 0,
          receivedQty: Math.max(0, i.orderedQty - (i.receivedQty || 0)),
        }))
      );
      setLotNumber(`LOT-${Date.now().toString().slice(-6)}`);
      setExpiryDate('');
      setNotes('Recepción e inspección física conforme');
      setError('');
    }
  }, [order, isOpen]);

  if (!order) return null;

  const handleQtyChange = (productId, qty) => {
    setReceivedItems((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, receivedQty: Number(qty) || 0 } : i))
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const totalToReceive = receivedItems.reduce((acc, i) => acc + (i.receivedQty || 0), 0);
    if (totalToReceive <= 0) {
      setError('Debe registrar al menos 1 unidad recibida.');
      return;
    }

    onConfirmReceive({
      orderId: order.id,
      receivedItems,
      lotNumber,
      expiryDate,
      notes,
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Control de Recepción & Entrada de Mercancía"
      subtitle={`Orden de Compra: ${order.id} &bull; ${order.supplierName}`}
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Lote y Vencimiento (RF23) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-surface-container rounded-lg border border-borderline">
          <Input
            label="Número de Lote / Serie"
            placeholder="Ej: LOT-2026-X9"
            value={lotNumber}
            onChange={(e) => setLotNumber(e.target.value)}
            required
          />
          <Input
            label="Fecha de Vencimiento (Opcional)"
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
          />
        </div>

        {/* Tabla de Artículos e Inspección */}
        <div className="border border-borderline rounded-lg overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-primary text-white font-medium">
                <th className="py-2 px-3 text-left">SKU / Producto</th>
                <th className="py-2 px-2 text-center">Pedido</th>
                <th className="py-2 px-2 text-center">Previo</th>
                <th className="py-2 px-3 text-center w-28">Recibido Hoy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borderline">
              {receivedItems.map((item) => (
                <tr key={item.productId} className="hover:bg-surface-container/40">
                  <td className="py-2 px-3">
                    <span className="font-semibold text-ink-base block">{item.productName}</span>
                    <span className="font-mono text-[10px] text-ink-muted">{item.sku}</span>
                  </td>
                  <td className="py-2 px-2 text-center font-mono">{item.orderedQty}</td>
                  <td className="py-2 px-2 text-center font-mono text-ink-muted">
                    {item.alreadyReceived}
                  </td>
                  <td className="py-2 px-3 text-center">
                    <input
                      type="number"
                      min="0"
                      max={item.orderedQty - item.alreadyReceived}
                      value={item.receivedQty}
                      onChange={(e) => handleQtyChange(item.productId, e.target.value)}
                      className="w-full bg-surface-lowest border border-borderline rounded-sm py-1 px-2 text-center font-mono font-bold text-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Input
          label="Observaciones Técnicas / Control de Calidad"
          placeholder="Estado de embalaje, sellos de seguridad, transportadora"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        {error && (
          <div className="p-2.5 bg-status-error-bg border border-status-error-border rounded-sm text-xs text-status-error font-medium">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2 border-t border-borderline/60">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="secondary" size="sm" icon={PackageCheck}>
            Confirmar Recepción y Cargar a Stock
          </Button>
        </div>
      </form>
    </Modal>
  );
};
