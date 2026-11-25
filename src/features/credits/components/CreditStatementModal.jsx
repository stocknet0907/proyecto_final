import React from 'react';
import { Modal } from '../../../shared/components/Modal';
import { Button } from '../../../shared/components/Button';
import { formatCurrency, formatDate } from '../../../shared/utils/formatters';
import { Printer } from 'lucide-react';

export const CreditStatementModal = ({ isOpen, onClose, credit }) => {
  if (!credit) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Estado de Cuenta & Trazabilidad de Pagos"
      subtitle={`Crédito: ${credit.id} &bull; ${credit.customerName}`}
      maxWidth="max-w-xl"
    >
      <div className="space-y-4">
        {/* Resumen */}
        <div className="grid grid-cols-3 gap-2 p-3 bg-surface-container rounded-lg border border-borderline text-center text-xs">
          <div>
            <span className="text-[10px] text-ink-muted block">Importe Inicial</span>
            <span className="font-mono font-bold text-ink-base">
              {formatCurrency(credit.originalAmount)}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-ink-muted block">Saldo Pendiente</span>
            <span className="font-mono font-bold text-status-warning">
              {formatCurrency(credit.currentBalance)}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-ink-muted block">Fecha Límite</span>
            <span className="font-mono font-bold text-primary">
              {formatDate(credit.dueDate)}
            </span>
          </div>
        </div>

        {/* Historial de Abonos */}
        <div>
          <h4 className="font-display font-semibold text-xs uppercase tracking-wider text-ink-muted mb-2">
            Registro Histórico de Abonos Realizados (Amortización)
          </h4>
          <div className="border border-borderline rounded-lg overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-primary text-white font-medium">
                  <th className="py-2 px-3 text-left">Recibo / Fecha</th>
                  <th className="py-2 px-3 text-left">Medio</th>
                  <th className="py-2 px-3 text-left">Cajero</th>
                  <th className="py-2 px-3 text-right">Valor Abonado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-borderline">
                {!credit.payments || credit.payments.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-ink-muted">
                      No se registran abonos previos a este crédito.
                    </td>
                  </tr>
                ) : (
                  credit.payments.map((p) => (
                    <tr key={p.id} className="hover:bg-surface-container/40">
                      <td className="py-2 px-3">
                        <span className="font-semibold text-ink-base block">{p.receiptNumber}</span>
                        <span className="text-[10px] text-ink-muted">{formatDate(p.date, true)}</span>
                      </td>
                      <td className="py-2 px-3 uppercase font-mono text-[11px]">{p.paymentMethod}</td>
                      <td className="py-2 px-3 text-ink-muted">{p.cashierName}</td>
                      <td className="py-2 px-3 text-right font-mono font-bold text-status-success">
                        {formatCurrency(p.amount)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-between pt-2 border-t border-borderline/60">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cerrar Estado
          </Button>
          <Button variant="primary" size="sm" onClick={() => window.print()} icon={Printer}>
            Imprimir Extracto
          </Button>
        </div>
      </div>
    </Modal>
  );
};
