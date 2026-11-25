import React, { useState } from 'react';
import { Plus, Search, Users, CreditCard, ShieldAlert } from 'lucide-react';
import { useCustomers } from '../hooks/useCustomers';
import { CustomerTable } from '../components/CustomerTable';
import { CustomerFormModal } from '../components/CustomerFormModal';
import { CustomerDetailModal } from '../components/CustomerDetailModal';
import { Button } from '../../../shared/components/Button';
import { Input } from '../../../shared/components/Input';
import { Select } from '../../../shared/components/Select';
import { useToast } from '../../../shared/components/Toast';
import { formatCurrency } from '../../../shared/utils/formatters';

export const CustomersPage = () => {
  const {
    customers,
    searchTerm,
    setSearchTerm,
    selectedStatus,
    setSelectedStatus,
    debtStats,
    addCustomer,
    updateCustomer,
    toggleCustomerStatus,
  } = useCustomers();

  const { addToast } = useToast();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const handleOpenCreate = () => {
    setEditingCustomer(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (customer) => {
    setEditingCustomer(customer);
    setIsFormOpen(true);
  };

  const handleOpenDetail = (customer) => {
    setSelectedCustomer(customer);
    setIsDetailOpen(true);
  };

  const handleSaveCustomer = (custData) => {
    if (editingCustomer) {
      updateCustomer(editingCustomer.id, custData);
      addToast({ message: 'Ficha de cliente actualizada.', type: 'success' });
    } else {
      addCustomer(custData);
      addToast({ message: 'Nuevo cliente registrado en la base de datos.', type: 'success' });
    }
  };

  const handleToggleStatus = (id) => {
    toggleCustomerStatus(id);
    addToast({ message: 'Estado del cliente actualizado.', type: 'info' });
  };

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-2xl text-ink-base">
            Gestión de Clientes & Líneas de Crédito
          </h2>
          <p className="text-xs sm:text-sm text-ink-muted">
            Padrón de compradores, cupos comerciales autorizados y control de morosidad
          </p>
        </div>
        <Button variant="secondary" onClick={handleOpenCreate} icon={Plus}>
          Registrar Cliente
        </Button>
      </div>

      {/* KPI Cards de Clientes y Cartera */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-surface-lowest border border-borderline rounded-lg p-3.5 flex items-center gap-3 shadow-subtle">
          <div className="w-10 h-10 rounded-sm bg-primary-light flex items-center justify-center text-primary">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-ink-muted block">Clientes Registrados</span>
            <span className="font-display font-bold text-lg text-ink-base font-mono">
              {customers.length}
            </span>
          </div>
        </div>

        <div className="bg-surface-lowest border border-borderline rounded-lg p-3.5 flex items-center gap-3 shadow-subtle">
          <div className="w-10 h-10 rounded-sm bg-status-warning-bg flex items-center justify-center text-status-warning">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-ink-muted block">Deuda Total Acumulada</span>
            <span className="font-display font-bold text-lg text-status-warning font-mono">
              {formatCurrency(debtStats.totalDebt)}
            </span>
          </div>
        </div>

        <div className="bg-surface-lowest border border-borderline rounded-lg p-3.5 flex items-center gap-3 shadow-subtle">
          <div className="w-10 h-10 rounded-sm bg-status-error-bg flex items-center justify-center text-status-error">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-ink-muted block">Clientes en Bloqueo por Mora</span>
            <span className="font-display font-bold text-lg text-status-error font-mono">
              {debtStats.blockedCount}
            </span>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-surface-lowest border border-borderline rounded-lg p-4 flex flex-col sm:flex-row items-center gap-3 shadow-subtle">
        <div className="flex-1 w-full">
          <Input
            placeholder="Buscar por Cédula, NIT, Nombre o Teléfono..."
            icon={Search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-56">
          <Select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">Todos los Estados</option>
            <option value="active">Solo Activos</option>
            <option value="inactive">Solo Inactivos</option>
            <option value="overdue_blocked">Solo Bloqueados por Mora</option>
          </Select>
        </div>
      </div>

      {/* Tabla */}
      <CustomerTable
        customers={customers}
        onEdit={handleOpenEdit}
        onViewDetail={handleOpenDetail}
        onToggleStatus={handleToggleStatus}
      />

      {/* Modales */}
      <CustomerFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveCustomer}
        customer={editingCustomer}
      />

      <CustomerDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        customer={selectedCustomer}
      />
    </div>
  );
};
