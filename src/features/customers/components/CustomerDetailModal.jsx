import React from 'react';
import { Modal } from '../../../shared/components/Modal';
import { Badge } from '../../../shared/components/Badge';
import { Button } from '../../../shared/components/Button';
import { formatCurrency } from '../../../shared/utils/formatters';
import { User, Phone, MapPin, CreditCard, AlertCircle } from 'lucide-react';

export const CustomerDetailModal = ({ isOpen, onClose, customer }) => {
  if (!customer) return null;

  const availableCredit = Math.max(0, (customer.creditLimit || 0) - (customer.currentDebt || 0));
  const creditUsagePercent =
    customer.creditLimit > 0
      ? Math.min(100, Math.round(((customer.currentDebt || 0) / customer.creditLimit) * 100))
      : 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Estado de Cuenta y Ficha de Cliente"
      subtitle={customer.name}
      maxWidth="max-w-lg"
    >
      <div className="space-y-4">
        {/* Cabecera */}
        <div className="flex items-center justify-between p-3.5 bg-surface-container rounded-lg border border-borderline">
          <div>
            <span className="text-xs text-ink-muted block font-mono">Cédula / NIT</span>
            <span className="font-mono font-bold text-sm text-primary">{customer.documentId}</span>
          </div>
          <Badge
            variant={
              customer.status === 'active'
                ? 'success'
                : customer.status === 'overdue_blocked'
                ? 'error'
                : 'neutral'
            }
          >
            {customer.status === 'active'
              ? 'Cliente Activo'
              : customer.status === 'overdue_blocked'
              ? 'Bloqueado por Mora'
              : 'Inactivo'}
          </Badge>
        </div>

        {/* Panel de Cartera y Cupo */}
        <div className="p-4 bg-surface-lowest border border-borderline rounded-lg space-y-3">
          <div className="flex items-center justify-between border-b border-borderline/60 pb-2">
            <span className="text-xs font-semibold text-ink-muted flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-primary" /> Línea de Crédito Comercial
            </span>
            <span className="text-xs font-mono font-bold text-ink-base">
              {creditUsagePercent}% Utilizado
            </span>
          </div>

          <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                creditUsagePercent >= 90
                  ? 'bg-status-error'
                  : creditUsagePercent >= 70
                  ? 'bg-status-warning'
                  : 'bg-status-success'
              }`}
              style={{ width: `${creditUsagePercent}%` }}
            />
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1 text-center">
            <div className="p-2 bg-surface-container/50 rounded-sm">
              <span className="text-[10px] text-ink-muted block">Cupo Total</span>
              <span className="font-mono font-bold text-xs text-ink-base">
                {formatCurrency(customer.creditLimit)}
              </span>
            </div>
            <div className="p-2 bg-surface-container/50 rounded-sm">
              <span className="text-[10px] text-ink-muted block">Deuda Actual</span>
              <span className="font-mono font-bold text-xs text-status-warning">
                {formatCurrency(customer.currentDebt)}
              </span>
            </div>
            <div className="p-2 bg-surface-container/50 rounded-sm">
              <span className="text-[10px] text-ink-muted block">Disponible</span>
              <span className="font-mono font-bold text-xs text-status-success">
                {formatCurrency(availableCredit)}
              </span>
            </div>
          </div>
        </div>

        {/* Contacto */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-surface-lowest border border-borderline rounded-sm space-y-1">
            <span className="text-ink-muted flex items-center gap-1.5 font-semibold">
              <Phone className="w-3.5 h-3.5 text-primary" /> Teléfono
            </span>
            <p className="font-medium text-ink-base">{customer.phone || 'No registrado'}</p>
          </div>

          <div className="p-3 bg-surface-lowest border border-borderline rounded-sm space-y-1">
            <span className="text-ink-muted flex items-center gap-1.5 font-semibold">
              <MapPin className="w-3.5 h-3.5 text-primary" /> Dirección
            </span>
            <p className="font-medium text-ink-base">{customer.address || 'No registrada'}</p>
          </div>
        </div>

        {customer.notes && (
          <div className="p-3 bg-surface-low border border-borderline rounded-sm text-xs">
            <span className="font-semibold text-ink-base block mb-0.5">Notas Comerciales:</span>
            <p className="text-ink-muted leading-relaxed">{customer.notes}</p>
          </div>
        )}

        <div className="flex justify-end pt-2 border-t border-borderline/60">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cerrar Ficha
          </Button>
        </div>
      </div>
    </Modal>
  );
};
