import React from 'react';
import { ROLES, ROLE_LABELS } from '../../../shared/constants/roles';
import { ShieldCheck, HardDrive, ShoppingBag } from 'lucide-react';

export const RoleDemoSwitcher = ({ onSelectRole, currentRole }) => {
  const rolesList = [
    {
      role: ROLES.ADMIN,
      label: ROLE_LABELS[ROLES.ADMIN],
      desc: 'Acceso total gerencial, márgenes, usuarios y créditos',
      icon: ShieldCheck,
      color: 'border-primary/40 bg-primary-light/50',
    },
    {
      role: ROLES.DB_ADMIN,
      label: ROLE_LABELS[ROLES.DB_ADMIN],
      desc: 'Catálogo de almacén, órdenes de compra y ajustes',
      icon: HardDrive,
      color: 'border-secondary/40 bg-secondary-light/40',
    },
    {
      role: ROLES.CASHIER,
      label: ROLE_LABELS[ROLES.CASHIER],
      desc: 'Terminal POS rápido, facturación y cobro en caja',
      icon: ShoppingBag,
      color: 'border-status-success-border bg-status-success-bg/40',
    },
  ];

  return (
    <div className="bg-surface-lowest border border-borderline rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-display font-semibold text-xs uppercase tracking-wider text-ink-muted">
          Simulador Rápido de Roles (Evaluación)
        </h4>
        <span className="text-[10px] bg-primary-light text-primary px-2 py-0.5 rounded font-mono font-medium">
          Acceso en 1 Clic
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {rolesList.map((item) => {
          const Icon = item.icon;
          const isSelected = currentRole === item.role;
          return (
            <button
              key={item.role}
              type="button"
              onClick={() => onSelectRole(item.role)}
              className={`p-2.5 rounded-sm border text-left transition-all flex flex-col justify-between ${
                isSelected
                  ? 'border-secondary ring-2 ring-secondary/50 bg-secondary-light/30'
                  : 'border-borderline/80 hover:border-primary/60 bg-surface-low/50 hover:bg-surface-container'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1.5">
                <Icon className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="text-xs font-bold text-ink-base line-clamp-1">{item.label}</span>
              </div>
              <p className="text-[10px] text-ink-muted line-clamp-2 leading-tight">{item.desc}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
