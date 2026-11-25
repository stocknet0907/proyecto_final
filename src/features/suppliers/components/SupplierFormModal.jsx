import React, { useState, useEffect } from 'react';
import { Modal } from '../../../shared/components/Modal';
import { Input } from '../../../shared/components/Input';
import { Select } from '../../../shared/components/Select';
import { Button } from '../../../shared/components/Button';

export const SupplierFormModal = ({ isOpen, onClose, onSave, supplier = null }) => {
  const isEditing = !!supplier;

  const [formData, setFormData] = useState({
    taxId: '',
    companyName: '',
    contactPerson: '',
    phone: '',
    email: '',
    leadTimeDays: '3',
    rating: '5',
    active: true,
    notes: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (supplier) {
      setFormData({
        taxId: supplier.taxId || '',
        companyName: supplier.companyName || '',
        contactPerson: supplier.contactPerson || '',
        phone: supplier.phone || '',
        email: supplier.email || '',
        leadTimeDays: supplier.leadTimeDays || '3',
        rating: supplier.rating || '5',
        active: supplier.active !== undefined ? supplier.active : true,
        notes: supplier.notes || '',
      });
    } else {
      setFormData({
        taxId: '',
        companyName: '',
        contactPerson: '',
        phone: '',
        email: '',
        leadTimeDays: '3',
        rating: '5',
        active: true,
        notes: '',
      });
    }
    setErrors({});
  }, [supplier, isOpen]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.companyName.trim()) newErrors.companyName = 'La razón social es obligatoria';
    if (!formData.taxId.trim()) newErrors.taxId = 'El NIT / Identificación fiscal es obligatorio';

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
      title={isEditing ? 'Editar Proveedor' : 'Registrar Nuevo Proveedor'}
      subtitle="Datos comerciales y acuerdos de nivel de servicio"
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="NIT / Identificación Fiscal"
            placeholder="Ej: 900.542.118-4"
            value={formData.taxId}
            onChange={(e) => handleChange('taxId', e.target.value)}
            error={errors.taxId}
            required
          />
          <Input
            label="Razón Social"
            placeholder="Ej: Distribuidora Mobil Colombia"
            value={formData.companyName}
            onChange={(e) => handleChange('companyName', e.target.value)}
            error={errors.companyName}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Persona de Contacto"
            placeholder="Ej: Mariana Restrepo"
            value={formData.contactPerson}
            onChange={(e) => handleChange('contactPerson', e.target.value)}
          />
          <Input
            label="Teléfono Comercial"
            placeholder="Ej: 601-380-4500"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
          />
        </div>

        <Input
          label="Correo Electrónico de Pedidos"
          type="email"
          placeholder="ventas@proveedor.com"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Plazo de Entrega (Días hábiles)"
            type="number"
            min="1"
            value={formData.leadTimeDays}
            onChange={(e) => handleChange('leadTimeDays', e.target.value)}
          />
          <Select
            label="Calificación de Servicio"
            value={formData.rating}
            onChange={(e) => handleChange('rating', e.target.value)}
          >
            <option value="5">★★★★★ (5 - Excelente)</option>
            <option value="4">★★★★☆ (4 - Bueno)</option>
            <option value="3">★★★☆☆ (3 - Aceptable)</option>
            <option value="2">★★☆☆☆ (2 - Irregular)</option>
            <option value="1">★☆☆☆☆ (1 - Deficiente)</option>
          </Select>
        </div>

        <Input
          label="Observaciones Comerciales"
          placeholder="Condiciones de pago, líneas de crédito, acuerdos"
          value={formData.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
        />

        <div className="flex justify-end gap-2 pt-2 border-t border-borderline/60">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="secondary" size="sm">
            {isEditing ? 'Guardar Cambios' : 'Registrar Proveedor'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
