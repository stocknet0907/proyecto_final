import React, { useState, useEffect } from 'react';
import { Modal } from '../../../shared/components/Modal';
import { Input } from '../../../shared/components/Input';
import { Select } from '../../../shared/components/Select';
import { Button } from '../../../shared/components/Button';

export const CustomerFormModal = ({ isOpen, onClose, onSave, customer = null }) => {
  const isEditing = !!customer;

  const [formData, setFormData] = useState({
    documentId: '',
    name: '',
    phone: '',
    email: '',
    address: '',
    creditLimit: '1000000',
    status: 'active',
    notes: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (customer) {
      setFormData({
        documentId: customer.documentId || '',
        name: customer.name || '',
        phone: customer.phone || '',
        email: customer.email || '',
        address: customer.address || '',
        creditLimit: customer.creditLimit || '1000000',
        status: customer.status || 'active',
        notes: customer.notes || '',
      });
    } else {
      setFormData({
        documentId: '',
        name: '',
        phone: '',
        email: '',
        address: '',
        creditLimit: '2000000',
        status: 'active',
        notes: '',
      });
    }
    setErrors({});
  }, [customer, isOpen]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'El nombre o razón social es obligatorio';
    if (!formData.documentId.trim()) newErrors.documentId = 'La cédula o NIT es obligatorio';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(formData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Editar Ficha de Cliente' : 'Registrar Nuevo Cliente'}
      subtitle="Parámetros crediticios y datos de contacto comercial"
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Cédula / NIT"
            placeholder="Ej: 900.876.543-1"
            value={formData.documentId}
            onChange={(e) => handleChange('documentId', e.target.value)}
            error={errors.documentId}
            required
          />
          <Input
            label="Nombre Completo / Razón Social"
            placeholder="Ej: Transportes del Norte S.A.S."
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            error={errors.name}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Teléfono Móvil / Fijo"
            placeholder="Ej: 312-555-0192"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
          />
          <Input
            label="Correo Electrónico"
            type="email"
            placeholder="cliente@correo.com"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />
        </div>

        <Input
          label="Dirección Física"
          placeholder="Cra 45 # 12-80"
          value={formData.address}
          onChange={(e) => handleChange('address', e.target.value)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Cupo Máximo de Crédito ($ COP)"
            type="number"
            min="0"
            value={formData.creditLimit}
            onChange={(e) => handleChange('creditLimit', e.target.value)}
          />
          <Select
            label="Estado del Cliente"
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
          >
            <option value="active">Activo (Habilitado para compras)</option>
            <option value="inactive">Inactivo</option>
            <option value="overdue_blocked">Bloqueado por Mora</option>
          </Select>
        </div>

        <Input
          label="Notas y Condiciones Especiales"
          placeholder="Plazos, referencias comerciales"
          value={formData.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
        />

        <div className="flex justify-end gap-2 pt-2 border-t border-borderline/60">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="secondary" size="sm">
            {isEditing ? 'Guardar Cambios' : 'Registrar Cliente'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
