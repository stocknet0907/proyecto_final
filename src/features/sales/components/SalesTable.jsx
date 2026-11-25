import React from 'react';
import { Eye, FileText, Ban } from 'lucide-react';
import { Table } from '../../../shared/components/Table';
import { Badge } from '../../../shared/components/Badge';
import { Button } from '../../../shared/components/Button';
import { formatCurrency, formatDate, formatPercent } from '../../../shared/utils/formatters';

export const SalesTable = ({ sales = [], onViewDetail, onCancelSale }) => {
  const getPaymentBadge = (method) => {
    const map = {
      cash: { label: 'Efectivo', variant: 'success' },
      card: { label: 'Tarjeta', variant: 'info' },
      transfer: { label: 'Transferencia', variant: 'primary' },
      credit: { label: 'Crédito', variant: 'warning' },
    };
    const target = map[method] || { label: method, variant: 'neutral' };
    return (
      <Badge variant={target.variant} size="xs">
        {target.label}
      </Badge>
    );
  };

  const columns = [
    {
      header: 'Comprobante',
      key: 'id',
      className: 'w-32 font-mono text-xs font-semibold text-primary',
    },
    {
      header: 'Fecha / Hora',
      key: 'date',
      className: 'text-xs text-ink-muted w-40',
      render: (s) => formatDate(s.date, true),
    },
    {
      header: 'Cliente / Razón Social',
      key: 'customerName',
      render: (s) => (
        <div>
          <span className="font-semibold text-ink-base block">{s.customerName}</span>
          <span className="text-[10px] text-ink-muted">Doc: {s.customerDocument}</span>
        </div>
      ),
    },
    {
      header: 'Medio de Pago',
      key: 'paymentMethod',
      align: 'center',
      render: (s) => getPaymentBadge(s.paymentMethod),
    },
    {
      header: 'Costo (COGS)',
      key: 'totalCost',
      align: 'right',
      className: 'font-mono tabular-nums text-xs text-ink-muted',
      render: (s) => formatCurrency(s.totalCost),
    },
    {
      header: 'Total Facturado',
      key: 'total',
      align: 'right',
      className: 'font-mono tabular-nums text-xs font-bold text-ink-base',
      render: (s) => formatCurrency(s.total),
    },
    {
      header: 'Margen Real',
      key: 'netMargin',
      align: 'right',
      className: 'font-mono tabular-nums text-xs',
      render: (s) => (
        <span className="font-bold text-status-success">
          {formatCurrency(s.netMargin)} ({formatPercent(s.marginPercent)})
        </span>
      ),
    },
    {
      header: 'Estado',
      key: 'status',
      align: 'center',
      render: (s) => (
        <Badge variant={s.status === 'completed' ? 'success' : 'error'} size="xs">
          {s.status === 'completed' ? 'Completada' : 'Anulada'}
        </Badge>
      ),
    },
    {
      header: 'Acciones',
      key: 'actions',
      align: 'right',
      render: (s) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewDetail && onViewDetail(s)}
            title="Ver detalle de factura"
            icon={Eye}
          />
          {s.status === 'completed' && onCancelSale && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onCancelSale(s)}
              title="Anular venta"
              className="text-status-error hover:text-red-700"
              icon={Ban}
            />
          )}
        </div>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      data={sales}
      emptyMessage="No se registran ventas para los filtros seleccionados."
    />
  );
};
