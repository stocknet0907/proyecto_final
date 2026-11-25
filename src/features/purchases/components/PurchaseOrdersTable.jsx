import React from 'react';
import { PackageCheck, FileText, Ban } from 'lucide-react';
import { Table } from '../../../shared/components/Table';
import { Badge } from '../../../shared/components/Badge';
import { Button } from '../../../shared/components/Button';
import { formatCurrency, formatDate } from '../../../shared/utils/formatters';

export const PurchaseOrdersTable = ({ orders = [], onReceiveStock, onCancelOrder }) => {
  const getStatusBadge = (status) => {
    const map = {
      pending: { label: 'Pendiente Despacho', variant: 'warning' },
      partially_received: { label: 'Recepción Parcial', variant: 'info' },
      received: { label: 'Recibida Conforme', variant: 'success' },
      cancelled: { label: 'Cancelada', variant: 'error' },
      draft: { label: 'Borrador', variant: 'neutral' },
    };
    const s = map[status] || { label: status, variant: 'neutral' };
    return <Badge variant={s.variant} size="xs">{s.label}</Badge>;
  };

  const columns = [
    {
      header: 'Orden N°',
      key: 'id',
      className: 'w-32 font-mono text-xs font-semibold text-primary',
    },
    {
      header: 'Proveedor',
      key: 'supplierName',
      render: (o) => (
        <div>
          <span className="font-semibold text-ink-base block">{o.supplierName}</span>
          <span className="text-[10px] text-ink-muted">
            {o.items?.length || 0} referencia(s) solicitada(s)
          </span>
        </div>
      ),
    },
    {
      header: 'Fecha Emisión',
      key: 'issueDate',
      className: 'text-xs text-ink-muted',
      render: (o) => formatDate(o.issueDate),
    },
    {
      header: 'Fecha Estimada',
      key: 'expectedDate',
      className: 'text-xs font-mono',
      render: (o) => formatDate(o.expectedDate),
    },
    {
      header: 'Importe Total',
      key: 'totalAmount',
      align: 'right',
      className: 'font-mono tabular-nums text-xs font-bold text-ink-base',
      render: (o) => formatCurrency(o.totalAmount),
    },
    {
      header: 'Estado',
      key: 'status',
      align: 'center',
      render: (o) => getStatusBadge(o.status),
    },
    {
      header: 'Acciones',
      key: 'actions',
      align: 'right',
      render: (o) => (
        <div className="flex items-center justify-end gap-1.5">
          {(o.status === 'pending' || o.status === 'partially_received') && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onReceiveStock && onReceiveStock(o)}
              title="Recepcionar mercancía e incrementar stock"
              icon={PackageCheck}
            >
              Recepcionar
            </Button>
          )}
          {o.status === 'pending' && onCancelOrder && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onCancelOrder(o)}
              title="Cancelar orden"
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
      data={orders}
      emptyMessage="No se registran órdenes de compra para los filtros seleccionados."
    />
  );
};
