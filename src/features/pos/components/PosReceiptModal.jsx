import React from 'react';
import { Modal } from '../../../shared/components/Modal';
import { Button } from '../../../shared/components/Button';
import { formatCurrency, formatDate } from '../../../shared/utils/formatters';
import { Printer, CheckCircle2, FileText } from 'lucide-react';

export const PosReceiptModal = ({ isOpen, onClose, sale }) => {
  if (!sale) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Comprobante de Venta Emitido"
      subtitle={`Factura N° ${sale.id}`}
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        {/* Banner de éxito */}
        <div className="p-3 bg-status-success-bg border border-status-success-border rounded-lg flex items-center gap-2.5 text-xs text-status-success font-semibold">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Venta registrada exitosamente. Inventario descontado.</span>
        </div>

        {/* Formato Ticket Térmico Imprimible */}
        <div className="p-4 bg-surface-lowest border border-borderline rounded-lg font-mono text-xs space-y-3 shadow-xs">
          <div className="text-center space-y-0.5 border-b border-dashed border-borderline pb-3">
            <h3 className="font-display font-black text-sm tracking-tight text-ink-base">
              STOCK.NET S.A.S.
            </h3>
            <p className="text-[10px] text-ink-muted">NIT: 901.442.880-9 &bull; Régimen Común</p>
            <p className="text-[10px] text-ink-muted">Bodega Central &bull; Tel: (601) 380-4500</p>
          </div>

          <div className="text-[11px] space-y-0.5 border-b border-dashed border-borderline pb-2 text-ink-muted">
            <p><strong>Factura:</strong> {sale.id}</p>
            <p><strong>Fecha:</strong> {formatDate(sale.date, true)}</p>
            <p><strong>Cliente:</strong> {sale.customerName}</p>
            <p><strong>NIT/CC:</strong> {sale.customerDocument}</p>
            <p><strong>Medio de Pago:</strong> {sale.paymentMethod.toUpperCase()}</p>
            <p><strong>Cajero:</strong> {sale.cashierName}</p>
          </div>

          {/* Tabla de Artículos */}
          <div className="space-y-1.5 border-b border-dashed border-borderline pb-2">
            <div className="flex justify-between font-bold text-[10px] text-ink-base">
              <span>CANT &bull; ARTÍCULO</span>
              <span>TOTAL</span>
            </div>
            {sale.items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-[11px]">
                <span className="truncate pr-2">
                  {item.quantity}x {item.productName}
                </span>
                <span className="tabular-nums font-semibold shrink-0">
                  {formatCurrency(item.subtotal)}
                </span>
              </div>
            ))}
          </div>

          {/* Totales */}
          <div className="space-y-1 text-xs pt-1">
            <div className="flex justify-between text-ink-muted">
              <span>Subtotal:</span>
              <span className="tabular-nums">{formatCurrency(sale.subtotal)}</span>
            </div>
            {sale.discount > 0 && (
              <div className="flex justify-between text-status-success">
                <span>Descuento:</span>
                <span className="tabular-nums">-{formatCurrency(sale.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-ink-muted">
              <span>IVA (19%):</span>
              <span className="tabular-nums">{formatCurrency(sale.tax)}</span>
            </div>
            <div className="flex justify-between font-bold text-sm text-ink-base border-t border-borderline pt-1">
              <span>TOTAL:</span>
              <span className="tabular-nums">{formatCurrency(sale.total)}</span>
            </div>

            {sale.paymentMethod === 'cash' && (
              <>
                <div className="flex justify-between text-ink-muted text-[11px] pt-1">
                  <span>Recibido Efectivo:</span>
                  <span className="tabular-nums">{formatCurrency(sale.cashTendered)}</span>
                </div>
                <div className="flex justify-between text-status-success font-semibold text-[11px]">
                  <span>Cambio Entregado:</span>
                  <span className="tabular-nums">{formatCurrency(sale.change)}</span>
                </div>
              </>
            )}
          </div>

          <div className="text-center text-[10px] text-ink-muted pt-2 border-t border-dashed border-borderline">
            *** Gracias por su compra en STOCK.NET ***
          </div>
        </div>

        <div className="flex justify-between gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Finalizar
          </Button>
          <Button variant="primary" size="sm" onClick={handlePrint} icon={Printer}>
            Imprimir Ticket
          </Button>
        </div>
      </div>
    </Modal>
  );
};
