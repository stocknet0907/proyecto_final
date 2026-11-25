import React from 'react';
import { DollarSign, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { Table } from '../../../shared/components/Table';
import { Badge } from '../../../shared/components/Badge';
import { Button } from '../../../shared/components/Button';
import { formatCurrency, formatDate } from '../../../shared/utils/formatters';

export const CreditTable = ({ credits = [], onRegisterPayment, onViewStatement }) => {
  const getStatusBadge = (credit) => {
    if (credit.status === 'paid') {
      return (
        <Badge variant="success" size="xs">
          <CheckCircle2 className="w-3 h-3" /> Saldado Total
        </Badge>
      );
    }
    if (credit.status === 'overdue') {
      return (
        <Badge variant="error" size="xs">
          <AlertCircle className="w-3 h-3" /> Vencido (Mora)
        </Badge>
      );
    }
    return (
      <Badge variant="warning" size="xs">
        Vigente (Al Día)
      </Badge>
    );
  };

  const columns = [
    {
      header: 'Código Crédito',
      key: 'id',
      className: 'w-32 font-mono text-xs font-semibold text-primary',
    },
    {
      header: 'Cliente / Comprador',
      key: 'customerName',
      render: (c) => (
        <div>
          <span className="font-semibold text-ink-base block">{c.customerName}</span>
          <span className="text-[10px] text-ink-muted">Factura Origen: {c.saleId}</span>
        </div>
      ),
    },
    {
      header: 'Monto Original',
      key: 'originalAmount',
      align: 'right',
      className: 'font-mono tabular-nums text-xs text-ink-muted',
      render: (c) => formatCurrency(c.originalAmount),
    },
    {
      header: 'Saldo Pendiente',
      key: 'currentBalance',
      align: 'right',
      className: 'font-mono tabular-nums text-xs font-bold text-ink-base',
      render: (c) => (
        <span className={c.currentBalance > 0 ? 'text-status-warning' : 'text-status-success'}>
          {formatCurrency(c.currentBalance)}
        </span>
      ),
    },
    {
      header: 'Vencimiento',
      key: 'dueDate',
      className: 'text-xs font-mono',
      render: (c) => formatDate(c.dueDate),
    },
    {
      header: 'Estado',
      key: 'status',
      align: 'center',
      render: (c) => getStatusBadge(c),
    },
    {
      header: 'Acciones',
      key: 'actions',
      align: 'right',
      render: (c) => (
        <div className="flex items-center justify-end gap-1.5">
          {c.status !== 'paid' && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onRegisterPayment && onRegisterPayment(c)}
              title="Registrar abono a deuda"
              icon={DollarSign}
            >
              Abonar
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewStatement && onViewStatement(c)}
            title="Ver estado de cuenta y recibos"
            icon={FileText}
          />
        </div>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      data={credits}
      emptyMessage="No se registran créditos para los filtros seleccionados."
    />
  );
};
