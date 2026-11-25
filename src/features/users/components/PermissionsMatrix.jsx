import React from 'react';
import { Check, X, Shield } from 'lucide-react';
import { Card } from '../../../shared/components/Card';
import { ROLE_PERMISSIONS, ROLE_LABELS, ROLES } from '../../../shared/constants/roles';

export const PermissionsMatrix = () => {
  const permissionLabels = [
    { key: 'canViewDashboard', label: 'Ver Panel de Control y KPIs Ejecutivos' },
    { key: 'canViewFinancials', label: 'Consultar Reportes Financieros y Márgenes' },
    { key: 'canOperatePos', label: 'Operar Punto de Venta (POS) y Cobro' },
    { key: 'canManageProducts', label: 'Crear y Modificar Catálogo de Productos' },
    { key: 'canAdjustStock', label: 'Realizar Ajustes Físicos y Mermas de Stock' },
    { key: 'canManageCategories', label: 'Administrar Jerarquía de Categorías' },
    { key: 'canManagePurchases', label: 'Emitir y Recepcionar Órdenes de Compra' },
    { key: 'canManageSuppliers', label: 'Gestionar Proveedores y Contactos' },
    { key: 'canManageCustomers', label: 'Gestionar Clientes y Cupos de Crédito' },
    { key: 'canManageCredits', label: 'Registrar Abonos y Cartera por Cobrar' },
    { key: 'canManageUsers', label: 'Crear Usuarios y Configurar Seguridad' },
  ];

  return (
    <Card
      title="Matriz de Privilegios y Control de Acceso Basado en Roles (RBAC)"
      subtitle="Definición formal de permisos asignados a cada perfil de usuario en STOCK.NET"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-primary text-white font-medium">
              <th className="py-2.5 px-3 text-left">Capacidad Funcional / Módulo</th>
              <th className="py-2.5 px-3 text-center w-36">Propietario</th>
              <th className="py-2.5 px-3 text-center w-36">Almacén / BD</th>
              <th className="py-2.5 px-3 text-center w-36">Cajero POS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-borderline">
            {permissionLabels.map((perm) => (
              <tr key={perm.key} className="hover:bg-surface-container/40">
                <td className="py-2 px-3 text-ink-base font-medium">{perm.label}</td>
                <td className="py-2 px-3 text-center">
                  {ROLE_PERMISSIONS[ROLES.ADMIN][perm.key] ? (
                    <Check className="w-4 h-4 text-status-success mx-auto" />
                  ) : (
                    <X className="w-4 h-4 text-borderline mx-auto" />
                  )}
                </td>
                <td className="py-2 px-3 text-center">
                  {ROLE_PERMISSIONS[ROLES.DB_ADMIN][perm.key] ? (
                    <Check className="w-4 h-4 text-status-success mx-auto" />
                  ) : (
                    <X className="w-4 h-4 text-borderline mx-auto" />
                  )}
                </td>
                <td className="py-2 px-3 text-center">
                  {ROLE_PERMISSIONS[ROLES.CASHIER][perm.key] ? (
                    <Check className="w-4 h-4 text-status-success mx-auto" />
                  ) : (
                    <X className="w-4 h-4 text-borderline mx-auto" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
