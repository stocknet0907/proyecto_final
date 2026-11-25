import React from 'react';
import { Card } from '../../../shared/components/Card';
import { ShoppingCart, PackagePlus, Truck, CreditCard, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';

export const QuickActions = () => {
  const actions = [
    {
      title: 'Abrir Punto de Venta (POS)',
      desc: 'Facturación rápida, escaneo y flujo de cobro',
      path: '/pos',
      icon: ShoppingCart,
      color: 'bg-secondary text-ink-base hover:bg-secondary-hover',
    },
    {
      title: 'Nuevo Producto en Catálogo',
      desc: 'Ficha técnica, precio de venta y márgenes',
      path: '/inventory/products',
      icon: PackagePlus,
      color: 'bg-primary text-white hover:bg-primary-dark',
    },
    {
      title: 'Generar Orden de Compra',
      desc: 'Pedido formal a proveedor para reabastecimiento',
      path: '/purchases',
      icon: Truck,
      color: 'bg-surface-container text-ink-base hover:bg-borderline/50 border border-borderline',
    },
    {
      title: 'Registrar Abono a Cartera',
      desc: 'Amortización de deuda y liquidación de créditos',
      path: '/credits',
      icon: CreditCard,
      color: 'bg-surface-container text-ink-base hover:bg-borderline/50 border border-borderline',
    },
  ];

  return (
    <Card
      title="Accesos Directos Operativos"
      subtitle="Flujos principales para agilizar la gestión diaria del almacén"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <Link
              key={act.path}
              to={act.path}
              className={`p-3.5 rounded-lg transition-all flex flex-col justify-between gap-3 shadow-subtle ${act.color}`}
            >
              <div className="flex items-center justify-between">
                <span className="font-display font-bold text-xs leading-tight line-clamp-1">
                  {act.title}
                </span>
                <Icon className="w-4 h-4 shrink-0" />
              </div>
              <p className="text-[10px] opacity-80 leading-relaxed line-clamp-2">{act.desc}</p>
            </Link>
          );
        })}
      </div>
    </Card>
  );
};
