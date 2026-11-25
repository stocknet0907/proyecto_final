import React from 'react';
import { Edit2, ShieldAlert, CheckCircle2, UserCheck, Unlock } from 'lucide-react';
import { Table } from '../../../shared/components/Table';
import { Badge } from '../../../shared/components/Badge';
import { Switch } from '../../../shared/components/Switch';
import { Button } from '../../../shared/components/Button';
import { formatDate } from '../../../shared/utils/formatters';

export const UserTable = ({ users = [], onEdit, onUnlock, onToggleStatus }) => {
  const getRoleBadge = (role) => {
    const map = {
      admin: { label: 'Propietario', variant: 'secondary' },
      db_admin: { label: 'Admin Almacén/BD', variant: 'primary' },
      cashier: { label: 'Cajero POS', variant: 'neutral' },
    };
    const r = map[role] || { label: role, variant: 'neutral' };
    return <Badge variant={r.variant} size="xs">{r.label}</Badge>;
  };

  const columns = [
    {
      header: 'Operador',
      key: 'name',
      render: (u) => (
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center font-display text-xs font-bold shrink-0">
            {u.avatar || u.name.charAt(0)}
          </div>
          <div>
            <span className="font-semibold text-ink-base block">{u.name}</span>
            <span className="text-[10px] text-ink-muted">@{u.username} &bull; {u.email}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Nivel de Acceso (Rol)',
      key: 'role',
      align: 'center',
      render: (u) => getRoleBadge(u.role),
    },
    {
      header: 'Último Acceso',
      key: 'lastLogin',
      className: 'text-xs text-ink-muted',
      render: (u) => (u.lastLogin ? formatDate(u.lastLogin, true) : 'Sin registrar'),
    },
    {
      header: 'Intentos Fallidos',
      key: 'failedAttempts',
      align: 'center',
      className: 'font-mono text-xs',
      render: (u) => (
        <span
          className={
            u.failedAttempts >= 3
              ? 'text-status-error font-bold'
              : u.failedAttempts > 0
              ? 'text-status-warning font-semibold'
              : 'text-ink-muted'
          }
        >
          {u.failedAttempts || 0} / 3
        </span>
      ),
    },
    {
      header: 'Estado',
      key: 'status',
      align: 'center',
      render: (u) => (
        <Switch
          size="sm"
          checked={u.status === 'active'}
          onChange={() => onToggleStatus && onToggleStatus(u.id)}
        />
      ),
    },
    {
      header: 'Acciones',
      key: 'actions',
      align: 'right',
      render: (u) => (
        <div className="flex items-center justify-end gap-1">
          {u.failedAttempts >= 3 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onUnlock && onUnlock(u.id)}
              title="Desbloquear usuario por intentos fallidos"
              icon={Unlock}
            >
              Desbloquear
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit && onEdit(u)}
            title="Editar operador"
            icon={Edit2}
          />
        </div>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      data={users}
      emptyMessage="No se encontraron operadores registrados."
    />
  );
};
