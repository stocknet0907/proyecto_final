import React from 'react';
import { Edit2, Eye, ShieldAlert, CheckCircle2, UserX } from 'lucide-react';
import { Table } from '../../../shared/components/Table';
import { Badge } from '../../../shared/components/Badge';
import { Switch } from '../../../shared/components/Switch';
import { Button } from '../../../shared/components/Button';
import { formatCurrency } from '../../../shared/utils/formatters';

export const CustomerTable = ({ customers = [], onEdit, onViewDetail, onToggleStatus }) => {
  const getStatusBadge = (customer) => {
    if (customer.status === 'overdue_blocked') {
      return (
        <Badge variant="error" size="xs">
          <ShieldAlert className="w-3 h-3" /> Bloqueado (Mora)
        </Badge>
      );
    }
    if (customer.status === 'inactive') {
      return (
        <Badge variant="neutral" size="xs">
          <UserX className="w-3 h-3" /> Inactivo
        </Badge>
      );
    }
    return (
      <Badge variant="success" size="xs">
        <CheckCircle2 className="w-3 h-3" /> Activo
      </Badge>
    );
  };

  const columns = [
    {
      header: 'Cédula / NIT',
      key: 'documentId',
      className: 'w-36 font-mono text-xs font-semibold text-primary',
    },
    {
      header: 'Nombre / Razón Social',
      key: 'name',
      render: (c) => (
        <div>
          <span className="font-semibold text-ink-base block">{c.name}</span>
          <span className="text-xs text-ink-muted">Tel: {c.phone} &bull; {c.address}</span>
        </div>
      ),
    },
    {
      header: 'Cupo de Crédito',
      key: 'creditLimit',
      align: 'right',
      className: 'font-mono tabular-nums text-xs font-semibold',
      render: (c) => formatCurrency(c.creditLimit),
    },
    {
      header: 'Deuda Actual',
      key: 'currentDebt',
      align: 'right',
      className: 'font-mono tabular-nums text-xs',
      render: (c) => (
        <span
          className={`font-bold ${
            c.currentDebt > 0 ? 'text-status-warning' : 'text-status-success'
          }`}
        >
          {formatCurrency(c.currentDebt)}
        </span>
      ),
    },
    {
      header: 'Crédito Disponible',
      key: 'availableCredit',
      align: 'right',
      className: 'font-mono tabular-nums text-xs font-semibold text-primary',
      render: (c) => formatCurrency(Math.max(0, c.creditLimit - c.currentDebt)),
    },
    {
      header: 'Estado',
      key: 'status',
      align: 'center',
      render: (c) => getStatusBadge(c),
    },
    {
      header: 'Habilitado',
      key: 'switch',
      align: 'center',
      render: (c) => (
        <Switch
          size="sm"
          checked={c.status === 'active'}
          onChange={() => onToggleStatus && onToggleStatus(c.id)}
          disabled={c.status === 'overdue_blocked'}
        />
      ),
    },
    {
      header: 'Acciones',
      key: 'actions',
      align: 'right',
      render: (c) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewDetail && onViewDetail(c)}
            title="Ver estado de cuenta"
            icon={Eye}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit && onEdit(c)}
            title="Editar cliente"
            icon={Edit2}
          />
        </div>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      data={customers}
      emptyMessage="No se encontraron clientes coincidentes."
    />
  );
};
