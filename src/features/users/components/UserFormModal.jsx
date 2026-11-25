import React, { useState, useEffect } from 'react';
import { Modal } from '../../../shared/components/Modal';
import { Input } from '../../../shared/components/Input';
import { Select } from '../../../shared/components/Select';
import { Button } from '../../../shared/components/Button';
import { ROLES, ROLE_LABELS } from '../../../shared/constants/roles';

export const UserFormModal = ({ isOpen, onClose, onSave, user = null }) => {
  const isEditing = !!user;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    passwordHash: '',
    role: ROLES.CASHIER,
    status: 'active',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        username: user.username || '',
        passwordHash: user.passwordHash || '',
        role: user.role || ROLES.CASHIER,
        status: user.status || 'active',
      });
    } else {
      setFormData({
        name: '',
        email: '',
        username: '',
        passwordHash: 'clave123',
        role: ROLES.CASHIER,
        status: 'active',
      });
    }
    setErrors({});
  }, [user, isOpen]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'El nombre del operador es obligatorio';
    if (!formData.email.trim()) newErrors.email = 'El correo electrónico es obligatorio';
    if (!formData.username.trim()) newErrors.username = 'El nombre de usuario es obligatorio';
    if (!formData.passwordHash) newErrors.passwordHash = 'La contraseña inicial es obligatoria';

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
      title={isEditing ? 'Editar Datos de Operador' : 'Registrar Nuevo Operador'}
      subtitle="Asignación de roles y privilegios de acceso a módulos"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nombre Completo"
          placeholder="Ej: Laura Morales"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          error={errors.name}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Usuario"
            placeholder="ej: lmorales"
            value={formData.username}
            onChange={(e) => handleChange('username', e.target.value)}
            error={errors.username}
            required
          />
          <Input
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            value={formData.passwordHash}
            onChange={(e) => handleChange('passwordHash', e.target.value)}
            error={errors.passwordHash}
            required
          />
        </div>

        <Input
          label="Correo Institucional"
          type="email"
          placeholder="lmorales@stocknet.com"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          error={errors.email}
          required
        />

        <Select
          label="Nivel de Acceso (Rol)"
          value={formData.role}
          onChange={(e) => handleChange('role', e.target.value)}
        >
          <option value={ROLES.ADMIN}>{ROLE_LABELS[ROLES.ADMIN]} (Acceso Total)</option>
          <option value={ROLES.DB_ADMIN}>{ROLE_LABELS[ROLES.DB_ADMIN]} (Almacén y Compras)</option>
          <option value={ROLES.CASHIER}>{ROLE_LABELS[ROLES.CASHIER]} (Terminal POS)</option>
        </Select>

        <div className="flex justify-end gap-2 pt-2 border-t border-borderline/60">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="secondary" size="sm">
            {isEditing ? 'Guardar Cambios' : 'Crear Operador'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
