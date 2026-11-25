import React from 'react';
import { Edit2, Sliders, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { Table } from '../../../shared/components/Table';
import { Badge } from '../../../shared/components/Badge';
import { Switch } from '../../../shared/components/Switch';
import { Button } from '../../../shared/components/Button';
import { formatCurrency, formatPercent } from '../../../shared/utils/formatters';

export const ProductTable = ({
  products = [],
  onEditProduct,
  onAdjustStock,
  onToggleStatus,
}) => {
  const getStockBadge = (product) => {
    if (product.currentStock === 0) {
      return (
        <Badge variant="error" size="xs">
          <XCircle className="w-3 h-3" /> Agotado (0)
        </Badge>
      );
    }
    if (product.currentStock <= product.minStock) {
      return (
        <Badge variant="warning" size="xs">
          <AlertCircle className="w-3 h-3" /> Bajo ({product.currentStock})
        </Badge>
      );
    }
    return (
      <Badge variant="success" size="xs">
        <CheckCircle2 className="w-3 h-3" /> {product.currentStock} {product.unit}s
      </Badge>
    );
  };

  const columns = [
    {
      header: 'Referencia / SKU',
      key: 'sku',
      className: 'w-36 font-mono text-xs font-semibold text-primary',
      render: (p) => (
        <div>
          <span className="block">{p.sku}</span>
          <span className="text-[10px] text-ink-muted">{p.barcode}</span>
        </div>
      ),
    },
    {
      header: 'Descripción del Producto',
      key: 'name',
      render: (p) => (
        <div>
          <span className="font-semibold text-ink-base block">{p.name}</span>
          <span className="text-xs text-ink-muted">{p.categoryName} &bull; {p.location}</span>
        </div>
      ),
    },
    {
      header: 'Costo Compra',
      key: 'costPrice',
      align: 'right',
      className: 'font-mono tabular-nums text-xs text-ink-muted',
      render: (p) => formatCurrency(p.costPrice),
    },
    {
      header: 'Precio Venta',
      key: 'salePrice',
      align: 'right',
      className: 'font-mono tabular-nums text-xs font-bold text-ink-base',
      render: (p) => formatCurrency(p.salePrice),
    },
    {
      header: 'Margen',
      key: 'marginPercent',
      align: 'right',
      className: 'font-mono tabular-nums text-xs',
      render: (p) => (
        <span
          className={`font-semibold ${
            p.marginPercent >= 35 ? 'text-status-success' : 'text-secondary-dark'
          }`}
        >
          {formatPercent(p.marginPercent)}
        </span>
      ),
    },
    {
      header: 'Existencia',
      key: 'currentStock',
      align: 'center',
      render: (p) => getStockBadge(p),
    },
    {
      header: 'Estado',
      key: 'active',
      align: 'center',
      render: (p) => (
        <Switch
          size="sm"
          checked={p.active}
          onChange={() => onToggleStatus && onToggleStatus(p.id)}
        />
      ),
    },
    {
      header: 'Acciones',
      key: 'actions',
      align: 'right',
      render: (p) => (
        <div className="flex items-center justify-end gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAdjustStock && onAdjustStock(p)}
            title="Ajuste de inventario físico"
            icon={Sliders}
          >
            Ajustar
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEditProduct && onEditProduct(p)}
            title="Editar ficha técnica"
            icon={Edit2}
          />
        </div>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      data={products}
      emptyMessage="No se encontraron productos coincidentes con los criterios de búsqueda."
    />
  );
};
