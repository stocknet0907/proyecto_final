import React, { useState, useEffect } from 'react';
import { Modal } from '../../../shared/components/Modal';
import { Input } from '../../../shared/components/Input';
import { Button } from '../../../shared/components/Button';

export const CategoryFormModal = ({ isOpen, onClose, onSave, category = null }) => {
  const isEditing = !!category;

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    department: '',
    description: '',
    active: true,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (category) {
      setFormData({
        code: category.code || '',
        name: category.name || '',
        department: category.department || '',
        description: category.description || '',
        active: category.active !== undefined ? category.active : true,
      });
    } else {
      setFormData({
        code: `CAT-${Math.floor(100 + Math.random() * 900)}`,
        name: '',
        department: 'Mantenimiento General',
        description: '',
        active: true,
      });
    }
    setErrors({});
  }, [category, isOpen]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'El nombre de la categoría es obligatorio';
    if (!formData.code.trim()) newErrors.code = 'El código es obligatorio';

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
      title={isEditing ? 'Editar Categoría' : 'Nueva Categoría de Inventario'}
      subtitle="Clasificación de productos por departamento comercial"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Código de Categoría"
          placeholder="Ej: CAT-LUB"
          value={formData.code}
          onChange={(e) => handleChange('code', e.target.value)}
          error={errors.code}
          required
        />

        <Input
          label="Nombre de la Categoría"
          placeholder="Ej: Lubricantes y Fluidos"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          error={errors.name}
          required
        />

        <Input
          label="Departamento"
          placeholder="Ej: Mantenimiento Automotriz"
          value={formData.department}
          onChange={(e) => handleChange('department', e.target.value)}
        />

        <Input
          label="Descripción Operativa"
          placeholder="Breve reseña de los artículos agrupados"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
        />

        <div className="flex justify-end gap-2 pt-2 border-t border-borderline/60">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="secondary" size="sm">
            {isEditing ? 'Guardar Cambios' : 'Crear Categoría'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
