import React, { useState } from 'react';
import {
  Warehouse,
  RotateCcw,
  User,
  LogOut,
  ChevronDown,
  Bell,
  Menu,
} from 'lucide-react';
import { useAuth } from '../../features/auth/hooks/useAuth';
import { WAREHOUSE_LOCATIONS } from '../constants/theme';
import { useToast } from './Toast';
import { ConfirmDialog } from './ConfirmDialog';

export const Header = ({ onToggleSidebar }) => {
  const { user, logout, resetMockData } = useAuth();
  const { addToast } = useToast();
  const [selectedWarehouse, setSelectedWarehouse] = useState(WAREHOUSE_LOCATIONS[0].id);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleResetData = () => {
    resetMockData();
    addToast({ message: 'Datos de prueba restablecidos exitosamente.', type: 'info' });
  };

  return (
    <header className="sticky top-0 z-30 bg-surface-lowest border-b border-borderline px-4 sm:px-6 py-2.5 flex items-center justify-between shadow-subtle">
      {/* Botón toggle móvil & Selector de almacén */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="lg:hidden p-2 text-ink-muted hover:text-ink-base rounded-sm hover:bg-surface-container"
          aria-label="Alternar menú lateral"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 bg-surface-container px-3 py-1.5 rounded-sm border border-borderline">
          <Warehouse className="w-4 h-4 text-primary shrink-0" />
          <select
            value={selectedWarehouse}
            onChange={(e) => {
              setSelectedWarehouse(e.target.value);
              addToast({
                message: `Almacén activo cambiado a: ${
                  WAREHOUSE_LOCATIONS.find((w) => w.id === e.target.value)?.name
                }`,
                type: 'info',
              });
            }}
            className="bg-transparent text-xs font-semibold text-ink-base focus:outline-none cursor-pointer pr-1"
          >
            {WAREHOUSE_LOCATIONS.map((wh) => (
              <option key={wh.id} value={wh.id} className="bg-white">
                {wh.code} — {wh.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Acciones de usuario, notificaciones y reseteo */}
      <div className="flex items-center gap-2.5">
        {/* Botón de Restablecimiento de Mock Data */}
        <button
          type="button"
          onClick={() => setShowResetConfirm(true)}
          title="Restablecer datos maestros de prueba (Reset Mock Data)"
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-secondary-dark bg-secondary-light/40 hover:bg-secondary-light/80 border border-secondary/30 rounded-sm transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Restablecer Datos</span>
        </button>

        {/* Notificaciones */}
        <button
          type="button"
          className="relative p-2 text-ink-muted hover:text-ink-base rounded-sm hover:bg-surface-container transition-colors"
          title="Alertas operativas"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-status-warning rounded-full" />
        </button>

        {/* Perfil de Usuario */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1.5 rounded-sm hover:bg-surface-container border border-transparent hover:border-borderline transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center font-display text-xs font-bold">
              {user?.name ? user.name.charAt(0) : 'U'}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-semibold text-ink-base leading-tight">
                {user?.name || 'Operador'}
              </span>
              <span className="text-[10px] text-ink-muted">{user?.roleLabel || 'Cajero'}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-ink-muted" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-1 w-52 bg-surface-lowest border border-borderline rounded-lg shadow-dropdown py-1 z-40 animate-modal-enter">
              <div className="px-3.5 py-2 border-b border-borderline/60">
                <p className="text-xs font-semibold text-ink-base">{user?.name}</p>
                <p className="text-[10px] text-ink-muted truncate">{user?.email}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowUserMenu(false);
                  logout();
                }}
                className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-status-error hover:bg-status-error-bg font-medium transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                Cerrar Sesión Segura
              </button>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        onConfirm={handleResetData}
        title="¿Restablecer datos maestros de prueba?"
        message="Esta acción limpiará el almacenamiento local y recargará todos los productos, ventas, clientes, órdenes de compra y créditos a sus valores iniciales."
        confirmText="Restablecer Todo"
        variant="primary"
      />
    </header>
  );
};
