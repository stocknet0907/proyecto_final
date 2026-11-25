import React, { useState } from 'react';
import { Plus, Search, Building2 } from 'lucide-react';
import { useSuppliers } from '../hooks/useSuppliers';
import { SupplierTable } from '../components/SupplierTable';
import { SupplierFormModal } from '../components/SupplierFormModal';
import { SupplierDetailModal } from '../components/SupplierDetailModal';
import { Button } from '../../../shared/components/Button';
import { Input } from '../../../shared/components/Input';
import { Select } from '../../../shared/components/Select';
import { useToast } from '../../../shared/components/Toast';

export const SuppliersPage = () => {
  const {
    suppliers,
    searchTerm,
    setSearchTerm,
    selectedStatus,
    setSelectedStatus,
    addSupplier,
    updateSupplier,
    toggleSupplierStatus,
  } = useSuppliers();

  const { addToast } = useToast();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  const handleOpenCreate = () => {
    setEditingSupplier(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (sup) => {
    setEditingSupplier(sup);
    setIsFormOpen(true);
  };

  const handleOpenDetail = (sup) => {
    setSelectedSupplier(sup);
    setIsDetailOpen(true);
  };

  const handleSaveSupplier = (supData) => {
    if (editingSupplier) {
      updateSupplier(editingSupplier.id, supData);
      addToast({ message: 'Proveedor actualizado exitosamente.', type: 'success' });
    } else {
      addSupplier(supData);
      addToast({ message: 'Nuevo proveedor registrado.', type: 'success' });
    }
  };

  const handleToggleStatus = (id) => {
    toggleSupplierStatus(id);
    addToast({ message: 'Estado de proveedor actualizado.', type: 'info' });
  };

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-2xl text-ink-base">
            Directorio de Proveedores & Abastecimiento
          </h2>
          <p className="text-xs sm:text-sm text-ink-muted">
            Acuerdos de nivel de servicio, tiempos de entrega y canales comerciales
          </p>
        </div>
        <Button variant="secondary" onClick={handleOpenCreate} icon={Plus}>
          Registrar Proveedor
        </Button>
      </div>

      {/* Filtros */}
      <div className="bg-surface-lowest border border-borderline rounded-lg p-4 flex flex-col sm:flex-row items-center gap-3 shadow-subtle">
        <div className="flex-1 w-full">
          <Input
            placeholder="Buscar por NIT, Razón Social o Contacto..."
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
          </Select>
        </div>
      </div>

      {/* Tabla */}
      <SupplierTable
        suppliers={suppliers}
        onEdit={handleOpenEdit}
        onViewDetail={handleOpenDetail}
        onToggleStatus={handleToggleStatus}
      />

      {/* Modales */}
      <SupplierFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveSupplier}
        supplier={editingSupplier}
      />

      <SupplierDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        supplier={selectedSupplier}
      />
    </div>
  );
};
