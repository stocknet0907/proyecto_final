import React from 'react';
import { Edit2, Package } from 'lucide-react';
import { Table } from '../../../shared/components/Table';
import { Badge } from '../../../shared/components/Badge';
import { Switch } from '../../../shared/components/Switch';
import { Button } from '../../../shared/components/Button';

export const CategoryTable = ({ categories = [], onEdit, onToggleStatus }) => {
  const columns = [
    {
      header: 'Código',
      key: 'code',
      className: 'w-32 font-mono text-xs font-semibold text-primary',
    },
    {
      header: 'Denominación de Categoría',
      key: 'name',
      render: (cat) => (
        <div>
          <span className="font-semibold text-ink-base block">{cat.name}</span>
          <span className="text-xs text-ink-muted">{cat.description}</span>
        </div>
      ),
    },
    {
      header: 'Departamento',
      key: 'department',
      className: 'text-xs text-ink-muted',
    },
    {
      header: 'Productos Vinculados',
      key: 'productCount',
      align: 'center',
      render: (cat) => (
        <Badge variant="primary" size="xs">
          <Package className="w-3 h-3" /> {cat.productCount} artículos
        </Badge>
      ),
    },
    {
      header: 'Estado',
      key: 'active',
      align: 'center',
      render: (cat) => (
        <Switch
          size="sm"
          checked={cat.active}
          onChange={() => onToggleStatus && onToggleStatus(cat.id)}
        />
      ),
    },
    {
      header: 'Acciones',
      key: 'actions',
      align: 'right',
      render: (cat) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit && onEdit(cat)}
          title="Editar categoría"
          icon={Edit2}
        />
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      data={categories}
      emptyMessage="No se encontraron categorías coincidentes."
    />
  );
};
