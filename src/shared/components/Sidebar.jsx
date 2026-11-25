import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Boxes,
  ShoppingCart,
  TrendingUp,
  Truck,
  Users,
  CreditCard,
  ShieldCheck,
  Building2,
  X,
} from 'lucide-react';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { cn } from '../utils/cn';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const permissions = user?.permissions || {};

  const navigationItems = [
    {
      label: 'Panel de Control',
      path: '/dashboard',
      icon: LayoutDashboard,
      visible: permissions.canViewDashboard,
    },
    {
      label: 'Punto de Venta (POS)',
      path: '/pos',
      icon: ShoppingCart,
      visible: permissions.canOperatePos,
      badge: 'Caja',
    },
    {
      label: 'Productos',
      path: '/inventory/products',
      icon: Package,
      visible: permissions.canManageProducts,
    },
    {
      label: 'Categorías',
      path: '/inventory/categories',
      icon: Boxes,
      visible: permissions.canManageCategories,
    },
    {
      label: 'Ventas y Rentabilidad',
      path: '/sales',
      icon: TrendingUp,
      visible: permissions.canViewSales,
    },
    {
      label: 'Compras y Recepción',
      path: '/purchases',
      icon: Truck,
      visible: permissions.canManagePurchases,
    },
    {
      label: 'Proveedores',
      path: '/suppliers',
      icon: Building2,
      visible: permissions.canManageSuppliers,
    },
    {
      label: 'Gestión de Clientes',
      path: '/customers',
      icon: Users,
      visible: permissions.canManageCustomers,
    },
    {
      label: 'Créditos y Cartera',
      path: '/credits',
      icon: CreditCard,
      visible: permissions.canManageCredits,
    },
    {
      label: 'Usuarios y Auditoría',
      path: '/users',
      icon: ShieldCheck,
      visible: permissions.canManageUsers,
    },
  ];

  return (
    <>
      {/* Backdrop para pantallas móviles */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-40 w-64 bg-primary text-white flex flex-col border-r border-primary-dark transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand Header */}
        <div className="h-14 px-5 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-sm bg-secondary flex items-center justify-center font-display font-black text-ink-base text-base tracking-tighter">
              SN
            </div>
            <div>
              <h1 className="font-display font-bold text-base tracking-tight leading-none text-white">
                STOCK<span className="text-secondary">.NET</span>
              </h1>
              <p className="text-[10px] text-white/70 tracking-widest uppercase font-mono mt-0.5">
                Supply Chain & POS
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-white/70 hover:text-white rounded-sm hover:bg-white/10"
            aria-label="Cerrar navegación"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-white/50 font-mono">
            Módulos Operativos
          </div>
          {navigationItems
            .filter((item) => item.visible !== false)
            .map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => onClose && onClose()}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center justify-between px-3 py-2 rounded-sm text-xs font-medium transition-all group select-none',
                      isActive
                        ? 'bg-secondary text-ink-base font-bold shadow-sm'
                        : 'text-white/80 hover:bg-primary-dark hover:text-white'
                    )
                  }
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-105" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/20 text-white font-mono uppercase">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
        </nav>

        {/* Footer Info */}
        <div className="p-3.5 border-t border-white/10 bg-primary-dark/40 text-[11px] text-white/70">
          <p className="font-medium text-white">{user?.roleLabel || 'Operador Conectado'}</p>
          <p className="text-[10px] text-white/50 mt-0.5">Versión 2.0.0 — Frontend First</p>
        </div>
      </aside>
    </>
  );
};
