import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { INITIAL_USERS } from '../data/initialUsers';
import { ROLE_LABELS, ROLE_PERMISSIONS } from '../../../shared/constants/roles';

export const INITIAL_AUDIT_LOGS = [
  {
    id: 'log-001',
    timestamp: '2026-11-20T10:15:00.000Z',
    operatorName: 'Carlos Rodríguez',
    action: 'Inicio de Sesión Exitoso',
    module: 'Seguridad / Auth',
    details: 'Autenticación mediante credenciales con rol Administrador Propietario.',
    severity: 'info',
  },
  {
    id: 'log-002',
    timestamp: '2026-11-20T09:45:00.000Z',
    operatorName: 'Julián Méndez',
    action: 'Emisión de Venta a Crédito',
    module: 'Punto de Venta POS',
    details: 'Comprobante FAC-008921 generado por $1.187.620 al cliente Transportes del Norte.',
    severity: 'success',
  },
  {
    id: 'log-003',
    timestamp: '2026-11-19T09:15:00.000Z',
    operatorName: 'Laura Morales',
    action: 'Ajuste Físico de Existencias',
    module: 'Inventario',
    details: 'Merma por daño de 2 unidades de Refrigerante Valvoline.',
    severity: 'warning',
  },
];

export const useUsersStore = create(
  persist(
    (set, get) => ({
      users: INITIAL_USERS,
      auditLogs: INITIAL_AUDIT_LOGS,

      addUser: (userData) => {
        const state = get();
        const role = userData.role || 'cashier';
        const newUser = {
          ...userData,
          id: `usr-${Date.now().toString().slice(-6)}`,
          role,
          roleLabel: ROLE_LABELS[role] || 'Operador',
          status: 'active',
          failedAttempts: 0,
          permissions: ROLE_PERMISSIONS[role],
          lastLogin: null,
          avatar: userData.name?.slice(0, 2).toUpperCase() || 'OP',
        };

        const newLog = {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString(),
          operatorName: 'Administrador',
          action: 'Alta de Nuevo Operador',
          module: 'Usuarios',
          details: `Usuario ${newUser.username} creado con rol ${newUser.roleLabel}.`,
          severity: 'info',
        };

        set({
          users: [newUser, ...state.users],
          auditLogs: [newLog, ...state.auditLogs],
        });

        return newUser;
      },

      updateUser: (id, updatedFields) => {
        const state = get();
        const role = updatedFields.role;
        const updatedUsers = state.users.map((u) => {
          if (u.id === id) {
            const nextRole = role || u.role;
            return {
              ...u,
              ...updatedFields,
              role: nextRole,
              roleLabel: ROLE_LABELS[nextRole] || u.roleLabel,
              permissions: ROLE_PERMISSIONS[nextRole],
            };
          }
          return u;
        });

        set({ users: updatedUsers });
      },

      toggleUserStatus: (id) => {
        const state = get();
        set({
          users: state.users.map((u) => {
            if (u.id === id) {
              const newStatus = u.status === 'active' ? 'inactive' : 'active';
              return { ...u, status: newStatus };
            }
            return u;
          }),
        });
      },

      unlockUser: (id) => {
        const state = get();
        set({
          users: state.users.map((u) =>
            u.id === id ? { ...u, failedAttempts: 0, status: 'active' } : u
          ),
        });
      },

      resetMockData: () => {
        set({ users: INITIAL_USERS, auditLogs: INITIAL_AUDIT_LOGS });
      },
    }),
    {
      name: 'stocknet_users',
    }
  )
);
