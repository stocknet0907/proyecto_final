import React from 'react';
import { Edit2, Star, Eye } from 'lucide-react';
import { Table } from '../../../shared/components/Table';
import { Badge } from '../../../shared/components/Badge';
import { Switch } from '../../../shared/components/Switch';
import { Button } from '../../../shared/components/Button';

export const SupplierTable = ({ suppliers = [], onEdit, onViewDetail, onToggleStatus }) => {
  const columns = [
    {
      header: 'NIT / Identificación',
      key: 'taxId',
      className: 'w-36 font-mono text-xs font-semibold text-primary',
    },
    {
      header: 'Razón Social / Proveedor',
      key: 'companyName',
      render: (s) => (
        <div>
          <span className="font-semibold text-ink-base block">{s.companyName}</span>
          <span className="text-xs text-ink-muted">Contacto: {s.contactPerson} &bull; {s.phone}</span>
        </div>
      ),
    },
    {
      header: 'Entrega Promedio',
      key: 'leadTimeDays',
      align: 'center',
      className: 'text-xs font-mono',
      render: (s) => `${s.leadTimeDays} días hábiles`,
    },
    {
      header: 'Calificación',
      key: 'rating',
      align: 'center',
      render: (s) => (
        <div className="flex items-center justify-center gap-0.5 text-secondary">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3.5 h-3.5 ${
                i < s.rating ? 'fill-secondary text-secondary' : 'text-borderline'
              }`}
            />
          ))}
        </div>
      ),
    },
    {
      header: 'Estado',
      key: 'active',
      align: 'center',
      render: (s) => (
        <Switch
          size="sm"
          checked={s.active}
          onChange={() => onToggleStatus && onToggleStatus(s.id)}
        />
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
            title="Ver catálogo e historial"
            icon={Eye}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit && onEdit(s)}
            title="Editar proveedor"
            icon={Edit2}
          />
        </div>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      data={suppliers}
      emptyMessage="No se encontraron proveedores coincidentes."
    />
  );
};
