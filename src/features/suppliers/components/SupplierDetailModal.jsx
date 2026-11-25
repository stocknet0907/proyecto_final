import React from 'react';
import { Modal } from '../../../shared/components/Modal';
import { Badge } from '../../../shared/components/Badge';
import { Button } from '../../../shared/components/Button';
import { Building2, Phone, Mail, Clock, Star } from 'lucide-react';

export const SupplierDetailModal = ({ isOpen, onClose, supplier }) => {
  if (!supplier) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Ficha Técnica de Proveedor"
      subtitle={supplier.companyName}
      maxWidth="max-w-lg"
    >
      <div className="space-y-4">
        {/* Encabezado con estado y NIT */}
        <div className="flex items-center justify-between p-3.5 bg-surface-container rounded-lg border border-borderline">
          <div>
            <span className="text-xs text-ink-muted block font-mono">NIT / Identificación</span>
            <span className="font-mono font-bold text-sm text-primary">{supplier.taxId}</span>
          </div>
          <Badge variant={supplier.active ? 'success' : 'neutral'}>
            {supplier.active ? 'Proveedor Activo' : 'Inactivo'}
          </Badge>
        </div>

        {/* Datos de Contacto */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-surface-lowest border border-borderline rounded-sm space-y-1">
            <span className="text-ink-muted flex items-center gap-1.5 font-semibold">
              <Building2 className="w-3.5 h-3.5 text-primary" /> Contacto Comercial
            </span>
            <p className="font-medium text-ink-base">{supplier.contactPerson || 'No registrado'}</p>
          </div>

          <div className="p-3 bg-surface-lowest border border-borderline rounded-sm space-y-1">
            <span className="text-ink-muted flex items-center gap-1.5 font-semibold">
              <Phone className="w-3.5 h-3.5 text-primary" /> Teléfono
            </span>
            <p className="font-medium text-ink-base">{supplier.phone || 'No registrado'}</p>
          </div>

          <div className="p-3 bg-surface-lowest border border-borderline rounded-sm space-y-1">
            <span className="text-ink-muted flex items-center gap-1.5 font-semibold">
              <Mail className="w-3.5 h-3.5 text-primary" /> Correo Electrónico
            </span>
            <p className="font-medium text-ink-base">{supplier.email || 'No registrado'}</p>
          </div>

          <div className="p-3 bg-surface-lowest border border-borderline rounded-sm space-y-1">
            <span className="text-ink-muted flex items-center gap-1.5 font-semibold">
              <Clock className="w-3.5 h-3.5 text-primary" /> Plazo de Entrega
            </span>
            <p className="font-medium text-ink-base">{supplier.leadTimeDays} días hábiles</p>
          </div>
        </div>

        {/* Observaciones y Categorías */}
        {supplier.notes && (
          <div className="p-3 bg-surface-low border border-borderline rounded-sm text-xs">
            <span className="font-semibold text-ink-base block mb-0.5">Observaciones:</span>
            <p className="text-ink-muted leading-relaxed">{supplier.notes}</p>
          </div>
        )}

        <div className="flex justify-end pt-2 border-t border-borderline/60">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cerrar Ficha
          </Button>
        </div>
      </div>
    </Modal>
  );
};
