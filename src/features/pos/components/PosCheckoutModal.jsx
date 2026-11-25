import React, { useState } from 'react';
import { Modal } from '../../../shared/components/Modal';
import { Button } from '../../../shared/components/Button';
import { Input } from '../../../shared/components/Input';
import { Select } from '../../../shared/components/Select';
import { formatCurrency } from '../../../shared/utils/formatters';
import { Banknote, CreditCard, QrCode, CalendarClock, AlertCircle, CheckCircle2 } from 'lucide-react';

export const PosCheckoutModal = ({
  isOpen,
  onClose,
  total,
  selectedCustomer,
  customers = [],
  onSelectCustomer,
  onConfirmSale,
}) => {
  const [paymentMethod, setPaymentMethod] = useState('cash'); // 'cash', 'card', 'transfer', 'credit'
  const [cashTendered, setCashTendered] = useState('');
  const [creditTermDays, setCreditTermDays] = useState('30');
  const [error, setError] = useState('');

  const cashNum = Number(cashTendered) || 0;
  const change = Math.max(0, cashNum - total);

  // Verificación de cupo si es crédito
  const availableCredit = selectedCustomer
    ? Math.max(0, (selectedCustomer.creditLimit || 0) - (selectedCustomer.currentDebt || 0))
    : 0;

  const isCreditAllowed =
    selectedCustomer &&
    selectedCustomer.status === 'active' &&
    total <= availableCredit;

  const handleQuickCash = (amount) => {
    setCashTendered(String(amount));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (paymentMethod === 'cash') {
      if (!cashNum || cashNum < total) {
        setError(`El importe entregado debe ser igual o superior al total (${formatCurrency(total)}).`);
        return;
      }
    }

    if (paymentMethod === 'credit') {
      if (!selectedCustomer) {
        setError('Debe seleccionar un cliente registrado para habilitar venta a crédito.');
        return;
      }
      if (!isCreditAllowed) {
        setError('El cliente no dispone de cupo crediticio suficiente o está suspendido.');
        return;
      }
    }

    const res = onConfirmSale({
      paymentMethod,
      cashTendered: paymentMethod === 'cash' ? cashNum : total,
      creditTermDays: Number(creditTermDays) || 30,
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
      title="Flujo de Cobro y Facturación"
      subtitle={`Total a Liquidar: ${formatCurrency(total)}`}
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Selector de Medios de Pago (RF11) */}
        <div>
          <label className="text-xs font-semibold text-ink-muted uppercase tracking-wider block mb-2">
            Seleccione el Medio de Pago:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => setPaymentMethod('cash')}
              className={`p-3 rounded-lg border text-center flex flex-col items-center gap-1.5 transition-all ${
                paymentMethod === 'cash'
                  ? 'border-secondary bg-secondary-light/40 ring-2 ring-secondary/50 font-bold text-ink-base'
                  : 'border-borderline bg-surface-lowest text-ink-muted hover:bg-surface-container'
              }`}
            >
              <Banknote className="w-5 h-5 text-primary" />
              <span className="text-xs">Efectivo</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('card')}
              className={`p-3 rounded-lg border text-center flex flex-col items-center gap-1.5 transition-all ${
                paymentMethod === 'card'
                  ? 'border-secondary bg-secondary-light/40 ring-2 ring-secondary/50 font-bold text-ink-base'
                  : 'border-borderline bg-surface-lowest text-ink-muted hover:bg-surface-container'
              }`}
            >
              <CreditCard className="w-5 h-5 text-primary" />
              <span className="text-xs">Tarjeta</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('transfer')}
              className={`p-3 rounded-lg border text-center flex flex-col items-center gap-1.5 transition-all ${
                paymentMethod === 'transfer'
                  ? 'border-secondary bg-secondary-light/40 ring-2 ring-secondary/50 font-bold text-ink-base'
                  : 'border-borderline bg-surface-lowest text-ink-muted hover:bg-surface-container'
              }`}
            >
              <QrCode className="w-5 h-5 text-primary" />
              <span className="text-xs">Transferencia</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('credit')}
              className={`p-3 rounded-lg border text-center flex flex-col items-center gap-1.5 transition-all ${
                paymentMethod === 'credit'
                  ? 'border-secondary bg-secondary-light/40 ring-2 ring-secondary/50 font-bold text-ink-base'
                  : 'border-borderline bg-surface-lowest text-ink-muted hover:bg-surface-container'
              }`}
            >
              <CalendarClock className="w-5 h-5 text-primary" />
              <span className="text-xs">A Crédito</span>
            </button>
          </div>
        </div>

        {/* Modalidad Efectivo: Cálculo de Cambio / Devuelta */}
        {paymentMethod === 'cash' && (
          <div className="p-4 bg-surface-container rounded-lg border border-borderline space-y-3">
            <Input
              label="Efectivo Entregado por Cliente ($ COP)"
              type="number"
              placeholder={String(total)}
              value={cashTendered}
              onChange={(e) => setCashTendered(e.target.value)}
              autoFocus
              required
            />

            {/* Atajos de denominación */}
            <div className="flex gap-1.5 overflow-x-auto">
              {[total, Math.ceil(total / 10000) * 10000, 50000, 100000, 200000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleQuickCash(val)}
                  className="px-2.5 py-1 text-xs bg-surface-lowest border border-borderline rounded-sm hover:bg-primary-light font-mono"
                >
                  {formatCurrency(val)}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between p-2.5 bg-surface-lowest border border-borderline rounded-sm">
              <span className="text-xs font-semibold text-ink-muted">Cambio / Devuelta:</span>
              <span className="font-display font-black text-lg text-status-success font-mono">
                {formatCurrency(change)}
              </span>
            </div>
          </div>
        )}

        {/* Modalidad Crédito: Selección de Cliente y Cupo (RF26) */}
        {paymentMethod === 'credit' && (
          <div className="p-4 bg-surface-container rounded-lg border border-borderline space-y-3">
            <Select
              label="Seleccionar Cliente con Cupo Activo"
              value={selectedCustomer?.id || ''}
              onChange={(e) => {
                const found = customers.find((c) => c.id === e.target.value);
                onSelectCustomer(found || null);
              }}
              required
            >
              <option value="">-- Seleccione un cliente --</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} (Disp: {formatCurrency(c.creditLimit - c.currentDebt)})
                </option>
              ))}
            </Select>

            {selectedCustomer && (
              <div className="p-3 bg-surface-lowest border border-borderline rounded-sm space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-ink-muted">Cupo Total:</span>
                  <span className="font-mono font-medium">{formatCurrency(selectedCustomer.creditLimit)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-muted">Deuda Previa:</span>
                  <span className="font-mono text-status-warning">{formatCurrency(selectedCustomer.currentDebt)}</span>
                </div>
                <div className="flex justify-between font-bold border-t border-borderline/60 pt-1">
                  <span>Disponible:</span>
                  <span className={isCreditAllowed ? 'text-status-success' : 'text-status-error'}>
                    {formatCurrency(availableCredit)}
                  </span>
                </div>
              </div>
            )}

            <Select
              label="Plazo de Pago Acordado"
              value={creditTermDays}
              onChange={(e) => setCreditTermDays(e.target.value)}
            >
              <option value="15">15 Días Calendario</option>
              <option value="30">30 Días Calendario (Estándar)</option>
              <option value="45">45 Días Calendario</option>
              <option value="60">60 Días Calendario</option>
            </Select>
          </div>
        )}

        {/* Error banner */}
        {error && (
          <div className="p-3 bg-status-error-bg border border-status-error-border rounded-sm text-xs text-status-error font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2 border-t border-borderline/60">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="secondary" size="md" className="font-bold">
            Confirmar y Emitir Factura
          </Button>
        </div>
      </form>
    </Modal>
  );
};
