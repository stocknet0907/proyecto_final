import React from 'react';
import { Modal } from '../../../shared/components/Modal';
import { Button } from '../../../shared/components/Button';
import { Badge } from '../../../shared/components/Badge';
import { formatCurrency, formatDate, formatPercent } from '../../../shared/utils/formatters';
import { Printer, FileText } from 'lucide-react';

export const SaleDetailModal = ({ isOpen, onClose, sale }) => {
  if (!sale) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Detalle de Comprobante: ${sale.id}`}
      subtitle={`Fecha: ${formatDate(sale.date, true)} &bull; Cajero: ${sale.cashierName}`}
      maxWidth="max-w-xl"
    >
      <div className="space-y-4">
        {/* Cabecera de Comprobante */}
        <div className="p-3.5 bg-surface-container rounded-lg border border-borderline flex items-center justify-between">
          <div>
            <p className="text-xs text-ink-muted">Cliente Destinatario:</p>
            <h4 className="font-bold text-sm text-ink-base">{sale.customerName}</h4>
            <p className="text-xs font-mono text-ink-muted">NIT/CC: {sale.customerDocument}</p>
          </div>
          <div className="text-right">
            <span className="text-xs text-ink-muted block">Medio de Pago:</span>
            <span className="font-bold text-xs uppercase text-primary font-mono">
              {sale.paymentMethod}
            </span>
          </div>
        </div>

        {/* Tabla de Artículos Vendidos con Margen Individual (RF16) */}
        <div className="border border-borderline rounded-lg overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-primary text-white font-medium">
                <th className="py-2 px-3 text-left">SKU / Descripción</th>
                <th className="py-2 px-2 text-center">Cant</th>
                <th className="py-2 px-3 text-right">Costo Unit</th>
                <th className="py-2 px-3 text-right">Precio Unit</th>
                <th className="py-2 px-3 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borderline">
              {sale.items.map((item, idx) => (
                <tr key={idx} className="hover:bg-surface-container/50">
                  <td className="py-2 px-3">
                    <span className="font-semibold text-ink-base block">{item.productName}</span>
                    <span className="font-mono text-[10px] text-ink-muted">{item.sku}</span>
                  </td>
                  <td className="py-2 px-2 text-center font-mono font-bold">{item.quantity}</td>
                  <td className="py-2 px-3 text-right font-mono text-ink-muted">
                    {formatCurrency(item.costPrice)}
                  </td>
                  <td className="py-2 px-3 text-right font-mono font-semibold">
                    {formatCurrency(item.unitPrice)}
                  </td>
                  <td className="py-2 px-3 text-right font-mono font-bold text-ink-base">
                    {formatCurrency(item.subtotal)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Desglose Económico y Rentabilidad */}
        <div className="grid grid-cols-2 gap-3 p-3.5 bg-surface-container rounded-lg border border-borderline text-xs">
          <div className="space-y-1">
            <div className="flex justify-between text-ink-muted">
              <span>Costo Total Mercancía (COGS):</span>
              <span className="font-mono">{formatCurrency(sale.totalCost)}</span>
            </div>
            <div className="flex justify-between text-status-success font-semibold">
              <span>Utilidad Neta de la Venta:</span>
              <span className="font-mono">{formatCurrency(sale.netMargin)}</span>
            </div>
            <div className="flex justify-between text-ink-muted">
              <span>Margen Porcentual Bruto:</span>
              <span className="font-mono font-bold">{formatPercent(sale.marginPercent)}</span>
            </div>
          </div>

          <div className="space-y-1 border-l border-borderline pl-3">
            <div className="flex justify-between text-ink-muted">
              <span>Subtotal:</span>
              <span className="font-mono">{formatCurrency(sale.subtotal)}</span>
            </div>
            {sale.discount > 0 && (
              <div className="flex justify-between text-status-success">
                <span>Descuento:</span>
                <span className="font-mono">-{formatCurrency(sale.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-ink-muted">
              <span>IVA (19%):</span>
              <span className="font-mono">{formatCurrency(sale.tax)}</span>
            </div>
            <div className="flex justify-between font-bold text-sm text-ink-base border-t border-borderline pt-1">
              <span>TOTAL LIQUIDADO:</span>
              <span className="font-mono text-primary">{formatCurrency(sale.total)}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-2 border-t border-borderline/60">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cerrar Detalle
          </Button>
          <Button variant="primary" size="sm" onClick={() => window.print()} icon={Printer}>
            Reimprimir Comprobante
          </Button>
        </div>
      </div>
    </Modal>
  );
};
