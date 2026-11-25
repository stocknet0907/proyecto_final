import React from 'react';
import { Card } from '../../../shared/components/Card';
import { Badge } from '../../../shared/components/Badge';
import { AlertCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const StockAlertsList = ({ products = [] }) => {
  return (
    <Card
      title="Monitoreo de Stock Crítico (Almacén)"
      subtitle="Referencias bajo el umbral de seguridad que requieren reabastecimiento"
      headerAction={
        <Link
          to="/inventory/products"
          className="text-xs font-semibold text-primary hover:text-primary-dark flex items-center gap-1"
        >
          Ver Todo <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      }
    >
      {products.length === 0 ? (
        <div className="py-8 text-center text-xs text-status-success font-medium">
          Todas las referencias de inventario se encuentran sobre su umbral mínimo de seguridad.
        </div>
      ) : (
        <div className="divide-y divide-borderline">
          {products.map((p) => {
            const isOutOfStock = p.currentStock === 0;
            return (
              <div key={p.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                <div className="flex-1 min-w-0">
                  <span className="font-semibold text-ink-base block truncate">{p.name}</span>
                  <span className="text-[10px] text-ink-muted">
                    SKU: {p.sku} &bull; {p.location}
                  </span>
                </div>
                <div className="text-right shrink-0">
                  <Badge variant={isOutOfStock ? 'error' : 'warning'} size="xs">
                    {isOutOfStock ? (
                      <AlertCircle className="w-3 h-3" />
                    ) : (
                      <AlertTriangle className="w-3 h-3" />
                    )}
                    {p.currentStock} {p.unit}s (Mín: {p.minStock})
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};
