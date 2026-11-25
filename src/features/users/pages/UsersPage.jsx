import React, { useState } from 'react';
import { Plus, Search, ShieldCheck, History } from 'lucide-react';
import { useUsers } from '../hooks/useUsers';
import { UserTable } from '../components/UserTable';
import { UserFormModal } from '../components/UserFormModal';
import { PermissionsMatrix } from '../components/PermissionsMatrix';
import { AuditLogModal } from '../components/AuditLogModal';
import { Button } from '../../../shared/components/Button';
import { Input } from '../../../shared/components/Input';
import { Select } from '../../../shared/components/Select';
import { useToast } from '../../../shared/components/Toast';
import { ROLES, ROLE_LABELS } from '../../../shared/constants/roles';

export const UsersPage = () => {
  const {
    users,
    auditLogs,
    searchTerm,
    setSearchTerm,
    selectedRole,
    setSelectedRole,
    selectedStatus,
    setSelectedStatus,
    addUser,
    updateUser,
    toggleUserStatus,
    unlockUser,
  } = useUsers();

  const { addToast } = useToast();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isAuditOpen, setIsAuditOpen] = useState(false);

  const handleOpenCreate = () => {
    setEditingUser(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (user) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };

  const handleSaveUser = (userData) => {
    if (editingUser) {
      updateUser(editingUser.id, userData);
      addToast({ message: 'Datos del operador actualizados.', type: 'success' });
    } else {
      addUser(userData);
      addToast({ message: 'Nuevo operador creado exitosamente.', type: 'success' });
    }
  };

  const handleToggleStatus = (id) => {
    toggleUserStatus(id);
    addToast({ message: 'Estado del operador modificado.', type: 'info' });
  };

  const handleUnlock = (id) => {
    unlockUser(id);
    addToast({ message: 'Operador desbloqueado satisfactoriamente.', type: 'success' });
  };

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-2xl text-ink-base">
            Administración de Usuarios, Roles & Seguridad
          </h2>
          <p className="text-xs sm:text-sm text-ink-muted">
            Control de acceso basado en roles (RBAC), desbloqueo por intentos y bitácora de auditoría
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setIsAuditOpen(true)} icon={History}>
            Ver Bitácora (Audit)
          </Button>
          <Button variant="secondary" onClick={handleOpenCreate} icon={Plus}>
            Crear Operador
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-surface-lowest border border-borderline rounded-lg p-4 flex flex-col sm:flex-row items-center gap-3 shadow-subtle">
        <div className="flex-1 w-full">
          <Input
            placeholder="Buscar por Nombre, Correo o Usuario..."
            icon={Search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-56">
          <Select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value="all">Todos los Roles</option>
            <option value={ROLES.ADMIN}>{ROLE_LABELS[ROLES.ADMIN]}</option>
            <option value={ROLES.DB_ADMIN}>{ROLE_LABELS[ROLES.DB_ADMIN]}</option>
            <option value={ROLES.CASHIER}>{ROLE_LABELS[ROLES.CASHIER]}</option>
          </Select>
        </div>
        <div className="w-full sm:w-48">
          <Select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">Todos los Estados</option>
            <option value="active">Solo Activos</option>
            <option value="inactive">Solo Inactivos</option>
          </Select>
        </div>
      </div>

      {/* Tabla de Usuarios */}
      <UserTable
        users={users}
        onEdit={handleOpenEdit}
        onUnlock={handleUnlock}
        onToggleStatus={handleToggleStatus}
      />

      {/* Matriz de Permisos */}
      <PermissionsMatrix />

      {/* Modales */}
      <UserFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveUser}
        user={editingUser}
      />

      <AuditLogModal
        isOpen={isAuditOpen}
        onClose={() => setIsAuditOpen(false)}
        auditLogs={auditLogs}
      />
    </div>
  );
};
