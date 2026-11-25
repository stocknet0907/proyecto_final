import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { INITIAL_USERS } from '../data/initialUsers';
import { ROLE_PERMISSIONS, ROLE_LABELS } from '../../../shared/constants/roles';

const MAX_FAILED_ATTEMPTS = 3;
const LOCKOUT_DURATION_MS = 60 * 1000; // 60 segundos de bloqueo temporal

export const useAuthStore = create(
  persist(
    (set, get) => ({
      currentUser: INITIAL_USERS[0], // Por defecto inicia con Administrador para comodidad de revisión
      users: INITIAL_USERS,
      failedAttemptsCount: 0,
      isLocked: false,
      lockoutUntil: null,

      // Iniciar sesión con validación de credenciales (RF02, RF03, RF04)
      login: ({ usernameOrEmail, password }) => {
        const state = get();
        const now = Date.now();

        // Verificar si está bloqueado temporalmente
        if (state.isLocked && state.lockoutUntil && now < state.lockoutUntil) {
          const remainingSecs = Math.ceil((state.lockoutUntil - now) / 1000);
          return {
            success: false,
            error: `Acceso temporalmente bloqueado por exceso de intentos fallidos. Espere ${remainingSecs} segundos.`,
            isLocked: true,
            remainingSecs,
          };
        }

        // Si ya expiró el bloqueo, resetearlo
        if (state.isLocked && state.lockoutUntil && now >= state.lockoutUntil) {
          set({ isLocked: false, lockoutUntil: null, failedAttemptsCount: 0 });
        }

        const cleanInput = usernameOrEmail.trim().toLowerCase();
        const foundUser = state.users.find(
          (u) =>
            u.email.toLowerCase() === cleanInput ||
            u.username.toLowerCase() === cleanInput
        );

        if (!foundUser || foundUser.passwordHash !== password) {
          const newFailCount = (get().failedAttemptsCount || 0) + 1;
          const willLock = newFailCount >= MAX_FAILED_ATTEMPTS;
          const lockTime = willLock ? now + LOCKOUT_DURATION_MS : null;

          set({
            failedAttemptsCount: willLock ? MAX_FAILED_ATTEMPTS : newFailCount,
            isLocked: willLock,
            lockoutUntil: lockTime,
          });

          return {
            success: false,
            error: willLock
              ? `Ha superado el límite de ${MAX_FAILED_ATTEMPTS} intentos fallidos. Cuenta bloqueada temporalmente por seguridad.`
              : `Credenciales inválidas. Intento ${newFailCount} de ${MAX_FAILED_ATTEMPTS}.`,
            isLocked: willLock,
            attemptsLeft: MAX_FAILED_ATTEMPTS - newFailCount,
          };
        }

        if (foundUser.status !== 'active') {
          return {
            success: false,
            error: 'El usuario se encuentra inactivo. Comuníquese con el administrador.',
          };
        }

        // Login exitoso: actualizar último acceso y resetear intentos
        const updatedUser = {
          ...foundUser,
          lastLogin: new Date().toISOString(),
          permissions: ROLE_PERMISSIONS[foundUser.role],
        };

        set({
          currentUser: updatedUser,
          failedAttemptsCount: 0,
          isLocked: false,
          lockoutUntil: null,
        });

        return { success: true, user: updatedUser };
      },

      // Simular cambio de rol directo en demo (RF06)
      switchRoleDemo: (role) => {
        const state = get();
        const targetUser = state.users.find((u) => u.role === role) || {
          id: `usr-demo-${role}`,
          name: `Operador (${ROLE_LABELS[role]})`,
          email: `${role}@stocknet.com`,
          username: role,
          role,
          roleLabel: ROLE_LABELS[role],
          status: 'active',
          permissions: ROLE_PERMISSIONS[role],
        };

        set({ currentUser: targetUser, failedAttemptsCount: 0, isLocked: false });
      },

      // Cierre de sesión seguro (RF05)
      logout: () => {
        set({ currentUser: null });
      },

      // Restablecer conteo de intentos (admin)
      resetFailedAttempts: () => {
        set({ failedAttemptsCount: 0, isLocked: false, lockoutUntil: null });
      },

      // Restablecer datos iniciales de auth
      resetMockData: () => {
        set({
          currentUser: INITIAL_USERS[0],
          users: INITIAL_USERS,
          failedAttemptsCount: 0,
          isLocked: false,
          lockoutUntil: null,
        });
      },
    }),
    {
      name: 'stocknet_auth',
    }
  )
);
