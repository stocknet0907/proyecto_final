import React, { useState } from 'react';
import { Modal } from '../../../shared/components/Modal';
import { Input } from '../../../shared/components/Input';
import { Select } from '../../../shared/components/Select';
import { Button } from '../../../shared/components/Button';
import { formatCurrency } from '../../../shared/utils/formatters';

export const CreditPaymentModal = ({ isOpen, onClose, credit, onConfirmPayment }) => {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [notes, setNotes] = useState('Abono directo a capital');
  const [error, setError] = useState('');

  if (!credit) return null;

  const payNum = Number(amount) || 0;
  const balanceAfter = Math.max(0, credit.currentBalance - payNum);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (payNum <= 0) {
      setError('El valor del abono debe ser mayor a cero.');
      return;
    }

    if (payNum > credit.currentBalance) {
      setError(`El abono no puede superar el saldo pendiente (${formatCurrency(credit.currentBalance)}).`);
      return;
    }

    const res = onConfirmPayment({
      creditId: credit.id,
      amount: payNum,
      paymentMethod,
      notes,
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
      title="Registrar Abono a Crédito"
      subtitle={`Crédito: ${credit.id} &bull; Cliente: ${credit.customerName}`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-3 bg-surface-container rounded-sm flex items-center justify-between text-xs">
          <span className="text-ink-muted">Saldo Pendiente Actual:</span>
          <span className="font-mono font-bold text-sm text-status-warning">
            {formatCurrency(credit.currentBalance)}
          </span>
        </div>

        <Input
          label="Monto del Abono ($ COP)"
          type="number"
          placeholder="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          autoFocus
          required
        />

        {/* Botones de sugerencia */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setAmount(String(credit.currentBalance))}
            className="text-[11px] px-2 py-1 bg-surface-lowest border border-borderline rounded text-primary font-semibold hover:bg-primary-light"
          >
            Pagar Saldo Total ({formatCurrency(credit.currentBalance)})
          </button>
          {credit.currentBalance > 100000 && (
            <button
              type="button"
              onClick={() => setAmount(String(Math.round(credit.currentBalance / 2)))}
              className="text-[11px] px-2 py-1 bg-surface-lowest border border-borderline rounded text-ink-base hover:bg-surface-container"
            >
              50% ({formatCurrency(Math.round(credit.currentBalance / 2))})
            </button>
          )}
        </div>

        <Select
          label="Medio de Pago"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option value="cash">Efectivo en Caja</option>
          <option value="transfer">Transferencia Bancaria</option>
          <option value="card">Tarjeta Débito/Crédito</option>
        </Select>

        <Input
          label="Observaciones / Recibo Manual"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        {/* Saldo proyectado */}
        <div className="p-3 bg-primary-light/40 border border-primary/30 rounded-lg flex items-center justify-between text-xs">
          <span className="text-primary font-semibold">Saldo Remanente Proyectado:</span>
          <span className="font-mono font-bold text-sm text-primary">
            {formatCurrency(balanceAfter)}
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
            Confirmar Abono
          </Button>
        </div>
      </form>
    </Modal>
  );
};
